@echo off
cd /d "%~dp0"
call venv2\Scripts\activate
python app\helpers\drowsiness.py
pause
