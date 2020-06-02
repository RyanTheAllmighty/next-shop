#!/bin/sh

# change owner to vscode user for mapped files/directories
sudo chown vscode node_modules
sudo chown vscode /home/vscode/history
sudo chown -R vscode /home/vscode/.ssh
sudo chown vscode /home/vscode/.gnupg/pubring.kbx
sudo chown vscode /home/vscode/.gnupg/trustdb.gpg
sudo chown -R vscode /home/vscode/.gnupg/private-keys-v1.d
sudo chown vscode /home/vscode/.gnupg-localhost/S.gpg-agent.extra

# fix file permissions in /home/vscode/.gnupg folder
find /home/vscode/.gnupg -type f -exec chmod 600 {} \\;
find /home/vscode/.gnupg -type d -exec chmod 700 {} \\;

# fix file permissions in /home/vscode/.ssh folder
find /home/vscode/.ssh -type f -exec chmod 600 {} \\;
find /home/vscode/.ssh -type d -exec chmod 700 {} \\;

# add in GPG_TTY to bashrc to allow VSCode to sign within the UI
echo 'export GPG_TTY=$(tty)' >> /home/vscode/.bashrc

# add in github to ssh known_hosts
mkdir -p /home/vscode/.ssh
touch /home/vscode/.ssh/known_hosts
ssh-keygen -R github.com
ssh-keyscan -H github.com >> /home/vscode/.ssh/known_hosts
