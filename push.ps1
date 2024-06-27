param (
    [ValidateNotNullOrEmpty()]
    [String] $ProjectName = "seanmcbeth.com",

    [ValidateNotNullOrEmpty()]
    [String] $CommitMessage
)

$publishOutput = Join-Path .. seanmcbeth.com.deploy

Push-Location $publishOutput
git add -A
git commit -m $CommitMessage
git push

Pop-Location

@"
cd bin/seanmcbeth.com.deploy/
git pull

cd ../
rm -rf SeanMcBeth.Site.old
rm -rf SeanMcBeth.Site.new

mkdir SeanMcBeth.Site.new
cp -r seanmcbeth.com.deploy/* SeanMcBeth.Site.new
cp -r SeanMcBeth.Site/certs SeanMcBeth.Site.new

sudo systemctl stop SeanMcBeth.Site.service
mv SeanMcBeth.Site SeanMcBeth.Site.old
mv SeanMcBeth.Site.new SeanMcBeth.Site
sudo systemctl start SeanMcBeth.Site.service
"@ | ssh smcbeth@seanmcbeth.com