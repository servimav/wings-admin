rm .env
cp .env.prod .env
yarn build
rm admin-zip
zip admin.zip -r dist
scp admin.zip adricq@vps1.servimav.com:/var/www/servimav.com/wings/admin/