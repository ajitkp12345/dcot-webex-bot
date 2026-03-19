FROM node:20-alpine

WORKDIR /app

# Copy only manifests first (better Docker cache)
COPY package*.json ./

# Prefer reproducible, production-only installs; fall back to install if needed
RUN npm ci --omit=dev || npm install --omit=dev

# Now copy the rest of the source
COPY . .

# (Optional hardening)
ENV NODE_ENV=production
# RUN addgroup -S nodegrp && adduser -S nodeusr -G nodegrp
# USER nodeusr

EXPOSE 3000
CMD ["npm","start"]