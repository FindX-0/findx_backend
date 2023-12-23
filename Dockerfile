ARG NODE_VERSION=18

FROM node:${NODE_VERSION}-bullseye as build

ENV NODE_OPTIONS=--max_old_space_size=4096
WORKDIR /app

COPY ./package.json ./yarn.lock tsconfig.json tsconfig.build.json nest-cli.json ./.env.production ./
COPY ./prisma/ ./prisma/
COPY ./src ./src/

RUN set -ex; yarn install --pure-lockfile
RUN set -ex; yarn build

FROM node:${NODE_VERSION}-bullseye as deps
WORKDIR /app
COPY --from=build /root/.npm /root/.npm
COPY ./package.json ./yarn.lock ./
RUN set -ex; yarn install --pure-lockfile --production

FROM node:${NODE_VERSION}-bullseye-slim

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/package.json ./
COPY --from=build /app/.env.production ./

RUN apt-get -y update && apt-get install -y openssl

EXPOSE 3000

CMD ["yarn", "start:migrate:prod"]