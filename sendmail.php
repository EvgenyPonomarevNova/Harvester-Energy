<?php
// Включим подробное логирование
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Начнем буферизацию вывода
ob_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Логируем полученные данные
    $log_data = "=== " . date('Y-m-d H:i:s') . " ===\n";
    $log_data .= "POST данные: " . print_r($_POST, true) . "\n";
    
    $name = htmlspecialchars(trim($_POST['name']));
    $phone = htmlspecialchars(trim($_POST['phone']));
    $company = htmlspecialchars(trim($_POST['company']));
    
    $log_data .= "Обработанные данные:\n";
    $log_data .= "Имя: $name\n";
    $log_data .= "Телефон: $phone\n"; 
    $log_data .= "Компания: $company\n\n";
    
    // ⚠️ ОТПРАВЛЯЕМ НА КОРПОРАТИВНУЮ ПОЧТУ
    $to = "info@harvesterenergy.ru";
    
    $subject = "Новая заявка с сайта - " . date('d.m.Y H:i');
    
    $message = "
    🌟 НОВАЯ ЗАЯВКА С САЙТА HARVESTER ENERGY 🌟

    КОНТАКТНАЯ ИНФОРМАЦИЯ:
    👤 Имя: $name
    📞 Телефон: $phone
    🏢 Компания: " . ($company ?: "Не указано") . "

    ДЕТАЛИ ЗАЯВКИ:
    🕒 Время получения: " . date('d.m.Y H:i:s') . "
    🌐 Источник: harvesterenergy.ru
    📧 Тип: Запрос на презентацию

    💼 ДЛЯ РУКОВОДИТЕЛЯ:
    Просьба связаться с клиентом в течение 1 часа
    ";

    // ЗАГОЛОВКИ ДЛЯ КОРПОРАТИВНОЙ ПОЧТЫ
    $headers = "From: website@harvesterenergy.ru\r\n";
    $headers .= "Reply-To: website@harvesterenergy.ru\r\n";
    $headers .= "X-Priority: 1 (Highest)\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    
    $log_data .= "Параметры отправки:\n";
    $log_data .= "Кому: $to\n";
    $log_data .= "Тема: $subject\n";
    $log_data .= "Заголовки: $headers\n\n";
    
    // Кодируем тему для UTF-8
    $encoded_subject = '=?UTF-8?B?'.base64_encode($subject).'?=';
    
    // Пытаемся отправить
    $mail_result = mail($to, $encoded_subject, $message, $headers);
    
    $log_data .= "Результат mail(): " . ($mail_result ? "TRUE" : "FALSE") . "\n";
    
    // Безопасная проверка ошибок
    $last_error = error_get_last();
    $log_data .= "Ошибки: " . ($last_error ? $last_error['message'] : 'Нет ошибок') . "\n";
    $log_data .= "=================================\n\n";
    
    // Записываем лог в файл
    file_put_contents('mail_debug.log', $log_data, FILE_APPEND | LOCK_EX);
    
    // Очищаем буфер перед отправкой headers
    ob_clean();
    
    if ($mail_result) {
        http_response_code(200);
        echo "OK - Заявка отправлена руководителю! Мы свяжемся с вами в течение 15 минут.";
    } else {
        http_response_code(500);
        echo "ERROR - Ошибка отправки. Пожалуйста, позвоните нам: +7 (800) 123-45-67";
    }
} else {
    http_response_code(405);
    echo "Метод не разрешен";
}

ob_end_flush();
?>