# Read-only Intel PTT certificate diagnosis. No TPM write or clear commands.
$ErrorActionPreference = 'Stop'
$diagnosticDir = 'D:\New folder (2)\GYM\tpm-certificates'
New-Item -ItemType Directory -Path $diagnosticDir -Force | Out-Null
Add-Type -TypeDefinition @'
using System;
using System.IO;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public sealed class ReadOnlyTpmCertificates : IDisposable {
    [StructLayout(LayoutKind.Sequential)] struct Params { public uint version; public uint flags; }
    [DllImport("tbs.dll")] static extern uint Tbsi_Context_Create(ref Params p, out IntPtr c);
    [DllImport("tbs.dll")] static extern uint Tbsip_Context_Close(IntPtr c);
    [DllImport("tbs.dll")] static extern uint Tbsip_Submit_Command(IntPtr c, uint locality, uint priority, byte[] command, uint commandLen, byte[] response, ref uint responseLen);
    IntPtr context;
    public ReadOnlyTpmCertificates() {
        Params p = new Params { version = 2, flags = 4 };
        uint rc = Tbsi_Context_Create(ref p, out context);
        if (rc != 0) throw new Exception("TBS context: 0x" + rc.ToString("X8"));
    }
    static uint U32(byte[] a, int i) { return ((uint)a[i]<<24)|((uint)a[i+1]<<16)|((uint)a[i+2]<<8)|a[i+3]; }
    static ushort U16(byte[] a, int i) { return (ushort)((a[i]<<8)|a[i+1]); }
    static void Put32(List<byte> b, uint n) { b.Add((byte)(n>>24)); b.Add((byte)(n>>16)); b.Add((byte)(n>>8)); b.Add((byte)n); }
    static void Put16(List<byte> b, ushort n) { b.Add((byte)(n>>8)); b.Add((byte)n); }
    byte[] Send(ushort tag, uint cc, List<byte> body) {
        if (cc != 0x17A && cc != 0x169 && cc != 0x14E) throw new Exception("Non-read command forbidden");
        List<byte> cmd = new List<byte>(); Put16(cmd,tag); Put32(cmd,(uint)(10+body.Count)); Put32(cmd,cc); cmd.AddRange(body);
        byte[] buf = new byte[8192]; uint len = (uint)buf.Length;
        uint rc = Tbsip_Submit_Command(context,0,200,cmd.ToArray(),(uint)cmd.Count,buf,ref len);
        if (rc != 0) throw new Exception("TBS submit: 0x"+rc.ToString("X8"));
        if (len<10 || len>buf.Length || U32(buf,2)!=len) throw new Exception("Invalid TPM response size");
        if (U32(buf,6)!=0) throw new Exception("TPM response: 0x"+U32(buf,6).ToString("X8"));
        byte[] result=new byte[len]; Array.Copy(buf,result,len); return result;
    }
    static bool Allowed(uint index) { return index==0x01C00002 || (index>=0x01C00100 && index<=0x01C001FF); }
    public uint[] Indexes() {
        List<uint> result = new List<uint>(); uint start=0x01C00000;
        for (int page=0; page<4; page++) {
            List<byte> body=new List<byte>(); Put32(body,1); Put32(body,start); Put32(body,128);
            byte[] r=Send(0x8001,0x17A,body);
            if (r.Length<19 || U16(r,0)!=0x8001 || U32(r,11)!=1) throw new Exception("Invalid handles response");
            uint count=U32(r,15); if (count>128 || r.Length!=19+4*count) throw new Exception("Invalid handles count");
            uint last=start;
            for (int i=0;i<count;i++) { uint h=U32(r,19+4*i); last=h; if (Allowed(h)) result.Add(h); }
            if (count==0 || r[10]==0 || last>=0x01C001FF) break;
            if (last<start) throw new Exception("Invalid handle ordering"); start=last+1;
        }
        return result.ToArray();
    }
    public byte[] Read(uint index) {
        if (!Allowed(index)) throw new Exception("Index outside certificate allowlist");
        List<byte> body=new List<byte>(); Put32(body,index);
        byte[] p=Send(0x8001,0x169,body);
        if (p.Length<26 || U16(p,0)!=0x8001 || U32(p,12)!=index) throw new Exception("Invalid NV public response");
        int policy=U16(p,22); int publicLen=U16(p,10);
        if (publicLen!=14+policy || p.Length<26+policy) throw new Exception("Invalid NV public length");
        uint attrs=U32(p,18); int size=U16(p,24+policy);
        Console.WriteLine("NV 0x{0:X8}: bytes={1}, attributes=0x{2:X8}",index,size,attrs);
        // Empty authorization is attempted only on ordinary public, NO_DA certificate indexes.
        if ((attrs&0x00040000)==0 || (attrs&0x02000000)==0 || (attrs&0xF0)!=0 || (attrs&0x10000000)!=0)
            throw new Exception("Index not safely public-readable; no authorization attempted");
        if (size<1 || size>16384) throw new Exception("Unexpected certificate index size");
        byte[] all=new byte[size];
        for (int offset=0;offset<size;) {
            ushort want=(ushort)Math.Min(512,size-offset);
            body=new List<byte>(); Put32(body,index); Put32(body,index); Put32(body,9);
            Put32(body,0x40000009); Put16(body,0); body.Add(0); Put16(body,0); Put16(body,want); Put16(body,(ushort)offset);
            byte[] r=Send(0x8002,0x14E,body);
            if (r.Length<21 || U16(r,0)!=0x8002 || U32(r,10)!=(uint)(2+want) || U16(r,14)!=want || r.Length<16+want+5)
                throw new Exception("Invalid NV read response");
            Array.Copy(r,16,all,offset,want); offset+=want;
        }
        return all;
    }
    public void Dispose() { if (context!=IntPtr.Zero) { Tbsip_Context_Close(context); context=IntPtr.Zero; } }
}
'@

$reader = New-Object ReadOnlyTpmCertificates
$nvCertificates = @()
$combined = New-Object 'System.Collections.Generic.List[byte]'
try {
    $indexes = $reader.Indexes()
    foreach ($index in $indexes) {
        $raw = $reader.Read($index)
        [IO.File]::WriteAllBytes((Join-Path $diagnosticDir ('NV-{0:X8}.bin' -f $index)), $raw)
        if ($index -ge 0x01C00100) { $combined.AddRange([byte[]]$raw) }
        else { [IO.File]::WriteAllBytes((Join-Path $diagnosticDir 'NV-EK-RSA.cer'),$raw) }
    }
} finally { $reader.Dispose() }

$bytes = $combined.ToArray()
for ($i=0; $i -lt $bytes.Length-4; $i++) {
    if ($bytes[$i] -ne 0x30) { continue }
    $lengthByte = [int]$bytes[$i+1]
    $headerSize=2; $contentSize=$lengthByte
    if ($lengthByte -band 0x80) {
        $n=$lengthByte -band 0x7f
        if ($n -lt 1 -or $n -gt 3 -or $i+2+$n -gt $bytes.Length) { continue }
        $headerSize+= $n; $contentSize=0
        for ($j=0; $j -lt $n; $j++) { $contentSize=($contentSize -shl 8) -bor $bytes[$i+2+$j] }
    }
    $totalSize=$headerSize+$contentSize
    if ($totalSize -lt 200 -or $i+$totalSize -gt $bytes.Length) { continue }
    $der=New-Object byte[] $totalSize
    [Array]::Copy($bytes,$i,$der,0,$totalSize)
    try { $cert=New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList (,$der) } catch { continue }
    if ($cert.Subject -notmatch '^CN=CSME ADL (ROM CA|SVN01 Kernel CA|PTT  01SVN)$') { continue }
    if ($cert.RawData.Length -ne $totalSize) { continue }
    if ($nvCertificates.Thumbprint -contains $cert.Thumbprint) { continue }
    $nvCertificates += $cert
    [IO.File]::WriteAllBytes((Join-Path $diagnosticDir ($cert.Thumbprint+'.cer')),$cert.RawData)
    '=== NV CERTIFICATE ==='
    $cert | Select-Object Subject,Issuer,Thumbprint,NotAfter | Format-List
    # Skip the entire certificate so its unsigned TBSCertificate is never treated as another certificate.
    $i += $totalSize - 1
}
if ($nvCertificates.Count -ne 3) { throw ('Expected three Intel ADL intermediates, found '+$nvCertificates.Count) }
$ek=@((Get-TpmEndorsementKeyInfo -HashAlgorithm SHA256).ManufacturerCertificates)[0]
[IO.File]::WriteAllBytes((Join-Path $diagnosticDir 'Windows-EK-RSA.cer'),$ek.RawData)
$nvEk=New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList (,[IO.File]::ReadAllBytes((Join-Path $diagnosticDir 'NV-EK-RSA.cer')))
'Windows and NV leaf match: '+($ek.Thumbprint -eq $nvEk.Thumbprint)
$chain=New-Object System.Security.Cryptography.X509Certificates.X509Chain
$chain.ChainPolicy.RevocationMode='NoCheck'
$chain.ChainPolicy.UrlRetrievalTimeout=[TimeSpan]::FromSeconds(5)
foreach ($cert in $nvCertificates) { [void]$chain.ChainPolicy.ExtraStore.Add($cert) }
'=== WINDOWS LEAF WITH NV INTERMEDIATES ==='
'Build: '+$chain.Build($ek)
$chain.ChainStatus | Format-List Status,StatusInformation
$chain.ChainElements | ForEach-Object { $_.Certificate | Select-Object Subject,Issuer,Thumbprint | Format-List; $_.ChainElementStatus | Format-List Status,StatusInformation }
'=== END ==='
