if($args.Length -ne 1 -or $args[0] -notmatch "^(Debug|Release)$") {
    echo "Expected usage: build [Debug|Release]"
}
else {
    $config = $args[0]
    cd ..\src
        # Bundle the TypeScript code
        dotnet run --project ".\Yarrow.Build\"

        # Create the .NET package
        dotnet publish ".\Yarrow.Server\" --configuration $config --no-self-contained --runtime linux-x64 --output ..\deploy\linux\
    cd ..\etc
}