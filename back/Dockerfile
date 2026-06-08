FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "build"]
CMD ["npm", "start"]