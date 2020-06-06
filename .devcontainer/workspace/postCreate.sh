#!/bin/sh

# change owner to vscode user for mapped files/directories
sudo chown vscode node_modules
sudo chown vscode /home/vscode/history
sudo chown -R vscode /home/vscode/.gnupg

# fix file permissions in /home/vscode/.gnupg folder
chmod 700 /home/vscode/.gnupg
find /home/vscode/.gnupg -type f -exec chmod 600 {} \\;
find /home/vscode/.gnupg -type d -exec chmod 700 {} \\;

# add in GPG_TTY to bashrc to allow VSCode to sign within the UI
echo 'export GPG_TTY=$(tty)' >> /home/vscode/.bashrc

# add in github to ssh known_hosts
mkdir -p /home/vscode/.ssh
touch /home/vscode/.ssh/known_hosts
ssh-keygen -R github.com
ssh-keyscan -H github.com >> /home/vscode/.ssh/known_hosts
