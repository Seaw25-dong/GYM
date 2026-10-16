$ErrorActionPreference='Stop'
Add-Type -AssemblyName UIAutomationClient,UIAutomationTypes,System.Drawing
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class CodScanWindow {
 [StructLayout(LayoutKind.Sequential)] public struct Point { public int X,Y; }
 [StructLayout(LayoutKind.Sequential)] public struct Rect { public int Left,Top,Right,Bottom; }
 [DllImport("user32.dll")] public static extern bool ScreenToClient(IntPtr h,ref Point p);
 [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr h,out Rect r);
 [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h,out Rect r);
 [DllImport("user32.dll",SetLastError=true)] public static extern bool PostMessage(IntPtr h,uint msg,IntPtr w,IntPtr l);
 [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h,IntPtr dc,uint flags);
}
'@
$codProc=Get-Process CODSecureAttestationWizard -ErrorAction Stop | Select-Object -First 1
$codHwnd=$codProc.MainWindowHandle
$codRoot=[System.Windows.Automation.AutomationElement]::FromHandle($codHwnd)
$codScan=$codRoot.FindFirst([System.Windows.Automation.TreeScope]::Descendants,(New-Object System.Windows.Automation.PropertyCondition -ArgumentList ([System.Windows.Automation.AutomationElement]::NameProperty),'Run Scan'))
if(!$codScan -or !$codScan.Current.IsEnabled -or $codScan.Current.IsOffscreen) { throw 'Visible enabled Run Scan control unavailable.' }
$codInvoked=$false
$codAncestor=$codScan
for($j=0;$j -lt 4;$j++) {
    [object]$codInvoke=$null
    if($codAncestor.TryGetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern,[ref]$codInvoke)) { $codInvoke.Invoke(); $codInvoked=$true; break }
    $codAncestor=[System.Windows.Automation.TreeWalker]::ControlViewWalker.GetParent($codAncestor)
    if(!$codAncestor -or $codAncestor -eq $codRoot) { break }
}
if(!$codInvoked) {
    # This WPF text control handles pointer clicks without exposing InvokePattern.
    # Dispatch only to this verified COD window, using the current Run Scan rectangle.
    $codBounds=$codScan.Current.BoundingRectangle
    if($codBounds.Width -lt 1 -or $codBounds.Height -lt 1) { throw 'Invalid scan bounds.' }
    $codPoint=New-Object CodScanWindow+Point
    $codPoint.X=[int]($codBounds.X+$codBounds.Width/2)
    $codPoint.Y=[int]($codBounds.Y+$codBounds.Height/2)
    if(![CodScanWindow]::ScreenToClient($codHwnd,[ref]$codPoint)) { throw 'Point conversion failed.' }
    $codClient=New-Object CodScanWindow+Rect
    if(![CodScanWindow]::GetClientRect($codHwnd,[ref]$codClient)) { throw 'Client bounds unavailable.' }
    if($codPoint.X -lt 0 -or $codPoint.Y -lt 0 -or $codPoint.X -ge $codClient.Right -or $codPoint.Y -ge $codClient.Bottom -or $codPoint.X -gt 32767 -or $codPoint.Y -gt 32767) { throw 'Scan point outside COD client.' }
    $codMousePosition=[IntPtr](($codPoint.Y -shl 16) -bor $codPoint.X)
    if(![CodScanWindow]::PostMessage($codHwnd,0x200,[IntPtr]::Zero,$codMousePosition)) { throw 'Move message failed.' }
    if(![CodScanWindow]::PostMessage($codHwnd,0x201,[IntPtr]1,$codMousePosition)) { throw 'Scan down message failed.' }
    if(![CodScanWindow]::PostMessage($codHwnd,0x202,[IntPtr]::Zero,$codMousePosition)) { throw 'Scan up message failed.' }
}
'Invoked Run Scan in COD Secure Attestation Wizard.'
$codDeadline=(Get-Date).AddSeconds(30)
do {
    Start-Sleep -Milliseconds 500
    $codComplete=$codRoot.FindFirst([System.Windows.Automation.TreeScope]::Descendants,(New-Object System.Windows.Automation.PropertyCondition -ArgumentList ([System.Windows.Automation.AutomationElement]::NameProperty),'Scan Complete'))
} while(!$codComplete -and (Get-Date) -lt $codDeadline)
$codTree=$codRoot.FindAll([System.Windows.Automation.TreeScope]::Descendants,[System.Windows.Automation.Condition]::TrueCondition)
for($i=0;$i -lt [Math]::Min($codTree.Count,160);$i++) { $codElement=$codTree.Item($i); if($codElement.Current.Name -and $codElement.Current.ControlType -eq [System.Windows.Automation.ControlType]::Text) { $codElement.Current.Name } }
$codRect=New-Object CodScanWindow+Rect
[void][CodScanWindow]::GetWindowRect($codHwnd,[ref]$codRect)
$codBitmap=New-Object System.Drawing.Bitmap -ArgumentList ($codRect.Right-$codRect.Left),($codRect.Bottom-$codRect.Top)
$codGraphics=[System.Drawing.Graphics]::FromImage($codBitmap)
$codDc=$codGraphics.GetHdc()
try { $codCaptured=[CodScanWindow]::PrintWindow($codHwnd,$codDc,2) } finally { $codGraphics.ReleaseHdc($codDc); $codGraphics.Dispose() }
try { if($codCaptured) { $codBitmap.Save('D:\New folder (2)\GYM\cod-attestation-after.png',[System.Drawing.Imaging.ImageFormat]::Png) } } finally { $codBitmap.Dispose() }
