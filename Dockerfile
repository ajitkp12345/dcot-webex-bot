FROM node:20-alpine

WORKDIR /app

# Copy manifests explicitly (no wildcard ambiguity)
COPY package.json ./
COPY package-lock.json ./

# DEBUG: print manifests inside the image
RUN echo "----- package.json (inside image) -----" \
 && sed -n '1,160p' package.json \
 && echo "----- package-lock.json head (inside image) -----" \
 && head -n 60 package-lock.json || true

# Deterministic, production-only install; fallback if needed
RUN npm ci --omit=dev || npm install --omit=dev

# Copy the rest of the app
COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]
