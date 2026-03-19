FROM node:20-alpine

WORKDIR /app

# Copy manifests explicitly
COPY package.json ./
COPY package-lock.json ./

# DEBUG: print manifests inside the image
RUN echo "----- package.json (inside image) -----" \
 && sed -n '1,160p' package.json \
 && echo "----- package-lock.json head (inside image) -----" \
 && head -n 60 package-lock.json || true

# Install dependencies using the lockfile
RUN npm ci