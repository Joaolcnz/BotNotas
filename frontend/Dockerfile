FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8030
CMD ["npm", "run", "preview", "--", "--port", "8030", "--host", "0.0.0.0"]
