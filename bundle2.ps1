cd ".\Personal Site"
$v=npm version minor
cd ..\Build
dotnet run
git add -A
git commit -m $v