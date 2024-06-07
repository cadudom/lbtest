FROM node:16.13.0

RUN apt-get update && apt-get install -y apt-transport-https
RUN DEBIAN_FRONTEND="noninteractive" apt-get install -y ffmpeg

RUN mkdir /home/app
RUN chmod -R 777 /home/app
WORKDIR /home/app

COPY app/* . 

RUN npm ci

CMD npm start