# library Mailer

The library Mailer is a software development kit (library) package designed to provide a convenient and efficient way to integrate email functionality into budget control applications.

## Features

- **Easy Integration**: The library Mailer offers a simple and straightforward integration process, allowing developers to quickly incorporate email sending capabilities into their applications.

- **Flexible Configuration**: With the library Mailer, you have the flexibility to configure various email settings, such as the SMTP server, port, authentication credentials, and more.

- **Multiple Email Providers**: The library  supports popular email providers, including Gmail, Outlook, and SendGrid, ensuring compatibility with a wide range of email services.

- **Template Support**: Simplify your email creation process by utilizing pre-defined email templates. The library Mailer provides a template engine that allows you to customize and personalize your emails effortlessly.

## Getting Started

To get started with the library Mailer, follow these steps:

1. Install the library Mailer package using your preferred package manager:

## Example
```
// SET UP
$mail = new \MLAB\SdkMailer\Service\Mail();
$mail->setHost(env('MAIL_HOST', 'mailhog'));
$mail->setDriver(env('MAIL_DRIVER', 'mailhog'));
$mail->setPassword(env('MAIL_PASSWORD', ''));
$mail->setUser(env('MAIL_USER', ''));
$mail->setEmailFromAddress(env('MAIL_FROM_ADDRESS'));

$view = new ViewMailCustom(); // create a custom class and extend with the base of the view mail
$view->setMessage($data->email." </br> ".$data->message);
$view->setName($data->name);

$mail->sendMail(env('MAIL_TO_ADDRESS'), "Contact form", $view);

```

[GitHub link](https://github.com/mlabfactory/Libs_Mailer)