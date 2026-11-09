<?php
// Author: UKARAKAS | Date: 09.11.2026 | Site content: public read, admin save and reset
require __DIR__ . '/_lib.php';

/** Keeps only plain JSON values with sane sizes. */
function clean_value($value, int $depth = 0)
{
    if ($depth > 6) {
        fail('İçerik yapısı geçersiz.');
    }
    if (is_array($value)) {
        if (count($value) > 300) {
            fail('İçerikte çok fazla öğe var.');
        }
        $out = [];
        foreach ($value as $k => $v) {
            $key = is_int($k) ? $k : substr((string)$k, 0, 60);
            $out[$key] = clean_value($v, $depth + 1);
        }
        return $out;
    }
    if (is_string($value)) {
        if (strlen($value) > 20000) {
            fail('Bir metin alanı çok uzun.');
        }
        return $value;
    }
    if (is_bool($value) || is_int($value) || is_float($value) || $value === null) {
        return $value;
    }
    fail('İçerik yapısı geçersiz.');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

if ($method === 'GET') {
    if (!is_file(CONTENT_FILE)) {
        json_out(['ok' => true, 'content' => null]);
    }
    $data = json_decode((string)@file_get_contents(CONTENT_FILE), true);
    json_out(['ok' => true, 'content' => is_array($data) ? $data : null, 'updated' => date('c', (int)filemtime(CONTENT_FILE))]);
}

require_post();
require_admin();

if ($action === 'save') {
    $body = read_json_body(1048576);
    if (!isset($body['content']) || !is_array($body['content'])) {
        fail('Kaydedilecek içerik bulunamadı.');
    }
    $content = clean_value($body['content']);
    if (is_file(CONTENT_FILE)) {
        @copy(CONTENT_FILE, CONTENT_BACKUP_FILE);
    }
    $json = json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false || !write_atomic(CONTENT_FILE, $json)) {
        fail('İçerik kaydedilemedi (sunucuda yazma izni yok).', 500);
    }
    json_out(['ok' => true, 'updated' => date('c')]);
}

if ($action === 'reset') {
    if (is_file(CONTENT_FILE)) {
        @copy(CONTENT_FILE, CONTENT_BACKUP_FILE);
        @unlink(CONTENT_FILE);
    }
    json_out(['ok' => true]);
}

fail('Bilinmeyen işlem.', 404);
