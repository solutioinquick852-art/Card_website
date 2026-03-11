<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require 'db.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$input = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? '';

if ($action === 'login') {
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        http_response_code(401);
        echo json_encode(["error" => "用戶名或密碼錯誤"]);
        exit;
    }

    echo json_encode(["success" => true, "username" => $admin['username']]);
}

elseif ($action === 'change-password') {
    $username = $input['username'] ?? '';
    $old_password = $input['old_password'] ?? '';
    $new_password = $input['new_password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($old_password, $admin['password_hash'])) {
        http_response_code(401);
        echo json_encode(["error" => "密碼錯誤"]);
        exit;
    }

    $hashed = password_hash($new_password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE admins SET password_hash = ?, updated_at = NOW() WHERE username = ?");
    $stmt->execute([$hashed, $username]);

    echo json_encode(["success" => true, "message" => "密碼修改成功"]);
}

elseif ($action === 'reset-password') {
    $username     = $input['username'] ?? '';
    $new_password = $input['new_password'] ?? '';
    $code         = $input['code'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin) {
        http_response_code(404);
        echo json_encode(["error" => "用戶不存在"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM reset_codes WHERE user_name = ? AND code = ?");
    $stmt->execute([$username, $code]);
    $reset = $stmt->fetch();

    if (!$reset) {
        http_response_code(400);
        echo json_encode(["error" => "驗證碼錯誤"]);
        exit;
    }

    if (strtotime($reset['expire_time']) < time()) {
        http_response_code(400);
        echo json_encode(["error" => "驗證碼已過期"]);
        exit;
    }

    $hashed = password_hash($new_password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE admins SET password_hash = ?, updated_at = NOW() WHERE username = ?");
    $stmt->execute([$hashed, $username]);

    $stmt = $pdo->prepare("DELETE FROM reset_codes WHERE id = ?");
    $stmt->execute([$reset['id']]);

    echo json_encode(["success" => true, "message" => "密碼重置成功"]);
}elseif ($action === 'resend-code') {
    $username = 'admin';

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin) {
        http_response_code(404);
        echo json_encode(["error" => "用戶不存在"]);
        exit;
    }

    $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

    $expireTime = date('Y-m-d H:i:s', time() + 300);

    $stmt = $pdo->prepare("DELETE FROM reset_codes WHERE user_name = ?");
    $stmt->execute([$username]);

    $stmt = $pdo->prepare("INSERT INTO reset_codes (user_name, code, expire_time) VALUES (?, ?, ?)");
    $stmt->execute([$username, $code, $expireTime]);

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'solutioinquick852@gmail.com'; 
        $mail->Password   = 'zqanyubkydtnagcr';            
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('solutioinquick852@gmail.com', 'Password Reset');
        $mail->addAddress('solutioinquick852@gmail.com', $username);

        $mail->isHTML(true);
        $mail->Subject = "Password Reset Verification Code";
        $mail->Body    = "
            <h3>密碼重置驗證碼</h3>
            <p>您的驗證碼是：<b>$code</b></p>
            <p>有效時間：5 分鐘</p>
        ";

        $mail->send();
        echo json_encode(["success" => true, "message" => "驗證碼已重新發送"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => $mail->ErrorInfo]);
    }
}


