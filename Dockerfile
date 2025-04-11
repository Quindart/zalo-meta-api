FROM node:18

# Cài đặt công cụ biên dịch cho bcrypt và sharp
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps
# Tái xây dựng bcrypt và sharp để đảm bảo tương thích
RUN npm rebuild bcrypt sharp --build-from-source

COPY . .

EXPOSE 5000

CMD ["npm", "start"]