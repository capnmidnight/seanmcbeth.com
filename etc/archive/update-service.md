# When updating permissions and environment variables for the SystemD service

## Put the new service definition file in place
> sudo cp ~/SeanMcBeth.Site.service /etc/systemd/system/SeanMcBeth.Site.service

## Register the changes with SystemD
> sudo systemctl daemon-reload

## Restart the service
> sudo systemctl restart SeanMcBeth.Site