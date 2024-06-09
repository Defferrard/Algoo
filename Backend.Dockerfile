ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.19

FROM node:${NODE_VERSION} AS core-builder
WORKDIR app
COPY ./*.json ./
COPY ./core/ ./core/
RUN npm install -w core
RUN npm run build -w core

FROM node:${NODE_VERSION} AS builder
WORKDIR app
COPY ./*.json ./
COPY ./backend/ ./backend/
COPY --from=core-builder /app/core/build ./core/
COPY --from=core-builder /app/core/*.json ./core/
RUN npm install -w backend
RUN npm run build -w backend

FROM node:${NODE_VERSION} AS dependencies
WORKDIR app
COPY ./package* ./
COPY ./backend/package* ./backend/
COPY --from=core-builder /app/core/build ./core/
COPY --from=core-builder /app/core/*.json ./core/
RUN npm install --omit=dev -w backend

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}
LABEL maintainer="DEFFERRARD Jeremy" \
      description="Open source Tactical RPG - Backend Service" \
      website="https://defferrard.dev/"

USER node
WORKDIR app

COPY --from=builder /app/backend/build ./
COPY ./backend/*.json ./
COPY --from=dependencies /app/node_modules/ ./node_modules/
COPY --from=core-builder /app/core/build/ ./node_modules/@defferrard/algoo-core/

EXPOSE 8080
CMD node index.js