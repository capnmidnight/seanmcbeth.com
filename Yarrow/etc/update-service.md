# When updating permissions and environment variables for the SystemD service

## Put the new service definition file in place
> sudo cp ~/Yarrow.Server.service /etc/systemd/system/Yarrow.Server.service

## Register the changes with SystemD
> sudo systemctl daemon-reload

## Restart the service
> sudo systemctl restart Yarrow.Server