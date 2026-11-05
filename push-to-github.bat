@echo off
title Push Real Estate Website to GitHub
echo ========================================================
echo Connecting and Pushing Real Estate Website to GitHub...
echo Repository: https://github.com/azaan655/Real-Estate-Website.git
echo ========================================================
echo.

set "GIT_EXE=C:\Users\azaan\AppData\Local\Programs\MinGit\cmd\git.exe"

if not exist "%GIT_EXE%" (
    set "GIT_EXE=git"
)

echo Checking Git status...
"%GIT_EXE%" status

echo.
echo Pushing branch 'main' to GitHub...
echo (If a browser window pops up, click 'Authorize GitCredentialManager' or 'Sign in with your browser')
echo.

"%GIT_EXE%" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo SUCCESS! Your website files are now pushed to GitHub!
    echo Visit: https://github.com/azaan655/Real-Estate-Website
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo Push encountered an issue. See message above.
    echo ========================================================
)

echo.
pause
