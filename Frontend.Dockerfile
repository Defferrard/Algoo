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
COPY ./frontend/ ./frontend/
COPY ./core/ ./core/

RUN npm install -w frontend
RUN npm run build -w frontend

FROM node:${NODE_VERSION} AS dependencies
WORKDIR app
COPY ./package* ./
COPY ./frontend/package* ./frontend/
COPY --from=core-builder /app/core/build ./core/
COPY --from=core-builder /app/core/*.json ./core/
RUN npm install --omit=dev -w frontend

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}
LABEL maintainer="DEFFERRARD Jeremy" \
      description="Open source Tactical RPG - Frontend Service" \
      website="https://defferrard.dev/"

USER node
WORKDIR app

COPY --from=builder /app/frontend/build ./
COPY ./frontend/*.json ./
COPY --from=dependencies /app/node_modules/ ./node_modules/
COPY --from=core-builder /app/core/build/ ./node_modules/@defferrard/algoo-core/

EXPOSE 3000
CMD node index.js