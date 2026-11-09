<?php
// Author: UKARAKAS | Date: 09.11.2026 | Contact form: stores the message and emails it to the site address
require __DIR__ . '/_lib.php';

require_post();
$body = read_json_body(30000);

// Honeypot: real visitors never fill the hidden "website" field, bots do. Pretend success.
if (!empty($body['website'])) {
    json_out(['ok' => true]);
}

$name = one_line((string)($body['name'] ?? ''), 100);
$email = one_line((string)($body['email'] ?? ''), 200);
$phone = one_line((string)($body['phone'] ?? ''), 40);
$message = trim((string)($body['message'] ?? ''));

if (strlen($name) < 2) {
    fail('Lütfen adınızı yazın.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Lütfen geçerli bir e-posta adresi yazın.');
}
if (strlen($message) < 5) {
    fail('Lütfen mesajınızı yazın.');
}
if (strlen($message) > 5000) {
    fail('Mesaj çok uzun (en fazla 5000 karakter).');
}
if (rate_limited('contact', 5, 3600, true)) {
    fail('Kısa sürede çok fazla mesaj gönderildi. Lütfen bizi telefonla arayın.', 429);
}

// Keep a copy on the server, so no message is lost even if email delivery fails
$entry = [
    'id' => bin2hex(random_bytes(8)),
    'date' => date('c'),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'message' => $message,
];
store_update('messages', function (array &$data) use ($entry) {
    array_unshift($data, $entry);
    $data = array_slice($data, 0, 500);
});

// Send to the address shown on the site (editable in the admin panel)
$recipient = DEFAULT_RECIPIENT;
if (is_file(CONTENT_FILE)) {
    $content = json_decode((string)@file_get_contents(CONTENT_FILE), true);
    $saved = $content['contact']['email'] ?? '';
    if (is_string($saved) && filter_var($saved, FILTER_VALIDATE_EMAIL)) {
        $recipient = $saved;
    }
}

$subject = '=?UTF-8?B?' . base64_encode('Web sitesinden yeni mesaj: ' . $name) . '?=';
$fromName = '=?UTF-8?B?' . base64_encode('Aktaş Grup Web Sitesi') . '?=';
$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: ' . $fromName . ' <noreply@' . SITE_DOMAIN . '>',
    'Reply-To: ' . $email,
]);
$text = "Web sitesindeki iletişim formundan yeni bir mesaj geldi.\n\n"
    . "Ad Soyad: $name\n"
    . "E-posta: $email\n"
    . "Telefon: " . ($phone !== '' ? $phone : '-') . "\n"
    . 'Tarih: ' . date('d.m.Y H:i') . "\n\n"
    . "Mesaj:\n$message\n\n"
    . "Bu e-postayı yanıtlarsanız cevabınız doğrudan gönderene gider.\n";

$mailed = @mail($recipient, $subject, $text, $headers);

json_out(['ok' => true, 'mailed' => $mailed]);
