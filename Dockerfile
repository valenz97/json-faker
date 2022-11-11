ARG NODE_VERSION=16.17
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
RUN mkdir mocks

EXPOSE 8099

CMD [ "node", "app.js" ]
