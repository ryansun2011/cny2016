<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/12/8
 * Time: 17:06
 */
//session_start();
include_once ('config.php');

$score = $_POST['score'];
$telephone = $_POST['telephone'];
//$score = 1213;
//$telephone = '158889';



$score = addslashes($score);
$telephone = addslashes($telephone);

$arrDate = array();
$sql = "select score from ".DB_PREFIX."score where telephone = {$telephone}";
$result = mysql_query($sql);
//var_dump($result);
$rows = mysql_num_rows($result);
while($row = mysql_fetch_assoc($result)){
    $a = $row['score'];

}
//var_dump($row);
//var_dump($rows );
$arrDate['score'] = (int)$a;

if($arrDate['score'] >= $score){
    echo json_encode(array('result'=>1,'msg'=>'数据比原始数据小,更新无效.'));
    exit;
}else{
    if($rows != null){
        $sqlone = "update ".DB_PREFIX."score set score = '$score' where telephone = '$telephone'";
    }else{
        $sqlone = "insert into ".DB_PREFIX."score(score,telephone) values('$score','$telephone') ";
    }
    //var_dump($sqlone);
    $resultone = mysql_query($sqlone);

    if($resultone){
        echo json_encode(array('result'=>1,'msg'=>'数据保存成功.'));
    }else{
        echo json_encode(array('result'=>-1,'msg'=>'数据保存成功!'));
    }
}



?>