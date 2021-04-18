#!/bin/bash

set -e

git pull origin staging
git checkout prod
git merge staging
git push origin prod
git checkout staging