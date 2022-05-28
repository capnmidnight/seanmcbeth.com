sudo systemctl stop SeanMcBeth.Site

dotnet publish ~/src/seanmcbeth.com/Personal\ Site -c Release -o ~/bin/SeanMcBeth.Site

sudo systemctl start SeanMcBeth.Site
