<?php
// Author: UKARAKAS | Date: 09.11.2026 | Shared helpers for the site API (PHP 7.4+)
declare(strict_types=1);

date_default_timezone_set('Europe/Istanbul');

const SITE_DOMAIN = 'aktasmakinagrup.com';
const DEFAULT_RECIPIENT = 'info@aktasmakinagrup.com';
const DATA_DIR = __DIR__ . '/data';
const CONTENT_FILE = DATA_DIR . '/content.json';
const CONTENT_BACKUP_FILE = DATA_DIR . '/content.prev.json';
const UPLOAD_DIR = __DIR__ . '/../uploads';
const UPLOAD_URL = '/uploads';
const SESSION_IDLE_SECONDS = 7200;
// Prepended to private data files: if the web server ever serves them, PHP runs this and stops
const STORE_GUARD = "<?php http_response_code(404); exit; ?>\n";

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function json_out(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400): void
{
    json_out(['ok' => false, 'error' => $message], $status);
}

function require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        fail('Bu işlem için POST gerekli.', 405);
    }
    // Browsers cannot send this header cross-site without CORS, which we never allow (CSRF protection)
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'aktas') {
        fail('Geçersiz istek.', 403);
    }
}

function read_json_body(int $maxBytes = 1048576): array
{
    $raw = file_get_contents('php://input', false, null, 0, $maxBytes + 1);
    if ($raw === false || strlen($raw) > $maxBytes) {
        fail('İstek çok büyük.', 413);
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail('Geçersiz istek.');
    }
    return $data;
}

function deny_htaccess(): string
{
    return "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n"
        . "<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n";
}

function ensure_data_dir(): void
{
    if (!is_dir(DATA_DIR) && !@mkdir(DATA_DIR, 0755, true)) {
        fail('Sunucuda veri klasörü oluşturulamadı (yazma izni yok).', 500);
    }
    if (!is_file(DATA_DIR . '/.htaccess')) {
        @file_put_contents(DATA_DIR . '/.htaccess', deny_htaccess());
    }
}

function write_atomic(string $file, string $data): bool
{
    ensure_data_dir();
    $tmp = $file . '.tmp' . bin2hex(random_bytes(4));
    if (@file_put_contents($tmp, $data, LOCK_EX) === false) {
        return false;
    }
    if (!@rename($tmp, $file)) {
        @unlink($tmp);
        return false;
    }
    return true;
}

// ---- Private key/value stores (admin password hash, messages, rate limits) ----

function store_path(string $name): string
{
    return DATA_DIR . '/' . $name . '.php';
}

function store_decode(string $raw): array
{
    $pos = strpos($raw, "\n");
    if ($pos === false) {
        return [];
    }
    $data = json_decode(substr($raw, $pos + 1), true);
    return is_array($data) ? $data : [];
}

function store_read(string $name): array
{
    $file = store_path($name);
    if (!is_file($file)) {
        return [];
    }
    $raw = @file_get_contents($file);
    return $raw === false ? [] : store_decode($raw);
}

/** Runs $fn(array &$data) under an exclusive lock and saves the result. Returns what $fn returns. */
function store_update(string $name, callable $fn)
{
    ensure_data_dir();
    $fh = @fopen(store_path($name), 'c+');
    if ($fh === false) {
        fail('Sunucuda dosya yazılamadı (yazma izni yok).', 500);
    }
    flock($fh, LOCK_EX);
    $raw = stream_get_contents($fh);
    $data = $raw ? store_decode($raw) : [];
    $result = $fn($data);
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, STORE_GUARD . json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
    return $result;
}

/** True when this visitor already hit the limit. With $record, also counts this attempt. */
function rate_limited(string $bucket, int $max, int $windowSeconds, bool $record): bool
{
    $key = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $now = time();
    return store_update('rl_' . $bucket, function (array &$data) use ($key, $now, $max, $windowSeconds, $record) {
        foreach ($data as $k => $times) {
            $data[$k] = array_values(array_filter((array)$times, function ($t) use ($now, $windowSeconds) {
                return is_int($t) && $t > $now - $windowSeconds;
            }));
            if (!$data[$k]) {
                unset($data[$k]);
            }
        }
        $limited = isset($data[$key]) && count($data[$key]) >= $max;
        if (!$limited && $record) {
            $data[$key][] = $now;
        }
        return $limited;
    });
}

// ---- Admin session ----

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('aktas_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function admin_config(): ?array
{
    $cfg = store_read('admin');
    return isset($cfg['hash']) && is_string($cfg['hash']) ? $cfg : null;
}

function save_admin_password(string $password): void
{
    $hash = password_hash($password, PASSWORD_DEFAULT);
    store_update('admin', function (array &$data) use ($hash) {
        $data = ['hash' => $hash, 'updated' => date('c')];
    });
}

function login_session(): void
{
    start_session();
    session_regenerate_id(true);
    $_SESSION['admin'] = true;
    $_SESSION['last'] = time();
}

function is_logged_in(): bool
{
    start_session();
    if (empty($_SESSION['admin'])) {
        return false;
    }
    if (time() - (int)($_SESSION['last'] ?? 0) > SESSION_IDLE_SECONDS) {
        $_SESSION = [];
        return false;
    }
    $_SESSION['last'] = time();
    return true;
}

function require_admin(): void
{
    if (!is_logged_in()) {
        fail('Oturum süresi doldu, lütfen tekrar giriş yapın.', 401);
    }
}

function validate_new_password(string $password): void
{
    if (strlen($password) < 8) {
        fail('Şifre en az 8 karakter olmalı.');
    }
    if (strlen($password) > 200) {
        fail('Şifre çok uzun.');
    }
}

/** Single-line text safe for mail headers. */
function one_line(string $s, int $maxLen): string
{
    $s = trim(preg_replace('/[\r\n\t]+/', ' ', $s) ?? '');
    return function_exists('mb_substr') ? mb_substr($s, 0, $maxLen) : substr($s, 0, $maxLen);
}
