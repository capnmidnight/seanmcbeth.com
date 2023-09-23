$key = "~\.ssh\vmaccess.pem"
$user = "azureuser"
$hostname = "vr.dlsdc.com"

# Copy the package archive to the server
scp -i ${key} ..\deploy\yarrow.linux.zip ${user}@${hostname}:~/yarrow.linux.zip

# Execute the update script on the remote server
$cmd = (Get-Content -Raw .\deploy.sh) -replace "(?:`r?`n)+", "`n" # make sure the Windows/Unix newline character confusion doesn't happen
ssh -i ${key} ${user}@${hostname} "${cmd}"