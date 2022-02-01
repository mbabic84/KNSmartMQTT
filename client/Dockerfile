FROM node

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN npm ci

EXPOSE 8080

CMD npm run start:watch