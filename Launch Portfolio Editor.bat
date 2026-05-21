@echo off
set "REPO_ROOT=%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%REPO_ROOT%tools\launch-editor.ps1"
