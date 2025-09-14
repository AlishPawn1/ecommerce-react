FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5174
CMD ["npm", "run", "dev", "--", "--port", "5174"]