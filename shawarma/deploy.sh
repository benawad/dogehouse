#!/bin/bash
set -e

scp -r src package.json tsconfig.json doge-vc:~/voice-server
ssh doge-vc "source ~/.nvm/nvm.sh ; nvm use 14 && cd voice-server && yarn install && yarn build && pm2 restart dist/index.js"
# scp -r src package.json tsconfig.json doge-vc1:~/voice-server
# ssh doge-vc1 "source ~/.nvm/nvm.sh ; nvm use 14 && cd voice-server && npm i && npm run build && pm2 restart dist/index.js"