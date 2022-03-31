FROM node:16.14-slim
WORKDIR /app
COPY package*.json /api
RUN npm install -g npm@8.5.5
RUN yarn
RUN yarn add express path cors morgan nodemon
COPY . /app
CMD [ "node", "app.js" ]
EXPOSE 8002