FROM node:10.19.0-alpine

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN npm i && npm run build

CMD ["nohup npm run prod"]
