FROM node:18.15.0 AS builder
COPY package* ./
RUN npm install
COPY . .
RUN npm run build


FROM alpine
LABEL maintainer="DEFFERRARD Jeremy" \
      description="Dashboard of my Kubernetes deployments." \
      website="https://hub.defferrard.dev/"

RUN apk add nodejs npm

COPY --from=builder ./build ./
COPY package* ./
RUN npm install --production

EXPOSE 3000
CMD node index.js
