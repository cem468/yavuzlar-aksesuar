# Yayınlama — Cloudflare Pages (private repo, ücretsiz)

Bu site saf **HTML/CSS/JS** olduğu için derleme (build) adımı yoktur; Cloudflare Pages
dosyaları olduğu gibi yayınlar. Depo **private** kalırken yalnızca yayınlanan site herkese açık olur.

## 1. Cloudflare hesabı
1. https://dash.cloudflare.com/sign-up adresinden ücretsiz hesap açın (veya giriş yapın).
2. E-posta doğrulamasını tamamlayın.

## 2. Pages projesi oluştur
1. Sol menü → **Workers & Pages**.
2. **Create application** → **Pages** sekmesi → **Connect to Git**.
3. **GitHub**'ı seçin ve yetkilendirin.
   - **Only select repositories** → yalnızca `yavuzlar-aksesuar` deposuna izin verin.
   - **Install & Authorize**.
4. **cem468/yavuzlar-aksesuar** deposunu seçin → **Begin setup**.

## 3. Build ayarları (statik site — derleme yok)
| Alan | Değer |
|------|-------|
| Project name | `yavuzlar-aksesuar` |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | *(boş bırakın)* |
| Build output directory | `/` (kök — `index.html` burada) |

5. **Save and Deploy**.

## 4. Yayın
- ~1 dakikada deploy biter. Site adresi:
  **https://yavuzlar-aksesuar.pages.dev**
- Depo private kalır; sadece yayınlanan site herkese açıktır.

## 5. Otomatik güncelleme
Her `git push` sonrası Cloudflare otomatik yeniden yayınlar:
```bash
git add -A
git commit -m "güncelleme"
git push
```

## 6. (İsteğe bağlı) Kendi alan adı
1. Pages projesi → **Custom domains** → **Set up a custom domain**.
2. Alan adını (`yavuzlaraksesuar.com`) girin; Cloudflare DNS kaydı (CNAME) verir.
3. DNS yayılınca site kendi alan adınızda ücretsiz HTTPS ile çalışır.

## Notlar
- İletişim formu client-side'dır; gerçek e-posta gönderimi için Cloudflare **Pages Functions** veya Formspree gibi bir servis eklenebilir.
- Harita, Google Fonts ve GSAP internet üzerinden yüklenir (canlı sitede sorunsuz).
- Git bağlama adımı tarayıcı/GitHub yetkilendirmesi gerektirir; bu adımı hesap sahibi yapmalıdır.
