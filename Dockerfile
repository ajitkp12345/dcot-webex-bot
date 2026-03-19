FROM node:20-alpine

WORKDIR /app

# Copy manifests explicitly (avoids wildcard surprises)
COPY package.json ./
COPY package-lock.json ./

# DEBUG: print manifests INSIDE the image
RUN echo "----- package.json (inside image) -----" \
 && sed -n '1,160p' package.json \
 && echo "----- package-lock.json head (inside image) -----" \
 && head -n 60 package-lock.json || true

# Deterministic, prod-only install; fallback if ci fails
RUN npm ci --omit=dev || npm install --omit=dev

# Copy rest of the app
COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]