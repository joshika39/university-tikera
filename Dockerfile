FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS build

WORKDIR /app

RUN npm install -g pnpm@latest

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY --from=deps /app/package.json ./
COPY --from=deps /app/pnpm-lock.yaml ./

RUN pnpm build


FROM nginx:stable-alpine AS runner

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]