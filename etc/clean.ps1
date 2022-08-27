# Ocassionally clean the deploy directory to make sure old scripts get deleted

if(Test-Path ..\deploy\linux -PathType Container) {
    rm -Force -Recurse ..\deploy\linux\
}

if(Test-Path ..\deploy\seanmcbeth.com.linux.tar -PathType Leaf) {
    rm ..\deploy\seanmcbeth.linux.tar
}