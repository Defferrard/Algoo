FROM node:latest AS core-builder
COPY ./*.json ./
COPY ./core/ ./core/
RUN npm install -w core
RUN npm run build -w core

FROM node:latest AS builder
COPY ./*.json ./
COPY ./frontend/ ./frontend/
COPY ./core/ ./core/

RUN npm install -w frontend
RUN npm run build -w frontend

FROM node:latest AS dependencies
COPY ./package* ./
COPY ./frontend/package* ./frontend/
COPY --from=core-builder ./core/build ./core/
COPY --from=core-builder ./core/*.json ./core/
RUN npm install --omit=dev -w frontend

FROM alpine
LABEL maintainer="DEFFERRARD Jeremy" \
      description="Open source Tactical RPG - Frontend Service" \
      website="https://defferrard.dev/"

RUN apk add nodejs npm

COPY --from=builder ./frontend/build ./
COPY ./frontend/*.json ./
COPY --from=dependencies ./node_modules/ ./node_modules/
COPY --from=core-builder ./core/build/ ./node_modules/@defferrard/algoo-core/

EXPOSE 3000
CMD node index.js