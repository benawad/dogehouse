#!/usr/bin/env bash

USERNAME=${3:-"doge"}
export NVM_DIR=${1:-"/home/$USERNAME/.nvm"}
export NODE_VERSION=${2:-"lts/*"}

set -e

# install all dependencies
apt-get update \
    && apt-get install -y curl ca-certificates tar gnupg2 \
    && apt-get -y autoclean

# install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | (OUT=$(apt-key add - 2>&1) || echo $OUT)
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
apt-get update
apt-get -y install --no-install-recommends yarn

# install nvm
su ${USERNAME} -c "mkdir $NVM_DIR"
su ${USERNAME} -c "curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash"

# install node and npm
su ${USERNAME} -c "source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default"