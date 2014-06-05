mkdir obj
mkdir delta
node minify -v:true -o:obj -c:delta -i:html5 -s:true
ftp -i -n -s:commands.txt seanmcbeth.com