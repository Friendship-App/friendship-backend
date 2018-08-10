# first choose enviroment
FROM node:9-alpine
  # Expose port container number
EXPOSE 3888
  # Install tini helper
RUN apk add --update tini
  # Install yarn
#RUN apk add yarn
  # Create work dir
RUN mkdir -p /Friendship/Friendship-backend
  # Change to work dir
WORKDIR /Friendship/Friendship-backend
  # Copy JSON file to container
COPY package.json package.json
  # Run yarn to build
RUN yarn
  # Copy from source dir to container
COPY . .
  # Init db
CMD ["yarn","db:init"]
  # Launch backend
#CMD ["tini","--","yarn","watch","./src/server.js"]

