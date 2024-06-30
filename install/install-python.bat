@echo off
setlocal

if "%~1"=="" (
    echo Usage: %~nx0 buildTargetPath pythonMainFilePath
    exit /b 1
)

set buildTargetPath=%~1
set pythonMainFilePath=%~2

echo Executing .bat file from working directory:
cd

echo Creating virtual environment...
CALL python -m venv venv

echo Activating virtual environment...
CALL venv\Scripts\activate.bat

echo Upgrading pip...
CALL python -m pip install --upgrade pip

echo Installing Python requirements...
CALL pip install -r requirements.txt

echo Building with PyInstaller...
CALL pyinstaller --onefile %pythonMainFilePath% --distpath ./dist --name %buildTargetPath% --specpath ./install/

endlocal
