sudo systemctl stop SeanMcBeth.Site

mv ~/bin/SeanMcBeth.Site/certs ~/bin/SeanMcBeth.Site.Certs
rm -rf ~/bin/SeanMcBeth.Site/*
cp -r ~/src/seanmcbeth.com/deploy/linux/* ~/bin/SeanMcBeth.Site
mv ~/bin/SeanMcBeth.Site.Certs ~/bin/SeanMcBeth.Site/certs
chmod 700 ~/bin/SeanMcBeth.Site/SeanMcBeth.Site

sudo systemctl start SeanMcBeth.Site
