sudo systemctl stop SeanMcBeth.Site

dotnet clean ~/src/seanmcbeth.com/Personal\ Site -c Release -o ~/bin/SeanMcBeth.Site
rm -rf ~/bin/SeanMcBeth.Site/wwwroot/js/
dotnet publish ~/src/seanmcbeth.com/Personal\ Site -c Release -o ~/bin/SeanMcBeth.Site

sudo systemctl start SeanMcBeth.Site
