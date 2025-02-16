FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
