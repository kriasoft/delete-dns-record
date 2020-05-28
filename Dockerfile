FROM node:12.17.0-alpine3.9

RUN apk add --update \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN chmod 755 docker-entrypoint.sh
CMD sh docker-entrypoint.sh
