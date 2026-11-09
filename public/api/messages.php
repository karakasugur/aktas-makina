<?php
// Author: UKARAKAS | Date: 09.11.2026 | Contact form messages for the admin panel: list and delete
require __DIR__ . '/_lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    require_admin();
    json_out(['ok' => true, 'messages' => store_read('messages')]);
}

require_post();
require_admin();

if (($_GET['action'] ?? '') === 'delete') {
    $body = read_json_body(10000);
    $id = (string)($body['id'] ?? '');
    store_update('messages', function (array &$data) use ($id) {
        $data = array_values(array_filter($data, function ($m) use ($id) {
            return !is_array($m) || ($m['id'] ?? '') !== $id;
        }));
    });
    json_out(['ok' => true]);
}

fail('Bilinmeyen işlem.', 404);
