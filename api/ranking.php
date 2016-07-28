<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/12/8
 * Time: 17:13
 */
//session_start();
include_once ('config.php');


//$sql = "select a.id,a.username,max(b.score) from ".DB_PREFIX."user a,".DB_PREFIX."score b where a.telephone = b.telephone and DateDiff(b.ctime,CURDATE())=0 order by b.score desc limit 7";
//select a.id,a.username,b.score from cny2016_user a,cny2016_score b where a.telephone = b.telephone and DateDiff(a.times,CURDATE())=0

$sql = "select a.id,a.username,max(b.score) as score  from ".DB_PREFIX."user a,".DB_PREFIX."score b where a.telephone = b.telephone and DateDiff(b.ctime,CURDATE())=0
group by a.telephone order by score desc limit 7";


$result = mysql_query($sql);

//var_dump($sql);
//var_dump($result);
//exit;

$rows = mysql_num_rows($result);
//var_dump($rows);exit;

$arrDate = array();
if($result){

    while($rows = mysql_fetch_assoc($result)){
        $arrData[]=$rows;
    }
//    if($arrDate==null){
//        $arrDate = '';
//    }
    echo json_encode(array(
        'result' => 1,
        'info' => $arrData,
        'msg' => '获取用户列表成功'
    ));exit;
}else{
    $arrData['result'] = -1;
    $arrDate['msg'] = '获取用户列表失败!';
    echo json_encode($arrDate);
    exit;
}





