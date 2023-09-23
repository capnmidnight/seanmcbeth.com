#!/bin/bash -e
for certfile in cert.pem chain.pem fullchain.pem privkey.pem ; do
	cp -L /etc/letsencrypt/live/vr.dlsdc.com/"${certfile}" /home/azureuser/bin/Yarrow.Server/certs/"${certfile}".new
	chown azureuser:azureuser /home/azureuser/bin/Yarrow.Server/certs/"${certfile}".new
	mv /home/azureuser/bin/Yarrow.Server/certs/"${certfile}".new /home/azureuser/bin/Yarrow.Server/certs/"${certfile}"

	cp -L /etc/letsencrypt/live/vr.dlsdc.com/"${certfile}" /etc/turnserver/"${certfile}".new
	chown turnserver:turnserver /etc/turnserver/"${certfile}".new
	mv /etc/turnserver/"${certfile}".new /etc/turnserver/"${certfile}"
done
