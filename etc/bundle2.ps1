cd ..\Yarrow.Server
$v=npm version patch
cd ..\Yarrow.Build
dotnet run -- --version
git add -A
git commit -m $v