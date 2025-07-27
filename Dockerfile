FROM node:18-slim

# Install git (optional, only if cloning repo in Dockerfile)
# RUN apt-get update && apt-get install -y git

# Set work directory
WORKDIR /app

# Copy your project files into the container
COPY . .

# Install only production deps
RUN npm install --production

# Run the Node server
CMD ["node", "server/index.js"]
