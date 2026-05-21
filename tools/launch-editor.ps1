$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $ScriptDir "..")
$RepoRootLiteral = $RepoRoot.Path.Replace("'", "''")

Set-Location -LiteralPath $RepoRoot.Path

Write-Host "Starting Tiago Martins Pinto portfolio editor..."
Write-Host "Repository: $($RepoRoot.Path)"

$AdminCommand = "Set-Location -LiteralPath '$RepoRootLiteral'; npm run admin"
$PreviewCommand = "Set-Location -LiteralPath '$RepoRootLiteral'; npm run preview"

Start-Process powershell.exe -ArgumentList @(
  "-NoExit",
  "-NoProfile",
  "-ExecutionPolicy",
  "Bypass",
  "-Command",
  $AdminCommand
)

Start-Process powershell.exe -ArgumentList @(
  "-NoExit",
  "-NoProfile",
  "-ExecutionPolicy",
  "Bypass",
  "-Command",
  $PreviewCommand
)

Start-Sleep -Seconds 2

Start-Process "http://127.0.0.1:8787/"
Start-Process "http://127.0.0.1:8080/"

Write-Host ""
Write-Host "Admin:   http://127.0.0.1:8787/"
Write-Host "Preview: http://127.0.0.1:8080/"
Write-Host ""
Write-Host "Two server windows should stay open for logs and errors."
Write-Host "Close those windows when you want to stop the servers."
Read-Host "Press Enter to close this launcher window"
