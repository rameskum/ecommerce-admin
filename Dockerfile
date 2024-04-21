FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm i

COPY . .

RUN pnpm run postinstall
RUN pnpm build

EXPOSE 3000
CMD [ "pnpm", "start" ]