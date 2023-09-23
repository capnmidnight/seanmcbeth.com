$key = "~\.ssh\vmaccess.pem"
$user = "azureuser"
$hostname = "vr.dlsdc.com"

ssh -i ${key} ${user}@${hostname}