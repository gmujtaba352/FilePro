@echo off
REM LibreOffice conversion wrapper for Windows
REM Sets proper environment and calls soffice

setlocal enabledelayedexpansion
set LIBREOFFICE_HOME=C:\Program Files\LibreOffice
set PATH=%LIBREOFFICE_HOME%\program;%PATH%
set URE_BOOTSTRAP=vnd.sun.star.pathname:%LIBREOFFICE_HOME%\program\fundamentalrc

REM Run LibreOffice with conversion parameters
"%LIBREOFFICE_HOME%\program\soffice.exe" --headless --invisible --norestore --nofirststartwizard --convert-to "docx:MS Word 2007 XML" --outdir "%~2" "%~1"

endlocal
exit /b %errorlevel%
