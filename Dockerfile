FROM node:16
ARG VERSION
ENV APPLICATION_VERSION=$VERSION
WORKDIR /opt/application

COPY package.json /opt/application
RUN npm i
COPY src /opt/application/src

EXPOSE 3000
CMD npm run start