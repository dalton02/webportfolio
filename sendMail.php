<?php 


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

echo  "<script> console.log('au');</script>";

if(isset($_POST['emailText']) && !empty($_POST['emailText']) && 
isset($_POST['emailAddress']) && !empty($_POST['emailAddress']) &&
isset($_POST['nameCompany']) && !empty($_POST['nameCompany'])){
	
$conteudo = $_POST['emailText'];
$remetente = $_POST['emailAddress'];
$name = $_POST['nameCompany'];
$currentLang = $_POST['languageSelected'];
$mail = new PHPMailer(true);


$bodyPT = "Olá, meu nome é ".$name." e venho através deste email contatar você: <br/>".$conteudo."<br/>Email para contato: ".$remetente;
$bodyEN = "Hi, my name is ".$name." and i'm here to contact you: <br/>".$conteudo."<br/>Mail for Contact: ".$remetente;

try{
$meuEmail = 'dalton.gomes@aluno.ufca.edu.br';
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->Username = $meuEmail;
$mail->Password = 'jbid xwoi unpx ajhp ';
$mail->Port = 465;


//Primeiro eu envio para meu email quem quer chamar eu né
$mail->setFrom('dalton.gomes@aluno.ufca.edu.br','From '.$name);
$mail->addAddress($meuEmail,$name);
$mail->isHtml(true);
$mail->Subject = "Mensagem da PROJECTS.IO";

if($currentLang == "pt_BR"){
$mail->Body = $bodyPT;
}
else{
$mail->Body = $bodyEN;
}

$mail->send(); 


$bodyPT = "Olá ".$name.", fico feliz que tenha me contatado. Em breve entrarei em contato com você";
$bodyEN = "Hi ".$name.", i'm very happy and excited to know that you take interest in my portifolio, soon enough i will be in touch with you";

//Mando uma resposta pro senhor gente boa
$mail->setFrom('dalton.gomes@aluno.ufca.edu.br','From Dalton Gomes');
$mail->addAddress($remetente,$name);
$mail->isHtml(true);
$mail->Subject = "NO-REPLY PROJECTS.IO";

if($currentLang == "pt_BR"){
$mail->Body = $bodyPT;
}
else{
$mail->Body = $bodyEN;
}

$mail->send(); 

 
}
catch(Exception $e){
	
}

}


?> 
