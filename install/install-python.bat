@echo off
echo Executing .bat file from working directory:
cd

echo Creating virtual environment...
CALL python -m venv venv

echo Activating virtual environment...
CALL venv\Scripts\activate.bat

echo Upgrading pip...
CALL python -m pip install --upgrade pip

echo Installing Python requirements...
CALL pip install -r install/requirements.txt

echo Building with PyInstaller...
CALL pyinstaller --onefile ./src-python/main.py --distpath ./dist

