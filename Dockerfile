# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]