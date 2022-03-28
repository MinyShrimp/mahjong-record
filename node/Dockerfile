FROM node:16.14-slim
WORKDIR /app
COPY package*.json .
RUN \
    npm install\
    yarn\
    yarn add express typescript ts-node nodemon @types/node @types/express mysql @types/mysql\
    yarn add cors @types/cors
COPY . /app
CMD [ "npm", "run", "dev" ]
EXPOSE 8001