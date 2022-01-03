#!/bin/bash

# 1. Download NodeJS
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
# 2. Install NodeJS
sudo apt-get install -y nodejs

# 2.1 Optional: Install build tools (uncomment to install)
# sudo apt-get install -y build-essential

# 3. Import mongo public key
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6

# 4. Create a list file for MongoDB (uncomment according to OS version)
## Ubuntu 12.04
# echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu precise/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
## Ubuntu 14.04
# echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
## Ubuntu 16.04
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

# 5. Reload local package database
sudo apt-get update

# 6. Install the MongoDB packages
sudo apt-get install -y mongodb-org

# 7. Start MongoDB
sudo service mongod start
