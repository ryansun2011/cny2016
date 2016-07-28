<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/25
 * Time: 14:03
 */

include_once ('../api/config.php');
include_once ('../api/db.php');

$state = $_POST['start'];
$end   = $_POST['end'];


//$state = '2016-1-28';
//$end   = '2016-1-29';

$sql = "select a.id,a.username,a.telephone,a.employee_number,a.email,max(b.score)as score, b.ctime as ctime from ".DB_PREFIX."user a,".DB_PREFIX."score b where
 a.telephone = b.telephone and b.ctime>='$state' and b.ctime<'$end' group by a.telephone order by score desc, b.ctime limit 50";

//echo $sql;


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
    echo json_encode(array(
        'result'=>1,
        'info'=>$arrData,
        'msg'=>'获取用户信息成功'
    ));

}else{
    $arrData['result'] = -1;
    $arrData['msg'] = '获取用户列表失败!';
    echo json_encode($arrData);
    exit;
}



