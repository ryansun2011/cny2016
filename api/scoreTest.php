<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/6
 * Time: 10:01
 */
include_once('config.php');

$score    = $_POST['score'];
$telephone = $_POST['telephone'];

$score    = addslashes($score);
$telephone = addslashes($telephone);

$sql = "insert into ".DB_PREFIX."score(telephone,score)values('$telephone','$score')";

$result = mysql_query($sql);

if($result){
    echo json_encode(array('result'=>1,'msg'=>'数据保存成功.'));
    exit;
}else{
    echo json_encode(array('result'=>-1,'msg'=>'数据保存失败!'));
    exit;
}