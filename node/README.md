
## 설치
* brew install docker node@16
* brew install mysql@5.7 mysql-client@5.7
* yarn add express typescript ts-node nodemon @types/node @types/express
* yarn add cors @types/cors body-parser @types/body-parser
* yarn add crypto-js @types/crypto-js
* yarn add jsonwebtoken
* yarn add morgan @types/morgan

## 도커
* docker pull node:16
* docker run --platform linux/amd64 -p 3306:3306 --name mysql-container -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=Account -e MYSQL_PASSWORD=root -d mysql:5.7

## 빌드
* docker build -t node-image .
* docker run --name node-container -d -p 8001:8001 -v ~/Desktop/project/js/docker_test/node:/app node-image