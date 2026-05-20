# 通过 Win32 API 拿当前前台窗口的进程名（用于活动检测）
# 输出: 进程名（如 "Code"、"chrome"、"Spotify"）
$ErrorActionPreference = 'SilentlyContinue'

$signature = @'
[DllImport("user32.dll")]
public static extern IntPtr GetForegroundWindow();
[DllImport("user32.dll")]
public static extern int GetWindowThreadProcessId(IntPtr hwnd, out int processId);
'@

Add-Type -MemberDefinition $signature -Name 'ClawdWin32' -Namespace 'Native' -ErrorAction SilentlyContinue

$hwnd = [Native.ClawdWin32]::GetForegroundWindow()
$processId = 0
[Native.ClawdWin32]::GetWindowThreadProcessId($hwnd, [ref]$processId) | Out-Null

try {
  $proc = Get-Process -Id $processId -ErrorAction Stop
  Write-Output $proc.ProcessName
} catch {
  Write-Output ''
}
