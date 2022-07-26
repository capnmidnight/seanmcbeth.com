sudo systemctl stop SeanMcBeth.Site

mv ~/bin/SeanMcBeth.Site/certs ~/bin/SeanMcBeth.Site.Certs
rm -rf ~/bin/SeanMcBeth.Site/*
cp -r ~/src/seanmcbeth.com/deploy/linux/* ~/bin/SeanMcBeth.Site
mv ~/bin/SeanMcBeth.Site.Certs ~/bin/SeanMcBeth.Site/certs

sudo systemctl start SeanMcBeth.Site
