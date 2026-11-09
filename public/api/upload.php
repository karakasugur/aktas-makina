<?php
// Author: UKARAKAS | Date: 09.11.2026 | Image upload from the admin panel into /uploads
require __DIR__ . '/_lib.php';

require_post();
require_admin();

$file = $_FILES['file'] ?? null;
if (!is_array($file) || !isset($file['error'])) {
    fail('Dosya seçilmedi.');
}
if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
    fail('Dosya sunucunun izin verdiği boyuttan büyük.');
}
if ($file['error'] !== UPLOAD_ERR_OK) {
    fail('Dosya yüklenemedi (hata kodu ' . (int)$file['error'] . ').');
}
if ($file['size'] > 5 * 1024 * 1024) {
    fail('Dosya en fazla 5 MB olabilir.');
}

// Trust the real image type, never the file name the browser sent
$info = @getimagesize($file['tmp_name']);
$extensions = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
if ($info === false || !isset($extensions[$info[2]])) {
    fail('Sadece JPG, PNG veya WEBP resim yüklenebilir.');
}

if (!is_dir(UPLOAD_DIR) && !@mkdir(UPLOAD_DIR, 0755, true)) {
    fail('Yükleme klasörü oluşturulamadı (yazma izni yok).', 500);
}

$name = date('Ymd') . '-' . bin2hex(random_bytes(6)) . '.' . $extensions[$info[2]];
if (!@move_uploaded_file($file['tmp_name'], UPLOAD_DIR . '/' . $name)) {
    fail('Dosya kaydedilemedi (yazma izni yok).', 500);
}
@chmod(UPLOAD_DIR . '/' . $name, 0644);

json_out(['ok' => true, 'url' => UPLOAD_URL . '/' . $name]);
