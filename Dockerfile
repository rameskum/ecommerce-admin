FROM node:20-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package*.json .
COPY pnpm-lock.yaml .
COPY . .
RUN pnpm i
RUN pnpm build

EXPOSE 3000
CMD [ "pnpm", "start" ]