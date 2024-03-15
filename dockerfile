FROM node:18-slim

WORKDIR /app

COPY package*.json /app
COPY tsconfig*.json /app

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]

EXPOSE 4000