FROM node:9.2.0
MAINTAINER "wssmarcos@gmail.com"

RUN mkdir /app
WORKDIR /app

ENV PORT 8080
ENV MONGODB_URI mongodb://database:27017/auth-continuous
ENV NODE_ENV production

CMD ["node", "server/app.js"]
