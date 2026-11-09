<?php
// Author: UKARAKAS | Date: 09.11.2026 | Admin login: first-time password setup, login, logout, password change
require __DIR__ . '/_lib.php';

$action = $_GET['action'] ?? 'status';

switch ($action) {
    case 'status':
        json_out(['ok' => true, 'configured' => admin_config() !== null, 'loggedIn' => is_logged_in()]);
        break;

    case 'setup':
        // Only works while no password exists yet. To reset a forgotten password,
        // delete api/data/admin.php from the hosting file manager.
        require_post();
        if (admin_config() !== null) {
            fail('Şifre zaten belirlenmiş. Giriş yapın.', 409);
        }
        $body = read_json_body(10000);
        $password = (string)($body['password'] ?? '');
        validate_new_password($password);
        save_admin_password($password);
        login_session();
        json_out(['ok' => true]);
        break;

    case 'login':
        require_post();
        $cfg = admin_config();
        if ($cfg === null) {
            fail('Henüz şifre belirlenmemiş.', 409);
        }
        if (rate_limited('login', 5, 900, false)) {
            fail('Çok fazla hatalı deneme yapıldı. 15 dakika sonra tekrar deneyin.', 429);
        }
        $body = read_json_body(10000);
        if (!password_verify((string)($body['password'] ?? ''), $cfg['hash'])) {
            rate_limited('login', 5, 900, true);
            fail('Şifre yanlış.', 401);
        }
        login_session();
        json_out(['ok' => true]);
        break;

    case 'logout':
        require_post();
        start_session();
        $_SESSION = [];
        session_destroy();
        json_out(['ok' => true]);
        break;

    case 'change':
        require_post();
        require_admin();
        $body = read_json_body(10000);
        $cfg = admin_config();
        if ($cfg === null || !password_verify((string)($body['current'] ?? ''), $cfg['hash'])) {
            fail('Mevcut şifre yanlış.', 403);
        }
        $new = (string)($body['password'] ?? '');
        validate_new_password($new);
        save_admin_password($new);
        json_out(['ok' => true]);
        break;

    default:
        fail('Bilinmeyen işlem.', 404);
}
