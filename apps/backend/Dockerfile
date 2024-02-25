# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.7.0
ARG PNPM_VERSION=8.10.2
ARG TURBO_VERSION=1.11.3

# base
FROM node:${NODE_VERSION}-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    npm install -g pnpm@${PNPM_VERSION} turbo@${TURBO_VERSION}

# prune
FROM base as pruned-files

WORKDIR /app

COPY . .

RUN npx turbo prune weft-backend --docker

# build + deps
FROM base as build-artifact

WORKDIR /app

COPY --from=pruned-files /app/out/json .
COPY --from=pruned-files /app/out/pnpm-lock.yaml .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruned-files /app/out/full .

RUN npx turbo build

# final
FROM base as final

ENV NODE_ENV production

USER node

WORKDIR /app

COPY --from=build-artifact /app .

EXPOSE 8000

CMD node ./apps/backend/dist/app.js