<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/6
 * Time: 10:14
 */
include_once ('config.php');

$username = $_POST['username'];
$employee_number = $_POST['employee_number'];
$telephone = (int)$_POST['telephone'];
$email = $_POST['email'];
$score = (int)$_POST['score'];

//$username = '小';
//$employee_number = '123113';
//$telephone = '15800663565';
//$email = '025485458@qq.com';
//$score = 11191;

$hasError = false;
$strError = '';

if(mb_strlen($username,'utf-8')<=0||mb_strlen($username,'utf-8')>30){
    $hasError = true;
    $strError .= '姓名为空或多于30字。';
}

$pattern = "/^1[3-8]\d{9}$/i";
if ( !preg_match( $pattern, $telephone ) ) {
    $hasError = true;
    $strError .= '手机格式不对。';
}

$pattern = "/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i";
if ( !preg_match( $pattern, $email ) ) {
    $hasError = true;
    $strError .= '邮箱格式不对。';
}

if($hasError){
    echo '{"result":-1,"msg":"'.$strError.'"}';
    exit();
}

$name = addslashes($username);
$employee_number = addslashes($employee_number);
$telephone = addslashes($telephone);
$email = addslashes($email);

$phone = "select telephone from ".DB_PREFIX."user where telephone = '$telephone'";
$hear =mysql_query($phone);
$rows = mysql_num_rows($hear);

if($rows>0){
    //echo json_encode(array('result'=>-1, 'msg'=>'电话号码已经使用'));
    //exit();
}

//$sqltwo ="select telephone from ".DB_PREFIX."user where telephone = '$telephone'";
//$resulttwo = mysql_query($sqltwo);
//$rowstwo = mysql_num_rows($resulttwo);

//向user表里添加数据
//if($rowstwo>0){
//    $sqlone = "insert into ".DB_PREFIX."score(score,telephone) values($score,'$telephone') ";
//    $resultone = mysql_query($sqlone);
//}else{
    $sql = "insert into ".DB_PREFIX."user(username,employee_number,telephone,email) values('$name','$employee_number','$telephone','$email')";
    $result = mysql_query($sql);

////向score表里添加数据.
    $sqlone = "insert into ".DB_PREFIX."score(score,telephone) values($score,'$telephone')";
    $resultone = mysql_query($sqlone);

//}

if($resultone){

    echo json_encode(array('result'=>1,'msg'=>'数据保存成功.'));
    exit;

}else{
    echo json_encode(array('result'=>-1,'msg'=>'数据保存失败!'));
    exit;
}

