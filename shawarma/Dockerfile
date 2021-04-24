
FROM node:12

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

ENV NODE_ENV production
CMD [ "node", "dist/index.js" ]
USER node