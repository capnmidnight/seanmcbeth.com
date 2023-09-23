# On Remote: BASH

## Install your private key
> touch ~/.ssh/id_rsa
> chmod 600 ~/.ssh/id_rsa
> nano ~/.ssh/id_rsa # <- paste it in

## Setup the firewalll
> sudo ufw allow http
> sudo ufw allow https
> sudo ufw allow ssh
> sudo ufw enable

!!!!! DON'T FORGET SSH BEFORE ENABLING OR YOU'LL BREAK SSH ACCESS !!!!!

## Setup Let's Encrypt
> sudo snap install core
> sudo snap refresh core
> sudo snap install --classic certbot
> sudo ln -s /snap/bin/certbot /usr/bin/certbot
> sudo certbot certonly --standalone

Complete the prompts for Let's Encrypt

# On Local: POWERSHELL

## Install FFMpeg

http://ffmpeg.org/download.html

## !!!!! DON'T FORGET !!!!! Edit environment variables
(temporary edit Yarrow.Server.service to add the secret environment variables)

## Push the package
> .\install.ps1