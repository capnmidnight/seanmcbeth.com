# Make a space to do work
rm -rf ~/bin/Yarrow.Server.old/
rm -rf ~/bin/Yarrow.Server.new/
mkdir ~/bin/Yarrow.Server.new/ ~/bin/Yarrow.Server.new/certs/

# Unpack the .NET package archive
unzip ~/yarrow.linux.zip -d ~/bin/Yarrow.Server.new/

# Enable execution of certain parts
chmod 700 ~/bin/Yarrow.Server.new/Yarrow.Server
chmod 700 ~/bin/Yarrow.Server.new/yt-dlp

# Copy the Let's Encrypt certificates
for certfile in cert.pem chain.pem fullchain.pem privkey.pem ; do
	sudo cp -L /etc/letsencrypt/live/vr.dlsdc.com/"${certfile}" ~/bin/Yarrow.Server.new/certs/"${certfile}"
	sudo chown azureuser:azureuser ~/bin/Yarrow.Server.new/certs/"${certfile}"
done

# Backup the old and put in the new
sudo systemctl stop Yarrow.Server
mv ~/bin/Yarrow.Server/ ~/bin/Yarrow.Server.old/
mv ~/bin/Yarrow.Server.new/ ~/bin/Yarrow.Server/
sudo systemctl start Yarrow.Server

# Cleanup
rm ~/yarrow.linux.zip