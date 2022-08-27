$key = "~\.ssh\sean-mcbeth.pem"
$user = "smcbeth"
$hostname = "seanmcbeth.com"

echo "I hope you didn't forget to edit the SystemD service file!"

# Copy the Let's Encrypt update hooks
scp -i ${key} -r .\letsencrypt\* ${user}@${hostname}:~/letsencrypt/

# Copy the SystemD service file to the remote server
scp -i ${key} .\SeanMcBeth.Site.service sudo ${user}@${hostname}:~/SeanMcBeth.Site.service

# Copy the .NET package archive to the remote server
scp -i ${key} ..\deploy\seanmcbeth.com.linux.tar ${user}@${hostname}:~/seanmcbeth.com.linux.tar

# Execute the install script on the remote server
$cmd = (Get-Content -Raw .\install.sh) -replace "(?:`r?`n)+", "`n" # make sure the Windows/Unix newline character confusion doesn't happen
ssh -i ${key} ${user}@${hostname} "${cmd}"