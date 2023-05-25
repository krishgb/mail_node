FROM node:18-alpine

COPY logs /app/logs
COPY src/ /app/src/
COPY package.json /app/package.json
COPY .env /app/.env
COPY README.md /app/README.md

WORKDIR /app

RUN npm i

EXPOSE 5001

CMD ["npm", "start"]
