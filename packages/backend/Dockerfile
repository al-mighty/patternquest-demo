FROM node:20-alpine AS build
WORKDIR /app
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend
COPY package.json package-lock.json ./
RUN npm ci --workspace=packages/backend
RUN npm run build -w packages/backend

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/packages/backend/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]