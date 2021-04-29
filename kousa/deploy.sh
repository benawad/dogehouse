#!/bin/bash
set -e

docker build -t benawad/kousa:0.0.2 .
docker save benawad/kousa:0.0.2 | bzip2 | ssh doge-api "bunzip2 | docker load"
ssh doge-api "docker tag benawad/kousa:0.0.2 dokku/api:latest && dokku tags:deploy api latest"