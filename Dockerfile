FROM node:12
# To Create nodejsapp directory
WORKDIR /nodejsapp
# To Install All dependencies
COPY package*.json ./
COPY . .
RUN npm install
WORKDIR /nodejsapp/client
RUN npm install
WORKDIR /nodejsapp
RUN npm i pm2@latest -g

# To copy all application packages

# Expose port 3000 and Run the server.js file to start node js application
EXPOSE 5010
CMD [ "pm2-runtime", "ecosystem.config.js" ]
# CMD [ "pm2", "start" ]
# CMD [ "pm2-runtime", "start", "npm", "--", "start" ]