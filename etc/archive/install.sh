# Get .NET 6
sudo apt-get update
sudo apt-get install -y dotnet6

# Create a directory for it
mkdir ~/bin ~/bin/SeanMcBeth.Site ~/bin/SeanMcBeth.Site/certs

# Unpack the package
tar -xf ~/seanmcbeth.com.linux.tar --directory ~/bin/SeanMcBeth.Site

# Set executable bits
chmod 700 ~/bin/SeanMcBeth.Site/SeanMcBeth.Site
chmod 700 ~/bin/SeanMcBeth.Site/yt-dlp

# Install the Let's Encrypt renewal hooks
sudo cp -r ~/letsencrypt/* /etc/letsencrypt/
sudo chown -R root:root /etc/letsencrypt/renewal-hooks/*

# Copy the Let's Encrypt certs so we can use them from the server
for certfile in cert.pem chain.pem fullchain.pem privkey.pem ; do
	sudo cp -L /etc/letsencrypt/live/seanmcbeth.com/"${certfile}" ~/bin/SeanMcBeth.Site.new/certs/"${certfile}"
	sudo chown smcbeth:smcbeth ~/bin/SeanMcBeth.Site.new/certs/"${certfile}"
done

# Create the SystemD service
sudo mv ~/SeanMcBeth.Site.service /etc/systemd/system/SeanMcBeth.Site.service
sudo chown root:root /etc/systemd/system/SeanMcBeth.Site.service
sudo systemctl daemon-reload
sudo setcap CAP_NET_BIND_SERVICE=+eip ~/bin/SeanMcBeth.Site/SeanMcBeth.Site
sudo systemctl enable SeanMcBeth.Site

# Startup
sudo systemctl start SeanMcBeth.Site

# Cleanup
rm ~/seanmcbeth.com.linux.tar
rm -rf ~/letsencrypt/