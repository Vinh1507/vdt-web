# Stage 1 (build)
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2 (nginx)
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx-config/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]