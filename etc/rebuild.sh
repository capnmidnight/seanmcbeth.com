sudo systemctl stop SeanMcBeth.Site

dotnet publish ~/src/seanmcbeth.com/src/SeanMcBeth.Site -c Release -o ~/bin/SeanMcBeth.Site

sudo systemctl start SeanMcBeth.Site
