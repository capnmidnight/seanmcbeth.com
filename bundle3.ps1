cd ".\Personal Site"
$v=npm version major
cd ..\Build
dotnet run
git add -A
git commit -m $v