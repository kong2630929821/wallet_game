@echo off
cd ..\..
if exist .git (
goto init
) else (
goto error
)


:init
copy /Y jira_script\jira_git\rely\commit-msg .git\hooks
goto over

:error
echo "��������·�����Ƿ����.git�ļ�"

:over
echo "���"

pause
