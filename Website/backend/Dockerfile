FROM node:18

# Install lsof
RUN apt-get update && apt-get install -y lsof

WORKDIR /app

COPY package*.json ./
COPY server.js ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]