<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/12/8
 * Time: 16:39
 */
//session_start();
include_once ('config.php');

$username = $_POST['username'];
$employee_number = $_POST['employee_number'];
$telephone = (int)$_POST['telephone'];
$email = $_POST['email'];
$score = (int)$_POST['score'];
//
//$username = '小小';
//$employee_number = '123113';
//$telephone = '2';
//$email = '025485458@qq.com';

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

//$pattern = "/^\d{6,8}$/i";
//if(!preg_match($pattern,$employee_number)){
//    $hasError = true;
//    $strError .= '员工号必须是6-8位的数字。';
//}
$pattern = "/^\w+(\.\w+)?@[a-z0-9\-]+(\.[a-z]{2,6}){1,2}$/i";
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

$phone = "select telephone from ".DB_PREFIX."user where telephone = {$telephone}";
//var_dump($phone);
$hear =mysql_query($phone);
$result = mysql_num_rows($hear);

if($result>0){
    echo json_encode(array('result' =>-1, 'msg'=>'电话号码已经使用'));
    //echo '{"result":-2,"msg":"电话号码已经使用！"}';
    exit();
}


$sql = "insert into ".DB_PREFIX."user(username,employee_number,telephone,email) values('$name','$employee_number','$telephone','$email')";
//$sql = "update recipe1501_award set username='$username', mobile='$mobile', email='$email', ip='$ip' where id='$id'";
//var_dump($sql);
$result = mysql_query($sql);
//var_dump($result);exit;

if($score){
    $arrDate = array();
    $sql = "select score from ".DB_PREFIX."score where telephone = {$telephone}";
    $result = mysql_query($sql);
//var_dump($result);
    $rows = mysql_num_rows($result);
    while($row = mysql_fetch_assoc($result)){
        $a = $row['score'];
    }

    $arrDate['score'] = (int)$a;
    if($rows != null){
        if($arrDate['score'] < $score){
            $sqlone = "update ".DB_PREFIX."score set score = '$score' where telephone = '$telephone'";
            $resultone = mysql_query($sqlone);
        }
    }else{
        $sqlone = "insert into ".DB_PREFIX."score(score,telephone) values('$score','$telephone') ";
        $resultone = mysql_query($sqlone);
    }

}

if($result){
    //unset($_SESSION['id']);
    //unset($_SESSION['score']);
    //echo '{"result":1,"msg":"保存成功"}';
    echo json_encode(array('result'=>1,'msg'=>'数据保存成功!'));

}else{
    echo json_encode(array('result'=>-1,'msg'=>'数据保存成功!'));
}

?>
