@echo off
setlocal enabledelayedexpansion

for %%F in (*) do (
    set "filename=%%~nF"
    set "extension=%%~xF"
    ren "%%F" "!filename! image!extension!"
)

echo Done renaming files.
pause
