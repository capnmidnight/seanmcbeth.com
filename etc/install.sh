# ONE TIME

## get dotnet core 3.1
wget https://packages.microsoft.com/config/ubuntu/21.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

sudo apt-get update; \
  sudo apt-get install -y apt-transport-https && \
  sudo apt-get update && \
  sudo apt-get install -y dotnet-sdk-6.0

## clone repo
mkdir src
cd src
git clone --branch dotnet git@github.com:capnmidnight/seanmcbeth.com
cd seanmcbeth.com
git submodule init
git submodule update --recursive --depth 1

## CTRL+C to cancel test, then publish
dotnet publish ~/src/seanmcbeth.com/src/Personal\ Site -c Release -o ~/bin/SeanMcBeth.Site

## run it
cd ~/bin/SeanMcBeth.Site
./SeanMcBeth.Site

## CTRL+C to cancel, then publish the systemd service
sudo cp ~/SeanMcBeth.Site.service /etc/systemd/system/
sudo systemctl daemon-reload

## Allow app to run on port 80/443
sudo setcap CAP_NET_BIND_SERVICE=+eip ~/bin/SeanMcBeth.Site/SeanMcBeth.Site

## enable auto startup
sudo systemctl enable SeanMcBeth.Site

## start systemd service
sudo systemctl start SeanMcBeth.Site
sudo systemctl status SeanMcBeth.Site
