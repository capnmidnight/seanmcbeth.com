sudo systemctl stop SeanMcBeth.Site

dotnet run --project ~/src/seanmcbeth.com/Build -- ~/src/seanmcbeth.com/Build
dotnet publish ~/src/seanmcbeth.com/Personal\ Site -c Release -o ~/bin/SeanMcBeth.Site

sudo systemctl start SeanMcBeth.Site
