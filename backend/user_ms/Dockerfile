#node image version
FROM node:20.11.1

#set work directory
WORKDIR /app/user_ms

#copy all sources to container
COPY package*.json .

#install dependencies
RUN npm install

COPY . .

EXPOSE 8001

#run the service
CMD ["npm","run","start:dev"]