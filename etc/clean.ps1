# Ocassionally clean the deploy directory to make sure old scripts get deleted

if(Test-Path ..\deploy\ -PathType Container) {
    Remove-Item -Force -Recurse ..\deploy\
}

if(Test-Path "..\seanmcbeth.com\wwwroot\js" -PathType Container) {
    Remove-Item -Force -Recurse "..\seanmcbeth.com\wwwroot\js"
}