
FROM node:14-alpine
WORKDIR /usr/src/frontend

COPY package.json package-lock.json ./
RUN npm i
COPY . .

RUN npm run build

ENV NODE_ENV production
CMD [ "npx", "craco", "start" ]
USER node