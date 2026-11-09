#!/usr/bin/env bash
# Author: UKARAKAS | Date: 09.11.2026 | End-to-end test of the PHP API using PHP's built-in server
# Usage: bash scripts/smoke-test.sh dist
set -euo pipefail

SRC="${1:-dist}"
WORK="$(mktemp -d)"      # copy, so test data never ends up in site.zip
JAR="$(mktemp)"
cp -r "$SRC/." "$WORK/"
php -S 127.0.0.1:8099 -t "$WORK" > /tmp/php-server.log 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT
sleep 1

API=http://127.0.0.1:8099/api
STEP=0

# post <path> <json>  -> prints body; status code in $CODE
post() {
  local out
  out=$(curl -s -w '\n%{http_code}' -b "$JAR" -c "$JAR" -H 'X-Requested-With: aktas' -H 'Content-Type: application/json' -X POST "$API/$1" --data "$2")
  CODE=$(tail -n1 <<< "$out"); BODY=$(sed '$d' <<< "$out")
}
get() {
  local out
  out=$(curl -s -w '\n%{http_code}' -b "$JAR" -c "$JAR" "$API/$1")
  CODE=$(tail -n1 <<< "$out"); BODY=$(sed '$d' <<< "$out")
}
check() {  # check <description> <expected code> <text that must appear in body>
  STEP=$((STEP + 1))
  if [[ "$CODE" == "$2" && "$BODY" == *"$3"* ]]; then
    echo "OK   $STEP. $1"
  else
    echo "FAIL $STEP. $1 -> HTTP $CODE: $BODY"
    cat /tmp/php-server.log
    exit 1
  fi
}

get 'auth.php?action=status';               check 'Başlangıçta şifre yok' 200 '"configured":false'
get 'content.php';                           check 'Başlangıçta içerik yok' 200 '"content":null'
post 'content.php?action=save' '{"content":{"heroTitle":"x"}}'; check 'Girişsiz kayıt reddedilir' 401 '"ok":false'
post 'auth.php?action=setup' '{"password":"kisa"}'; check 'Kısa şifre reddedilir' 400 'en az 8'
post 'auth.php?action=setup' '{"password":"deneme-sifre-123"}'; check 'İlk şifre belirlenir' 200 '"ok":true'
post 'auth.php?action=setup' '{"password":"baska-sifre-123"}'; check 'Şifre ikinci kez belirlenemez' 409 'zaten'
post 'content.php?action=save' '{"content":{"heroTitle":"Test başlık","contact":{"email":"test@example.com"}}}'; check 'İçerik kaydedilir' 200 '"ok":true'
get 'content.php';                           check 'Kaydedilen içerik okunur' 200 'Test başlık'

out=$(curl -s -w '\n%{http_code}' -H 'Content-Type: application/json' -X POST "$API/contact.php" --data '{"name":"A"}')
CODE=$(tail -n1 <<< "$out"); BODY=$(sed '$d' <<< "$out"); check 'Başka siteden form gönderimi engellenir' 403 'Geçersiz'
post 'contact.php' '{"name":"Ali Veli","email":"bozuk","message":"Merhaba"}'; check 'Geçersiz e-posta reddedilir' 400 'e-posta'
post 'contact.php' '{"name":"Ali Veli","email":"ali@example.com","phone":"0555","message":"Deneme mesajı"}'; check 'Form mesajı kabul edilir' 200 '"ok":true'
post 'contact.php' '{"name":"Bot","email":"bot@example.com","message":"spam spam","website":"http://spam"}'; check 'Spam tuzağı sessizce yutulur' 200 '"ok":true'
get 'messages.php';                          check 'Mesaj panelde görünür' 200 'Deneme mesajı'
[[ "$BODY" != *"spam spam"* ]] || { echo "FAIL spam mesajı kaydedilmiş"; exit 1; }

echo 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' | base64 -d > "$WORK/../t.png"
out=$(curl -s -w '\n%{http_code}' -b "$JAR" -H 'X-Requested-With: aktas' -F "file=@$WORK/../t.png" "$API/upload.php")
CODE=$(tail -n1 <<< "$out"); BODY=$(sed '$d' <<< "$out"); check 'Resim yüklenir' 200 '/uploads/'
URL=$(sed -E 's/.*"url":"([^"]+)".*/\1/' <<< "$BODY")
[[ $(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:8099$URL") == 200 ]] && echo "OK   Yüklenen resim açılır" || { echo "FAIL yüklenen resim açılmıyor"; exit 1; }
echo '<?php echo 1;' > "$WORK/../evil.php"
out=$(curl -s -w '\n%{http_code}' -b "$JAR" -H 'X-Requested-With: aktas' -F "file=@$WORK/../evil.php" "$API/upload.php")
CODE=$(tail -n1 <<< "$out"); BODY=$(sed '$d' <<< "$out"); check 'Resim olmayan dosya reddedilir' 400 'Sadece'

[[ $(curl -s -o /dev/null -w '%{http_code}' "$API/data/admin.php") == 404 ]] && echo "OK   Şifre dosyası dışarıdan okunamaz" || { echo "FAIL admin.php okunabiliyor"; exit 1; }

post 'auth.php?action=change' '{"current":"yanlis","password":"yeni-sifre-456"}'; check 'Yanlış mevcut şifreyle değişmez' 403 'yanlış'
post 'auth.php?action=change' '{"current":"deneme-sifre-123","password":"yeni-sifre-456"}'; check 'Şifre değiştirilir' 200 '"ok":true'
post 'auth.php?action=logout' '{}';          check 'Çıkış yapılır' 200 '"ok":true'
post 'content.php?action=save' '{"content":{}}'; check 'Çıkıştan sonra kayıt reddedilir' 401 'Oturum'
post 'auth.php?action=login' '{"password":"deneme-sifre-123"}'; check 'Eski şifreyle giriş olmaz' 401 'yanlış'
post 'auth.php?action=login' '{"password":"yeni-sifre-456"}'; check 'Yeni şifreyle giriş olur' 200 '"ok":true'
post 'content.php?action=reset' '{}';        check 'İçerik sıfırlanır' 200 '"ok":true'
get 'content.php';                           check 'Sıfırdan sonra içerik boş' 200 '"content":null'

echo "Tüm PHP testleri geçti."
