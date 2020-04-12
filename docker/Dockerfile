FROM node:10.19.0-alpine
RUN apk update && \
	apk add git && \
	git clone https://github.com/0502-crew/youtube4me.git /opt/youtube4me && \
	chmod 755 /opt/youtube4me/start_all.sh
COPY config/. /opt/youtube4me/
EXPOSE 45011
WORKDIR /opt/youtube4me
CMD ["/opt/youtube4me/start_all.sh"]