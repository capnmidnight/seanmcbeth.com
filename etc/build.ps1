Set-Location ..\
    # Bundle the TypeScript code
    dotnet run --project .\seanmcbeth.com --build

    if(-not (Test-Path .\deploy\linux -PathType Container)) {
        mkdir .\deploy\
    }

    # Create the .NET package
    dotnet publish .\seanmcbeth.com --configuration Release --no-self-contained --runtime linux-x64 --output ..\deploy\linux\

    # Archive the .NET package for deployment
    7z a -tzip -mx9 .\deploy\seanmcbeth.com.linux.zip ..\deploy\linux\*

Set-Location -