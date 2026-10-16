param([switch]$Apply, [switch]$Rollback)
$ErrorActionPreference='Stop'
$taskDir='D:\New folder (2)\GYM'
$certDir=Join-Path $taskDir 'tpm-certificates'
$manifestPath=Join-Path $taskDir 'tpm-repair-manifest.json'
$thumbprints=@(
    '3706D6CC75ACF3E4AF4E6C57E637DA7EE65691FC',
    '84B0D83C9D78D0B00F796C430BCBA32C5C609BE5',
    '97E87874DA2DD9E358224A350675D2243AD26B0F'
)
$leafThumbprint='31AF87E7C0FE364BC554ABE41FE0B86D1E03F58B'
function Read-Cert([string]$file) {
    New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList (,[IO.File]::ReadAllBytes($file))
}
function Save-Manifest($manifest) {
    $manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding UTF8
}
if ($Apply -and $Rollback) { throw 'Choose Apply or Rollback, not both.' }

if ($Rollback) {
    $manifest=Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    if ($manifest.LeafThumbprint -ne $leafThumbprint) { throw 'Unexpected repair manifest.' }
    $store=New-Object System.Security.Cryptography.X509Certificates.X509Store -ArgumentList 'CA','LocalMachine'
    try {
        $store.Open('ReadWrite')
        foreach($thumb in @($manifest.Added)) {
            if ($thumbprints -notcontains $thumb) { throw 'Unexpected rollback certificate.' }
            foreach($cert in @($store.Certificates | Where-Object Thumbprint -EQ $thumb)) { $store.Remove($cert); 'Removed repair certificate: '+$thumb }
        }
    } finally { $store.Close() }
    $manifest.Status='RolledBack'; Save-Manifest $manifest
    return
}

$certificates=@($thumbprints | ForEach-Object {
    $cert=Read-Cert (Join-Path $certDir ($_.ToString()+'.cer'))
    if ($cert.Thumbprint -ne $_) { throw 'Certificate fingerprint mismatch.' }
    $basic=@($cert.Extensions | Where-Object { $_.Oid.Value -eq '2.5.29.19' })[0]
    if (!$basic -or !$basic.CertificateAuthority -or $cert.Subject -eq $cert.Issuer) { throw 'Expected an intermediate CA certificate.' }
    $cert
})
$leaf=Read-Cert (Join-Path $certDir 'NV-EK-RSA.cer')
if ($leaf.Thumbprint -ne $leafThumbprint) { throw 'Unexpected TPM leaf.' }
$chain=New-Object System.Security.Cryptography.X509Certificates.X509Chain
try {
    # Revocation is skipped only for this offline diagnostic; system policy is unchanged.
    $chain.ChainPolicy.RevocationMode='NoCheck'
    $certificates | ForEach-Object { [void]$chain.ChainPolicy.ExtraStore.Add($_) }
    @('Intel-ADL-issuer.cer','Intel-ODCA-intermediate.cer','Intel-ODCA-root.cer') | ForEach-Object { [void]$chain.ChainPolicy.ExtraStore.Add((Read-Cert (Join-Path $certDir $_))) }
    [void]$chain.Build($leaf)
    $unexpected=@($chain.ChainStatus | Where-Object { $_.Status -ne 'UntrustedRoot' })
    if ($unexpected.Count -ne 0 -or $chain.ChainElements.Count -ne 7) { throw 'The complete Intel signature chain failed verification.' }
    $expectedPath=@($leafThumbprint)+$thumbprints+@('1165BCED7658A41851E9382FECF3FA4F372FABED','92578E21A1066C5882A119895B257C8C69707871','5DED286E2D89817F61FD44ABD4C6A02F77D3A0B3')
    for($i=0;$i -lt $expectedPath.Count;$i++) { if ($chain.ChainElements[$i].Certificate.Thumbprint -ne $expectedPath[$i]) { throw 'Unexpected Intel chain path.' } }
} finally { $chain.Dispose() }

'Verified three certificates read from this TPM. Only LocalMachine\CA will receive them.'
$certificates | Select-Object Subject,Thumbprint | Format-Table -AutoSize
if (!$Apply) { 'Preview only. Apply and Rollback are explicit options.'; return }

$liveLeaf=@((Get-TpmEndorsementKeyInfo -HashAlgorithm SHA256).ManufacturerCertificates)[0]
if ($liveLeaf.Thumbprint -ne $leafThumbprint) { throw 'Live TPM has changed; stop and re-diagnose.' }
if (Test-Path -LiteralPath $manifestPath) { throw 'Repair manifest already exists; review it before running again.' }
$backupDir=Join-Path $taskDir ('tpm-backup-'+(Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $backupDir | Out-Null
reg.exe export 'HKLM\SYSTEM\CurrentControlSet\Services\TPM\WMI\Endorsement' (Join-Path $backupDir 'Endorsement.reg') /y
if ($LASTEXITCODE -ne 0) { throw 'Could not back up the TPM certificate cache.' }
Get-ChildItem Cert:\LocalMachine\CA | Select-Object Subject,Issuer,Thumbprint | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath (Join-Path $backupDir 'CA-store-before.json') -Encoding UTF8
$manifest=[ordered]@{ LeafThumbprint=$leafThumbprint; BackupDirectory=$backupDir; Added=@(); Status='Applying' }
Save-Manifest $manifest
$store=New-Object System.Security.Cryptography.X509Certificates.X509Store -ArgumentList 'CA','LocalMachine'
try {
    $store.Open('ReadWrite')
    foreach($cert in $certificates) {
        if (@($store.Certificates | Where-Object Thumbprint -EQ $cert.Thumbprint).Count -eq 0) {
            $manifest.Added+= $cert.Thumbprint
            Save-Manifest $manifest
            $store.Add($cert)
            'Added: '+$cert.Subject+' / '+$cert.Thumbprint
        }
    }
} finally { $store.Close() }
$postChain=New-Object System.Security.Cryptography.X509Certificates.X509Chain
try {
    $postChain.ChainPolicy.RevocationMode='NoCheck'
    [void]$postChain.Build($liveLeaf)
    # No ExtraStore here: test the actual Windows certificate store after import.
    $badStatus=@($postChain.ChainStatus | Where-Object { $_.Status -notin @('PartialChain','UntrustedRoot') })
    $selected=@($postChain.ChainElements | ForEach-Object { $_.Certificate.Thumbprint })
    if ($badStatus.Count -ne 0 -or @($thumbprints | Where-Object { $selected -notcontains $_ }).Count -ne 0) { throw 'Windows did not select the repaired chain. Use Rollback and investigate.' }
    'Actual Windows chain has no certificate signature errors.'
    $postChain.ChainStatus | Format-List Status,StatusInformation
} finally { $postChain.Dispose() }
$manifest.Status='ImportedAndVerified'; Save-Manifest $manifest
'TPM clear, key deletion, registry edits, and Root-store imports were not performed.'
'Next: retry Generate Key in the official Call of Duty Secure Attestation Wizard.'
