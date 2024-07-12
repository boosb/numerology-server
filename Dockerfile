# Use the official Node.js image
FROM node:20.9.0

# Set the working directory
WORKDIR /usr/src/numerology-server

# Копирование package.json to the container
COPY ./package.json .

# Если package-lock.json существует, копировать его в контейнер
COPY ./package-lock.json* .

# Установка зависимостей
RUN npm install

# Установка global nest cli
RUN npm install -g @nestjs/cli

# Копирование остальных файлов приложения в контейнер
COPY . .