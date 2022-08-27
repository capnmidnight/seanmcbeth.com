`> sudo apt-get install coturn`

`> sudo vim /etc/default/coturn`

```
TURNSERVER_ENABLED=1
```

`> sudo cp ~/src/seanmcbeth.com/etc/turnserver.conf /etc/turnserver.conf`
`> sudo chown turnserver:turnserver /etc/turnserver.conf`
`> sudo mkdir /etc/turnserver/`
`> sudo openssl dhparam -dsaparam -out /etc/turnserver/dhp.pem 2048`

Make sure the Let's Encrypt depoly hooks are copied in place and certbot has been ran

You have to build your own REST API? Yes.
https://stackoverflow.com/questions/35766382/coturn-how-to-use-turn-rest-api/35767224#35767224
