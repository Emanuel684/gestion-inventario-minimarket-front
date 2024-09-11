FROM node:16.17.0 AS build

COPY [".", "/usr/src/"]

WORKDIR /usr/src/

RUN npm install && npm install -g @angular/cli && ng build && rm -rf node_modules/

COPY [".", "/usr/src/"]

EXPOSE 4200

CMD ["ng", "serve", "--prod", "--host", "0.0.0.0"]