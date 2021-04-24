#!/usr/bin/env bash

USERNAME=${1:-"doge"}
USER_UID=${2:-1000}
USER_GID=${3:-$USER_UID}

PACKAGE_LIST="apt-utils \
        git \
        htop \
        curl \
        wget \
        unzip \
        zip \
        vim \
        less \
        sudo \
        man-db"

# install packages
apt-get -y install --no-install-recommends ${PACKAGE_LIST}

# add non-root user
groupadd --gid $USER_GID $USERNAME
useradd -s /bin/bash --uid $USER_UID --gid $USERNAME -m $USERNAME
echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME
chmod 0440 /etc/sudoers.d/$USERNAME
chown ${USERNAME}:${USERNAME} "/home/${USERNAME}/.bashrc"