FROM node:9.2.0
MAINTAINER "wssmarcos@gmail.com"

RUN npm install nodemon -g

RUN mkdir /app
WORKDIR /app

CMD ["nodemon", "app.js"]