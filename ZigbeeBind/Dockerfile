FROM node

RUN mkdir /home/zigbeebind

RUN groupadd -g 10001 zigbeebind && \
   useradd -u 10000 -g zigbeebind zigbeebind \
   && chown -R zigbeebind:zigbeebind /home/zigbeebind

USER zigbeebind:zigbeebind

WORKDIR /home/zigbeebind

COPY . .

RUN npm ci

CMD ["node", "server.mjs"]