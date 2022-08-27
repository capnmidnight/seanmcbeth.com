$key = "~\.ssh\sean-mcbeth.pem"
$user = "smcbeth"
$hostname = "seanmcbeth.com"

ssh -i ${key} ${user}@${hostname}