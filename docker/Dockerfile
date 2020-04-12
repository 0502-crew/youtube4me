FROM node:10.19.0-alpine
RUN apk update && \
	apk add git

WORKDIR /opt
RUN git clone https://github.com/0502-crew/youtube4me.git
WORKDIR /opt/youtube4me
RUN chmod +x start_all.sh
COPY Config_client.ts /opt/youtube4me/client/src/config/Config.ts
COPY Config_api.ts /opt/youtube4me/api/src/config/Config.ts
EXPOSE 45011

CMD start_all.sh