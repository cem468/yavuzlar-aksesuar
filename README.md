# Yavuzlar Aksesuar — Kurumsal Web Sitesi

Zamak (çinko alaşımı) metal aksesuar ve bujiteri üreten **Yavuzlar Aksesuar** için
çok sayfalı, çift dilli (TR/EN), tamamen **vanilla HTML/CSS/JS** kurumsal web sitesi.

## Özellikler
- **Çok sayfalı:** Anasayfa, Kurumsal, Ürünler, Üretim, Bilgi (SEO), İletişim
- **Çift dil (TR/EN):** `data-i18n` tabanlı sözlük + `localStorage` ile kalıcı dil
- **Sıcak premium tasarım:** krem + bebek mavisi + lacivert + altın paleti, Fraunces & Manrope tipografi
- **GSAP + ScrollTrigger** animasyonları (hero giriş, scroll-reveal, parallax) — `prefers-reduced-motion` destekli, GSAP yüklenemezse IntersectionObserver fallback
- **Ürün kataloğu:** kategori filtreli grid (Çanta, Kemer, Giyim, Kolye & Küpe, Bileklik & Yüzük, Süs & Plaka)
- **SEO:** "zamak", "bujiteri", "aksesuar" odaklı içerik + Bilgi sayfasında FAQ JSON-LD şeması
- **Responsive:** mobil hamburger menü (sağa yaslı buzlu cam panel), ortalanmış mobil footer
- **İletişim:** client-side doğrulamalı form, Google Maps embed, sabit WhatsApp butonu

## Dosya Yapısı
```
index.html · kurumsal.html · urunler.html · uretim.html · bilgi.html · iletisim.html
css/style.css            → tüm tasarım sistemi (tokenlar, bileşenler, responsive)
js/i18n.js               → TR/EN çeviri sözlüğü
js/main.js               → dil, nav, GSAP animasyon, sayaç, filtre, form, FAQ
assets/                  → logolar, favicon seti, ürün ve üretim görselleri
```

## Yerelde Çalıştırma
```bash
python -m http.server 8099
# tarayıcıda: http://localhost:8099
```
> Google Fonts, GSAP CDN ve harita için internet bağlantısı gerekir.

## Notlar
- Kök dizindeki `bujiteri*.png`, `uretim*.png`, `LOGO*.png`, `zamak.webp` kaynak (orijinal) görsellerdir; yayınlanan site `assets/` klasörünü kullanır.
- İletişim formu şu an client-side'dır; gerçek e-posta gönderimi için bir backend/servis (ör. Formspree) bağlanmalıdır.
