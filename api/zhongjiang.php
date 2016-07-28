<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/25
 * Time: 14:03
 */

include_once ('config.php');
include_once ('db.php');


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

}else{
    $arrData['result'] = -1;
    $arrData['msg'] = '获取用户列表失败!';
    echo json_encode($arrData);
    exit;
}



//$id1 = $_POST['id1'];
//$id2 = $_POST['id2'];
//$id3 = $_POST['id3'];
//$id4 = $_POST['id4'];
//$id5 = $_POST['id5'];

$id1 = $arrData[0]['id'];
$id2 = $arrData[1]['id'];
$id3 = $arrData[2]['id'];
$id4 = $arrData[3]['id'];
$id5 = $arrData[4]['id'];
//$id6 = $arrData[5]['id'];
//$id7 = $arrData[6]['id'];



$sql = "update ".DB_PREFIX."user set status = '1' where id in($id1,$id2,$id3,$id4,$id5)";

$result = mysql_query($sql);


if($result){
    echo json_encode(array(
       'result'=>1,
        'msg'  =>'更新成功'
    ));
}else{
    echo json_encode(array(
        'result'=>-1,
        'msg'   =>'更新失败!'
    ));
}
