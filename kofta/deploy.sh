#!/bin/bash

set -e

git pull origin staging
git checkout prod
git merge staging
git push origin prod
npm run build
netlify deploy -d build --prod
git checkout staging