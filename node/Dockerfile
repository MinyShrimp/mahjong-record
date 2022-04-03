FROM node:16.14-slim
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install -g npm@8.5.5
RUN yarn
RUN yarn add express typescript ts-node nodemon @types/node @types/express mysql @types/mysql
RUN yarn add cors @types/cors body-parser @types/body-parser
RUN yarn add crypto-js @types/crypto-js jsonwebtoken morgan @types/morgan
COPY . /app
CMD [ "yarn", "dev" ]
EXPOSE 8001