<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = htmlspecialchars($_POST['nombre']);
    $email = htmlspecialchars($_POST['email']);
    $mensaje = htmlspecialchars($_POST['mensaje']);
    
    if (empty($nombre) || empty($email) || empty($mensaje)) {
        echo "All fields are required.";
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "The e-mail is not valid.";
        exit;
    }
    
    $to = "contact@spanishhgames.com";
    $subject = "New contact message";
    $body = "Name: $nombre\ne-mail: $email\n\nMessage:\n$mensaje";
    $headers = "From: $email";
    
    if (mail($to, $subject, $body, $headers)) {
        echo "The message has been sent successfully.";
    } else {
        echo "There was an error sending the message.";
    }
} else {
    echo "Method not allowed.";
}
?>
