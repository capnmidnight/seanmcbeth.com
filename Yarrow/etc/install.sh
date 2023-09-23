# Get .NET 6, FFMpeg, Zip, Unzip, and Certbot
sudo apt-get update
sudo apt-get install -y \
    dotnet-sdk-7.0 \
    ffmpeg \
    zip \
    unzip

sudo snap install --classic certbot

# Create a directory for it
mkdir ~/bin ~/bin/Yarrow.Server ~/bin/Yarrow.Server/certs

# Unpack the package
unzip ~/yarrow.linux.zip -d ~/bin/Yarrow.Server

# Set executable bits
chmod 700 ~/bin/Yarrow.Server/Yarrow.Server
chmod 700 ~/bin/Yarrow.Server/yt-dlp

# Install the Let's Encrypt renewal hooks
sudo cp -r ~/letsencrypt/* /etc/letsencrypt/
sudo chown -R root:root /etc/letsencrypt/renewal-hooks/*

# Copy the Let's Encrypt certs so we can use them from the server
for certfile in cert.pem chain.pem fullchain.pem privkey.pem ; do
	sudo cp -L /etc/letsencrypt/live/vr.dlsdc.com/"${certfile}" ~/bin/Yarrow.Server.new/certs/"${certfile}"
	sudo chown azureuser:azureuser ~/bin/Yarrow.Server.new/certs/"${certfile}"
done

# Create the SystemD service
sudo mv ~/Yarrow.Server.service /etc/systemd/system/Yarrow.Server.service
sudo chown root:root /etc/systemd/system/Yarrow.Server.service
sudo systemctl daemon-reload
sudo setcap CAP_NET_BIND_SERVICE=+eip ~/bin/Yarrow.Server/Yarrow.Server
sudo systemctl enable Yarrow.Server

# Startup
sudo systemctl start Yarrow.Server

# Cleanup
rm ~/yarrow.linux.zip
rm -rf ~/letsencrypt/