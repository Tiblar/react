FROM debian:bullseye-slim

RUN export DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install nodejs

WORKDIR /var/www/frontend

SHELL ["/bin/bash"]