FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy source
COPY backend/ .

EXPOSE 5000

CMD ["node", "src/server.js"]
