param (
    [ValidateNotNullOrEmpty()]
    [String] $ProjectName = "seanmcbeth.com",

    [ValidateSet("None", "Major", "Minor", "Patch")]    
    [String] $VersionBump = "None",

    [ValidateSet("None", "Debug", "Test", "Release")]
    [String] $Config = "Release"
)

$buildProj = Join-Path . $ProjectName "$ProjectName.csproj"

$publishdir = Join-Path . pack $Config
if(-not (Test-Path $publishdir)) {
    mkdir ".\pack"
    mkdir $publishdir
}
$publishdir = Join-Path $publishdir $ProjectName

$version = (Get-Content $ProjectName/package.json) -join "`n" `
    | ConvertFrom-Json `
    | Select-Object -ExpandProperty "version"

Write-Output "Building in $Config mode with version bump $VersionBump"

$VersionBump = $VersionBump.ToLower()

if($VersionBump -ne "none") {
    Write-Output "Bumping version number"
    Push-Location $ProjectName
    $lastVersion = $version
    $version = npm version $VersionBump
    Pop-Location
    Write-Output "$lastVersion -> $version"
}

Write-Output "Building JavaScript bundles"
dotnet run `
    --project $buildProj `
    --configuration Debug `
    -- --build

Write-Output "Building .NET Project"
# check Properties/PublishProfiles/FolderProfile.pubxml for publish settings
dotnet publish `
    --nologo `
    -p:PublishProfile=FolderProfile `
    --configuration $Config `
    $buildProj

$publishOutput = Join-Path .. seanmcbeth.com.deploy
rm -rf $publishOutput/*
cp -r $publishdir/* $publishOutput

Push-Location $publishOutput
git add -A
git commit -m $version
git push

Pop-Location

@"
cd bin/seanmcbeth.com
git pull
cd ../
rm -rf SeanMcBeth.Site.old
cp -r SeanMcBeth.Site SeanMcBeth.Site.old
sudo systemctl stop SeanMcBeth.Site.service
rm -rf SeanMcBeth.Site/*
cp -r seanmcbeth.com/* SeanMcBeth.Site
cp -r SeanMcBeth.Site.old/certs SeanMcBeth.Site
sudo systemctl start SeanMcBeth.Site.service
"@ | ssh smcbeth@seanmcbeth.com