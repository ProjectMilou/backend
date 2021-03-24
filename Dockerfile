# basic setup for a node.js app from: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/#dockerignore-file

FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE ${MY_SERVICE_PORT}
CMD [ "node", "server.js" ]