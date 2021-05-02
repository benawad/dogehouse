
FROM node:14-alpine
WORKDIR /usr/src/app
RUN apk add --update alpine-sdk && apk add linux-headers
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

COPY package.json package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

ENV NODE_ENV production
CMD [ "node", "dist/index.js" ]
USER node