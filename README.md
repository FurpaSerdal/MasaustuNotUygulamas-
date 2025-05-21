# 📝 Electron Note App

Electron ve Angular kullanılarak geliştirilmiş masaüstü bir not alma uygulamasıdır. Notlarınız SQLite veritabanında saklanır ve modern bir arayüz ile yönetilir.

## 🚀 Özellikler

✔️ Not ekleme, silme, güncelleme  
📦 Notları arşivleme ve geri yükleme  
🕒 Güncellenme tarihi gösterimi  
🔐 Veriler SQLite ile yerel olarak saklanır  
🖥️ Tamamen masaüstü uygulaması olarak çalışır

## 📷 Uygulama Görüntüsü

![Not Uygulaması Görseli](assets/icons/notepad-color-icon.png)

## 🛠️ Kullanılan Teknolojiler

- Electron  
- Angular  
- SQLite  
- Prisma ORM  
- Bootstrap 5

## 🔧 Kurulum

**1. Projeyi Klonla**  
`git clone https://github.com/kullanici-adi/electron-note-app.git`  
`cd electron-note-app`

**2. Bağımlılıkları Kur**  
`npm install`

**3. Prisma ile Veritabanı Kurulumu**  
`npx prisma generate`  
`npx prisma migrate dev --name init`  
> `prisma/schema.prisma` dosyasında veri modeli tanımlıdır. SQLite kullanır.
**4. Electron Main'i Derle**  
`npx tsc --project tsconfig.electron.json` 

**5. Angular UI'yi Derle**  
`ng build`  
> `dist/` klasörüne Angular çıktısı üretilecektir.

**6. Electron Uygulamasını Başlat**  
`npm run electron:start`  
> Uygulama masaüstü ortamında açılacaktır.

**7. Uygulama Derleme (Paketleme)**  
`npm run electron:build`  
> Bu komut ile `.exe` gibi dağıtılabilir dosyalar oluşturabilirsiniz.  
> `electron-builder` yapılandırmasına göre çalışır.


"# MasaustuNotUygulamas-" 
