FROM node:16

# Create app directory
WORKDIR /usr/src/hello_world

# Copy to app dir
COPY . .

# Install dependencies based on package files
RUN npm install

EXPOSE 8080
CMD [ "/bin/sh", "startup.sh" ]