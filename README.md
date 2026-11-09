# Aktaş Grup Web Sitesi

<!-- Author: UKARAKAS | Date: 09.11.2026 | Project notes in Turkish -->

[www.aktasmakinagrup.com](https://www.aktasmakinagrup.com): React + Vite ile yapılmış site. Admin paneli ve iletişim formu için hostingde küçük PHP dosyaları çalışır (`public/api`). Site Turhost'ta barınır.

## Siteyi güncelleme (Turhost)

1. `main` dalına yapılan her değişiklikten sonra GitHub siteyi kendisi derler ve hazır zip'i şuraya koyar:
   **https://github.com/karakasugur/aktas-makina/releases/download/guncel-site/site.zip**
2. Zip'i indirin.
3. Turhost panelinde **Dosya Yöneticisi**'ni açın, sitenin klasörüne (`public_html`) gidin.
4. Zip'i bu klasöre yükleyin ve **"Çıkart / Extract"** deyin. Var olan dosyaların üzerine yazmasına izin verin.
5. Yüklediğiniz zip dosyasını silin.

**Önemli:** `api/data` ve `uploads` klasörlerini **silmeyin**. Panelden kaydedilen içerik, admin şifresi, gelen mesajlar ve yüklenen görseller oradadır. Zip bu klasörlerdeki verilerin üzerine yazmaz.

## Admin paneli

- Adres: `https://www.aktasmakinagrup.com/admin`
- **İlk giriş:** Panel sizden yeni bir şifre ister. Site yüklendikten hemen sonra bu şifreyi belirleyin.
- **Şifreyi unutursanız:** Dosya Yöneticisi'nde `api/data/admin.php` dosyasını silin, sonra panele girip yeni şifre belirleyin.
- Panelden: iletişim bilgileri, WhatsApp numarası, ana sayfa metinleri, hakkımızda, hizmetler ve makineler (görsel yükleme dahil) düzenlenir.
- **Gelen Mesajlar** sekmesinde iletişim formundan gelen tüm mesajlar saklanır. Aynı mesaj e-posta olarak da gönderilir.

## Geliştirme

```bash
npm install --legacy-peer-deps
npm run dev
```

Yerelde PHP olmadığı için site varsayılan içerikle açılır; admin paneli "sunucuya ulaşılamadı" der. Bu normaldir.

`scripts/smoke-test.sh` PHP API'sini uçtan uca dener; GitHub Actions her push'ta bunu çalıştırır.
