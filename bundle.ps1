cd ".\Personal Site"
$v=npm version patch
cd ..\Build
dotnet run
git add -A
git commit -m $v