FROM node:latest AS core-builder
COPY ./*.json ./
COPY ./core/ ./core/
RUN npm install -w core
RUN npm run build -w core

FROM node:latest AS builder
COPY ./*.json ./
COPY ./backend/ ./backend/
COPY --from=core-builder ./core/build ./core/
COPY --from=core-builder ./core/*.json ./core/
RUN npm install -w backend
RUN npm run build -w backend

FROM node:latest AS dependencies
COPY ./package* ./
COPY ./backend/package* ./backend/
COPY --from=core-builder ./core/build ./core/
COPY --from=core-builder ./core/*.json ./core/
RUN npm install --omit=dev -w backend

FROM alpine
LABEL maintainer="DEFFERRARD Jeremy" \
      description="Open source Tactical RPG - Backend Service" \
      website="https://defferrard.dev/"

RUN apk add nodejs npm

COPY --from=builder ./backend/build ./
COPY ./backend/*.json ./
COPY --from=dependencies ./node_modules/ ./node_modules/
COPY --from=core-builder ./core/build/ ./node_modules/@defferrard/algoo-core/

EXPOSE 8080
CMD node index.js