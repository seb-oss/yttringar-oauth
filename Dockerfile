FROM node:12.13 as base

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY /src ./src

COPY tsconfig.json ./

RUN npm run build



FROM node:12.13

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=base /app/dist ./dist

CMD npm start
