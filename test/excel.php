<?php
/**
 * Created by PhpStorm.
 * User: ��ǿ
 * Date: 2016/1/23
 * Time: 12:45
 */

header("content-type:text/html;charset=utf-8");
error_reporting(E_ALL);
date_default_timezone_set('Asia/Shanghai');
require_once './PHPExcel_1.8.0_doc/Classes/PHPExcel.php';
include_once './PHPExcel_1.8.0_doc/Classes/PHPExcel/Writer/Excel2007.php';
include_once './PHPExcel_1.8.0_doc/Classes/PHPExcel/IOFactory.php';

//$state = '2016-1-25';
//$end   = '2016-1-26';

$start = $_GET['start'];
$end   = $_GET['end'];

$a = new info();
$data = $a->information($start,$end);




$objPHPExcel=new PHPExcel();
$objPHPExcel->getProperties()
    ->setTitle('Office 2007 XLSX Document')
    ->setSubject('Office 2007 XLSX Document')
    ->setDescription('Document for Office 2007 XLSX, generated using PHP classes.')
    ->setKeywords('office 2007 openxml php')
    ->setCategory('Result file');
$objPHPExcel->setActiveSheetIndex(0)
    ->setCellValue('A1','ID')
    ->setCellValue('B1','用户名')
    ->setCellValue('C1','电话号码')
    ->setCellValue('D1','员工号')
    ->setCellValue('E1','电子邮件')
    ->setCellValue('F1','分数')
    ->setCellValue('G1','创建时间');


$i=2;
foreach($data as $k=>$v){
    $objPHPExcel->setActiveSheetIndex(0)
        ->setCellValue('A'.$i,$v['id'])
        ->setCellValue('B'.$i,$v['username'])
        ->setCellValue('C'.$i,$v['telphone'])
        ->setCellValue('D'.$i,$v['employee_number'])
        ->setCellValue('E'.$i,$v['email'])
        ->setCellValue('F'.$i,$v['score'])
        ->setCellValue('G'.$i,$v['ctime']);
    $i++;
}
$objPHPExcel->getActiveSheet()->setTitle('123');
$objPHPExcel->setActiveSheetIndex(0);
$filename=urlencode('123').'_'.date('Y-m-dHis');


////*����xlsx�ļ�
//header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//header('Content-Disposition: attachment;filename="'.$filename.'.xlsx"');
//header('Cache-Control: max-age=0');
//$a = $objWriter=PHPExcel_IOFactory::createWriter($objPHPExcel,'Excel2007');



//*����xls�ļ�
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="'.$filename.'.xls"');
header('Cache-Control: max-age=0');
$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');


$objWriter->save('php://output');
exit;


class info{
    function information($a,$b){
        include_once ('../api/config.php');

        $sql = "select a.id,a.username,a.telephone,a.employee_number,a.email,max(b.score)as score, b.ctime as ctime from ".DB_PREFIX."user a,".DB_PREFIX."score b where a.telephone = b.telephone and b.ctime>='$a' and b.ctime<'$b' group by a.telephone order by score desc, b.ctime limit 50";
        $result = mysql_query($sql);
        $rows = mysql_num_rows($sql);


        $infor = array();
        $arr = array();


        while($row = mysql_fetch_assoc($result)){
                $infor[]=$row;
        }
        $arr = $infor;

        return $arr;

    }
}