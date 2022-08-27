cd ..\
    # Bundle the TypeScript code
    dotnet run --project ".\Build\"

    # Create the .NET package
    dotnet publish ".\Personal Site\" --configuration Release --no-self-contained --runtime linux-x64 --output ..\deploy\linux\

    # Archive the .NET package for deployment
    7z a -ttar ..\deploy\seanmcbeth.com.linux.tar ..\deploy\linux\*
cd -