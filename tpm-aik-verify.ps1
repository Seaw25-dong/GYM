# The user explicitly authorized AIK enrollment at Microsoft's microsoftaik.azure.net service.
param([switch]$UseVerifiedIssuerEndpoint, [switch]$ReadOnly)
$ErrorActionPreference='Stop'
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
public static class ActivisionPublicKeyCheck {
 [DllImport("ncrypt.dll", CharSet=CharSet.Unicode)] static extern int NCryptOpenStorageProvider(out IntPtr p, string name, int flags);
 [DllImport("ncrypt.dll", CharSet=CharSet.Unicode)] static extern int NCryptOpenKey(IntPtr p, out IntPtr k, string name, int legacy, int flags);
 [DllImport("ncrypt.dll", CharSet=CharSet.Unicode)] static extern int NCryptExportKey(IntPtr k, IntPtr exportKey, string blobType, IntPtr parameters, byte[] output, int outputSize, out int resultSize, int flags);
 [DllImport("ncrypt.dll")] static extern int NCryptFreeObject(IntPtr p);
 [DllImport("ncrypt.dll", CharSet=CharSet.Unicode)] static extern int NCryptGetProperty(IntPtr k, string property, byte[] output, int outputSize, out int resultSize, int flags);
 static void Ok(int rc) { if(rc!=0) throw new Exception("CNG: 0x"+rc.ToString("X8")); }
 public static string Hash() {
  IntPtr p=IntPtr.Zero, k=IntPtr.Zero;
  try { Ok(NCryptOpenStorageProvider(out p,"Microsoft Platform Crypto Provider",0));
   Ok(NCryptOpenKey(p,out k,"ActivisionAIK",0,32));
   int n; Ok(NCryptExportKey(k,IntPtr.Zero,"RSAPUBLICBLOB",IntPtr.Zero,null,0,out n,0));
   if(n<24 || n>8192) throw new Exception("Unexpected public RSA blob size");
   byte[] b=new byte[n]; Ok(NCryptExportKey(k,IntPtr.Zero,"RSAPUBLICBLOB",IntPtr.Zero,b,b.Length,out n,0));
   using(var sha=SHA256.Create()) { return BitConverter.ToString(sha.ComputeHash(b,0,n)).Replace("-",""); }
  } finally { if(k!=IntPtr.Zero) NCryptFreeObject(k); if(p!=IntPtr.Zero) NCryptFreeObject(p); }
 }
 public static byte[] Certificate() {
  IntPtr p=IntPtr.Zero, k=IntPtr.Zero;
  try { Ok(NCryptOpenStorageProvider(out p,"Microsoft Platform Crypto Provider",0));
   Ok(NCryptOpenKey(p,out k,"ActivisionAIK",0,32));
   int n; Ok(NCryptGetProperty(k,"SmartCardKeyCertificate",null,0,out n,0));
   if(n<100 || n>16384) throw new Exception("Unexpected AIK certificate size");
   byte[] b=new byte[n]; Ok(NCryptGetProperty(k,"SmartCardKeyCertificate",b,b.Length,out n,0));
   Array.Resize(ref b,n); return b;
  } finally { if(k!=IntPtr.Zero) NCryptFreeObject(k); if(p!=IntPtr.Zero) NCryptFreeObject(p); }
 }
}
'@
$beforeHash=[ActivisionPublicKeyCheck]::Hash()
'Existing ActivisionAIK public key SHA256: '+$beforeHash
if ($ReadOnly) {
    $raw=[ActivisionPublicKeyCheck]::Certificate()
    $cert=New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList (,$raw)
    $cert | Select-Object Subject,Issuer,Thumbprint,NotBefore,NotAfter | Format-List
    [IO.File]::WriteAllBytes('D:\New folder (2)\GYM\tpm-certificates\ActivisionAIK-enrolled.cer',$raw)
    if($cert.Thumbprint -ne '4B8755E596435C077CC32722918358FF80AF43D4') { throw 'Unexpected enrolled AIK certificate.' }
    if($beforeHash -ne '0A8FFE3CEB9BB58A73C0B8F0F8E925A449DD83433C172666EAD362982559DBF7') { throw 'Unexpected ActivisionAIK public key.' }
    'Confirmed: Microsoft AIK certificate is persisted on the original ActivisionAIK key.'
    return
}
$reqInfo=New-Object System.Diagnostics.ProcessStartInfo
$reqInfo.FileName='C:\Windows\System32\certreq.exe'
$reqInfo.Arguments='-enrollaik -q -machine -config "" ActivisionAIK'
if ($UseVerifiedIssuerEndpoint) {
    # This authority's identifier is the SKI of Intel's official ADL issuing CA,
    # referenced by this TPM ROM certificate's AIA and Authority Key Identifier.
    $reqInfo.Arguments='-enrollaik -q -machine -config "https://INTC-KeyId-34219b21f477f6c7f78a0f26b23d0430deea4363.microsoftaik.azure.net/templates/Aik/scep" ActivisionAIK'
}
$reqInfo.UseShellExecute=$false
$reqInfo.CreateNoWindow=$true
$reqInfo.RedirectStandardOutput=$true
$reqInfo.RedirectStandardError=$true
$reqProcess=New-Object System.Diagnostics.Process
$reqProcess.StartInfo=$reqInfo
[void]$reqProcess.Start()
$stdout=$reqProcess.StandardOutput.ReadToEnd()
$stderr=$reqProcess.StandardError.ReadToEnd()
$reqProcess.WaitForExit()
$stdout
$stderr
'Certificate enrollment process exit: '+$reqProcess.ExitCode
$afterHash=[ActivisionPublicKeyCheck]::Hash()
'Existing public key preserved: '+($afterHash -eq $beforeHash)
if($afterHash -ne $beforeHash) { throw 'Activision public key changed unexpectedly.' }
