<?php
//设置请求运行时间不限制，解决因为超过服务器运行时间而结束请求
header("Content-Type:text/html; charset=utf8");
ini_set("max_execution_time", "3600");

//生成文件名
if(isset($_POST['topicId'])){
	$filename  = dirname(__FILE__).'/topics/'.preg_replace('/^0+/','',$_POST['topicId']).'.xml';
}

//检测文件是否存在
if(!is_file($filename)){
	$response = array();
	$response['error'] = 1;
	$response['message'] = "该话题已经到期或被发布者删除";
	print_r(json_encode($response));
	exit;
}

//接到含信息的post请求，写入文件
if(isset($_POST['message'])){
	foreach($_POST as $key => $value){
		$$key = $value;
	}
	$xml = simplexml_load_file($filename);
	$msg=$xml->addChild('message');  	
	$msg->addAttribute('time',microtime(true));  
	$msg->addChild('username',$name);  
	$msg->addChild('content',$message); 
	$xml->asXML($filename); 
    exit;
}

//终止comet长轮询
if(isset($_POST['over'])){
	$xml = simplexml_load_file($filename);
	$msg=$xml->addChild('over');  	
	$msg->addAttribute('time',microtime(true));  
	$msg->addChild('username',$_POST['name']);  
	$xml->asXML($filename); 
	exit;
}

//延时等待以及读取更新的内容
$dom = new DomDocument();
if(isset($_POST['timestamp'])){
	$lastmodif = $_POST['timestamp'];
	clearstatcache();
	$currentmodif = filemtime($filename);	
	//没有需要更新的内容时休眠
	while ($currentmodif <= $lastmodif)
	{
	    sleep(1);     // 休眠1s释放cpu的占用
	    clearstatcache();  // 清除文件状态缓存
	    $currentmodif = filemtime($filename); 
	}
	//推送信息
	$i = 0;
	$response = array();
	@ $dom->load($filename);
	$msgs = $dom->getElementsByTagName("message");
	foreach($msgs as $row){
		$time = $row->attributes->item(0)->nodeValue;
		if($time > $lastmodif){
			$username =  $row->getElementsByTagName("username")->item(0)->nodeValue;
			$content = $row->getElementsByTagName("content")->item(0)->nodeValue;
			if($content != 'exit__delete__close'){
				@ $response["rows".$i] = array('username'=>$username,'content'=>$content);
				$i++;
			}
		}
	}
	$response['total'] = $i;
	$response['timestamp'] = isset($time) ? $time:$currentmodif;
	print_r(json_encode($response));
	flush();
}

?>
