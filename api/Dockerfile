FROM node:10.19.0-alpine

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN npm i && npm run build

EXPOSE 45011
CMD ["nohup npm run prod"]
