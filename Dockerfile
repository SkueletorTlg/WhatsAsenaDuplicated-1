FROM fusuf/whatsasena:latest

RUN git clone https://github.com/Xenon67/WhatsAsenaDuplicated /root/WhatsAsenaDuplicated
WORKDIR /root/WhatsAsenaDuplicated/
ENV TZ=Europe/Istanbul
ENV SOFTWARE_VERSION=4.2.4
ENV SOFTWARE_VERSION_URL=https://www.ffmpeg.org/releases/ffmpeg-4.2.4.tar.bz2

RUN npm install supervisor -g
RUN npm install

CMD ["node", "bot.js"]
