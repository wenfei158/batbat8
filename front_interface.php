<?php
require_once("./user.class.php");	
foreach($_POST as $key => $value){
	$$key = $value;
}
foreach($_GET as $key => $value){
	$$key = $value;
}
$rs = ""; //发给客户端的信息

if ($type == "registerPost"){
	if (!session_id()) session_start();
	if($registercode == $_SESSION['check_num']){
		$user = new User();
		$rs = $user->open('register',$registername,$password1);
	}else{
		$rss = array();
		$rss['error'] = 2;
		$rss['msg'] = '验证码不正确';
		$rs = json_encode($rss);
	}
	print_r($rs);		
}else if($type == "loginPost"){
	$user = new User();
	$rs = $user->open('login',$loginname,$password);
	print_r($rs);
}else if($type == "alterPost"){
	if (!session_id()) session_start();
	if($altercode == $_SESSION['check_num']){
		$user = new User();
		$rs = $user->alterpw($oldPwd,$newPwd1);
	}else{
		$rss = array();
		$rss['error'] = 2;
		$rss['msg'] = '验证码不正确';
		$rs = json_encode($rss);
	}
	print_r($rs);		
}else if($type == "centerLoad"){
	$user = new User();
	$rs = $user->centerload();
	print_r($rs);
}else if($type == "dragDelete"){
	$user = new User();
	$rs = $user->dragdelete($content);		
	print_r($rs);
}else if($type == "colorGet"){
	$user = new User();
	$rs = $user->colormade($field,$kind);		
	print_r($rs);
}else if($type == "topicGet"){
	$user = new User();
	$rs = $user->topicmade($field,$topic);		
	print_r($rs);	
}else if($type == "deleteGet"){
	$user = new User();
	$rs = $user->deleteget($field);		
	print_r($rs);
}else if($type == "indexGet"){
	$user = new User();
	$rs = $user->indexget($index);		
	print_r($rs);
}else if($type == "indexCustom"){
	$user = new User();
	$rs = $user->indexcustom($indexPage);
	print_r($rs);
}else if($type == "actionSubmit"){
	$columns = array();
	$values = array();
	foreach($_POST as $key => $value){
		array_push($columns,substr($key,6)); 
		array_push($values,$value);
	}
	array_pop($columns);
	array_pop($values);
	$user = new User();
	$rs = $user->actionsubmit($columns,$values);		
	print_r($rs);
}else if($type == "actionQuery"){
	$user = new User();
	$rs = $user->actionquery($kind,$name);		
	print_r($rs);
}else if($type == "actionCustom"){
	$user = new User();
	$rs = $user->actioncustom($type,$kind,$name);		
	print_r($rs);
}else if($type == "actionGet"){
	$user = new User();
	$rs = $user->actionget($initialPos,$onceAmount);		
	print_r($rs);
}else if($type == "actionDetails"){
	$user = new User();
	$rs = $user->actiondetails($id);		
	print_r($rs);
}else if($type == "goodsSubmit"){
	$columns = array();
	$values = array();
	foreach($_POST as $key => $value){
		array_push($columns,substr($key,5)); 
		array_push($values,$value);
	}
	array_pop($columns);
	array_pop($values);
	$user = new User();
	$rs = $user->goodssubmit($columns,$values);		
	print_r($rs);
}else if($type == "goodsQuery"){
	$user = new User();
	$rs = $user->goodsquery($kind,$name);
	print_r($rs);
}else if($type == "goodsCustom"){
	$user = new User();
	$rs = $user->goodscustom($type,$kind,$name);
	print_r($rs);
}else if($type == "goodsGet"){
	$user = new User();
	$rs = $user->goodsget($initialPos,$onceAmount);
	print_r($rs);
}else if($type == "topicSubmit"){
	$columns = array();
	$values = array();
	foreach($_POST as $key => $value){
		array_push($columns,substr($key,5)); 
		array_push($values,$value);
	}
	array_pop($columns);
	array_pop($values);
	$user = new User();
	$rs = $user->topicsubmit($columns,$values,$topicName);
	print_r($rs);
}else if($type == "topicQuery"){
	$user = new User();
	$rs = $user->topicquery($name);		
	print_r($rs);
}else if($type == "topicCustom"){
	$user = new User();
	$rs = $user->topiccustom($type,$name);		
	print_r($rs);
}

?>
