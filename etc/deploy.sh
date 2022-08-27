# Make a space to do work
rm -rf ~/bin/SeanMcBeth.Site.old/
mkdir ~/bin/SeanMcBeth.Site.new/ ~/bin/SeanMcBeth.Site.new/certs/

# Unpack the .NET package archive
tar -xf ~/seanmcbeth.com.linux.tar --directory ~/bin/SeanMcBeth.Site.new/

# Enable execution of certain parts
chmod 700 ~/bin/SeanMcBeth.Site.new/SeanMcBeth.Site

# Copy the Let's Encrypt certificates
for certfile in cert.pem chain.pem fullchain.pem privkey.pem ; do
	sudo cp -L /etc/letsencrypt/live/seanmcbeth.com/"${certfile}" ~/bin/SeanMcBeth.Site.new/certs/"${certfile}"
	sudo chown smcbeth:smcbeth ~/bin/SeanMcBeth.Site.new/certs/"${certfile}"
done

# Backup the old and put in the new
sudo systemctl stop SeanMcBeth.Site
mv ~/bin/SeanMcBeth.Site/ ~/bin/SeanMcBeth.Site.old/
mv ~/bin/SeanMcBeth.Site.new/ ~/bin/SeanMcBeth.Site/
sudo systemctl start SeanMcBeth.Site

# Cleanup
rm ~/seanmcbeth.com.linux.tar