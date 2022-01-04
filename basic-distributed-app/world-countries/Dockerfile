FROM node:16

# Create app directory
WORKDIR /usr/src/world_countries

# Copy to app dir
COPY . .

# Install dependencies based on package files
RUN npm install

EXPOSE 3000
CMD [ "/bin/sh", "startup.sh" ]