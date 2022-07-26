dotnet run --project .\Build\
dotnet publish '.\Personal Site\' --configuration Release --no-self-contained --runtime linux-x64 --output .\deploy\linux