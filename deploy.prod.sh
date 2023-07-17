sshCommands="$(cat <<END_HEREDOC
# Go To dir
cd /var/www/servimav.com/wings/admin/

# Pull
git checkout master
git pull

# copy env
cp .env.prod .env

# Install api server dependencies.
source ~/.nvm/nvm.sh

echo "Switching to appropriate node.js version using nvm"
if ! nvm use default ; then
  echo "Error using nvm to switch node.js version."
  exit 14
fi

echo "Installing server api dependencies"
if ! yarn ; then
	echo "Error installing server api dependencies."
  exit 15
fi

echo "Installing building app"
if ! yarn build ; then
  echo "Error building app."
  exit 16
fi
END_HEREDOC
)"

ssh adricq@vps1.servimav.com -t "$sshCommands"