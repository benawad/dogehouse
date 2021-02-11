#!/bin/bash
set -e

scp -r src package.json tsconfig.json vc:~/voice-server
ssh vc "source ~/.nvm/nvm.sh ; nvm use 14 && cd voice-server && npm i && npm run build && pm2 restart dist/index.js"