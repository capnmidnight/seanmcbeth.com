# Ocassionally clean the deploy directory to make sure old scripts get deleted

if(Test-Path ..\deploy\ -PathType Container) {
    rm -Force -Recurse ..\deploy\linux\
}

if(Test-Path ..\src\Yarrow.Server\wwwroot\js -PathType Container) {
    rm -Force -Recurse ..\src\Yarrow.Server\wwwroot\js
}