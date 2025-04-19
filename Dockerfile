

# Node.js LTS sürümünü kullan
FROM node:18

# Çalışma dizinini ayarla
WORKDIR /usr/src/app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci --only=development

# Uygulamanın geri kalanını kopyala
COPY . .

# Logs dizini oluştur (eğer yoksa)
RUN mkdir -p logs

# Ortam değişkenlerini ayarla
ENV NODE_ENV=development

# Uygulamanın çalıştığı portu aç
EXPOSE 3000

# Uygulamayı çalıştırma komutu
CMD ["node", "server.js"]

