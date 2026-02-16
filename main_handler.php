<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log');

// === ЛОГ-ФАЙЛ ДЛЯ ОТЛАДКИ ===
function log_debug($msg) {
    file_put_contents(__DIR__ . '/debug.log', date('[d.m.Y H:i:s] ') . $msg . "\n", FILE_APPEND);
}

log_debug("=== START SCRIPT ===");

// 1️⃣ Настройки
$to_email = "shemyakinaapdtr@gmail.com";
$gmail_user = "info.neopdtr@gmail.com";
$gmail_pass = "xffe imvt koru cair";
$telegram_token = "8256111621:AAFzV19C48IDVILGOlY1BEyg-dwq9DT61Ho";
$telegram_chat_id = "411148134";

// 2️⃣ Получаем данные
$last_name = trim($_POST['last_name'] ?? '');
$first_name = trim($_POST['first_name'] ?? '');
$age = trim($_POST['age'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$complaints = trim($_POST['complaints'] ?? '');
$date = date("d.m.Y H:i");

log_debug("POST: " . json_encode($_POST, JSON_UNESCAPED_UNICODE));

// 3️⃣ Проверка полей
if (!$last_name || !$first_name || !$age || !$phone || !$complaints) {
    log_debug("❌ Не все поля заполнены");
    echo json_encode(["status" => "error", "message" => "❌ Заполните все поля"]);
    exit;
}

log_debug("✅ Все поля получены");

// 4️⃣ Формируем текст
$message_text = "📝 Новая заявка клиента\n\n" .
"👤 ФИО: $first_name $last_name\n" .
"🎂 Возраст: $age\n" .
"📱 Телефон: $phone\n" .
"⏰ Дата: $date\n\n" .
"❗ Жалоба:\n- $complaints\n";

// 5️⃣ Отправка письма через PHPMailer
require_once __DIR__ . '/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/phpmailer/src/SMTP.php';
require_once __DIR__ . '/phpmailer/src/Exception.php';

$mail = new PHPMailer\PHPMailer\PHPMailer(true);

try {
    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $gmail_user;
    $mail->Password = $gmail_pass;
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom($gmail_user, 'Новая заявка');
    $mail->addAddress($to_email);
    $mail->Subject = '📝 Новая заявка клиента';
    $mail->Body = $message_text;
    $mail->isHTML(false);

    $mail->send();
    log_debug("📧 Письмо успешно отправлено");
} catch (Exception $e) {
    log_debug("❌ Ошибка при отправке письма: " . $mail->ErrorInfo);
}

// 6️⃣ Отправка в Telegram
$telegram_url = "https://api.telegram.org/bot$telegram_token/sendMessage";
$params = [
    'chat_id' => $telegram_chat_id,
    'text' => $message_text,
    'parse_mode' => 'HTML'
];

$ch = curl_init($telegram_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

log_debug("Telegram result: " . $result);
log_debug("Telegram error: " . $err);

echo json_encode(["status" => "success", "message" => "✅ Заявка успешно отправлена!"]);
log_debug("=== END SCRIPT ===");
