<?php
header('Content-Type: text/html; charset=UTF-8');
header('P3P: CP=CAO PSA OUR');

// 调试模式开关
define('DEBUG_MODE', true);
define('DB_PREFIX','cny2016_');
/*
if ( !function_exists('curl_init') ) {
    echo '您的服务器不支持 PHP 的 Curl 模块，请安装或与服务器管理员联系。';
    exit;
}
*/

//define( "WB_APP_URL" , 'http://www.philips-campaign.com/cny2016/api/');
//define( "WB_BASE_URL" ,'http://www.philips-campaign.com/cny2016/api/');
//define("WB_STORAGE",'uploads');
//define("PHOTO_PATH", "http://philipscampaign-uploads.stor.sinaapp.com/xmas2015/mobile/api/");

if ( DEBUG_MODE ) {
    error_reporting(E_ALL);
    ini_set('display_errors', false);
}

$db_host = SAE_MYSQL_HOST_M;
$db_port = SAE_MYSQL_PORT;
$db_user = SAE_MYSQL_USER;
$db_pass = SAE_MYSQL_PASS;
$db_data = SAE_MYSQL_DB;


$db=mysql_connect($db_host.':'.$db_port,$db_user,$db_pass);
mysql_select_db($db_data);
mysql_set_charset('utf8',$db);
?>