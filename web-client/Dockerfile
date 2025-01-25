FROM node:22-alpine AS builder

WORKDIR /app

COPY ./package*.json .
COPY ./pnpm-lock.yaml .

RUN npm i -g pnpm
RUN pnpm install

ARG VITE_API_URL
ARG VITE_TURN_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_TURN_URL=${VITE_TURN_URL}

COPY . .

RUN pnpm run build
RUN pnpm prune --prod

FROM node:22-alpine AS deployer

WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "build"]
