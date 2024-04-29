REM ************* QA DEPARTMENT ******************
REM ****** daniele.bertocchi@hubparking.com ******
REM *********** UPDATE  *****************


set REPOPATH=\\172.30.3.150\hub\Quality Assurance\SoftwareTechnologies\repo
//set DESTPAT=C:\QA\ipMap
set DESTPAT=C:\ST\Security\ipMap\tmp

xcopy "%REPOPATH%\ipMap\"* "%DESTPAT%\" /Y /E
