<?php
header("Content-Type:text/html; charset=utf8");
require_once("./db.class.php");
class User{
	private $id; //登陆ID
	private	$database;//创建数据库连接
	private $rs; //返回的信息

	public function __construct(){
		$this->database = new Database();
		$this->rs = array();
		if (!session_id()) session_start();
		if (isset($_SESSION['id'])){
			$this->id = $_SESSION['id'];			
		}else{
			$this->id = 0;			
		}
	}

	public function open($type,$name,$password){
		if($type == "login"){
			$id = $this->database->getDataByAtr('user','id','name',$name);
			if($id == null){
				$this->rs['error'] = 1;
				$this->rs['msg'] = '该用户名尚未注册，请先注册';
			}else{
				$pw = $this->database->getDataByAtr('user','password','id',$id['id']);					
				if($pw['password'] != $password){
					$this->rs['error'] = 2;
					$this->rs['msg'] = '输入的密码不正确';
				}else{
					$this->id = $id['id'];
					$this->rs['error'] = 0;
					$this->rs['msg'] = '';	
				}
			}	
		}else if($type == "register"){
			$columns = array('name','password');
			$values = array($name,$password);
			$id = $this->database->insertData('user',$columns,$values);
			if ($id == false){
				$this->rs['error'] = 1;
				$this->rs['msg'] = '该用户名已被注册';					
			}else{
				$this->id = $id;
				$this->rs['error'] = 0;
				$this->rs['msg'] = '';
			}			
		}			
        $_SESSION['id'] = $this->id; 	
		return json_encode($this->rs);
	}

	public function alterpw($oldpw,$newpw){
		$pw = $this->database->getDataByAtr('user','password','id',$this->id);	
		if($oldpw == $pw['password']){
			$rs = $this->database->updateParamByAtr('user','password',$newpw,'id',$this->id);
			if($rs){
				$this->rs['error'] = 0;
				$this->rs['msg'] = '更新成功';
			}else{
				$this->rs['error'] = 5;
				$this->rs['msg'] = '数据库操作失败';				
			}
		}else{
			$this->rs['error'] = 1;
			$this->rs['msg'] = '原始密码错误';			
		}
		return json_encode($this->rs);		
	}

	public function centerload(){
		$rs = $this->database->getAllByAtr('action','post_user',$this->id);
		if($rs != Null){
			$rss = array();
			$rss['pos'] = 'actionSubs';
			$rss['total'] = count($rs);
			$i = 0;
			foreach ($rs as $row) {
				$rss['row'.$i] = array('id'=>$row['id'],'name'=>$row['name']);
				$i++;
			}
			$this->rs['rows0'] = $rss;
		}
		$rs = $this->database->getAllByAtr('goods','post_user',$this->id);		
		if($rs != Null){
			$rss = array();
			$rss['pos'] = 'goodsSubs';
			$rss['total'] = count($rs);
			$i = 0;
			foreach ($rs as $row) {
				$rss['row'.$i] = array('id'=>$row['id'],'name'=>$row['name']);
				$i++;
			}
			$this->rs['rows1'] = $rss;
		}
		$rs = $this->database->getAllByAtr('topic','post_user',$this->id);
		if($rs != Null){
			$rss = array();
			$rss['pos'] = 'topicSubs';
			$rss['total'] = count($rs);
			$i = 0;
			foreach ($rs as $row) {
				$rss['row'.$i] = array('id'=>$row['id'],'name'=>$row['name']);
				$i++;
			}
			$this->rs['rows2'] = $rss;
		}
		$rs = $this->database->getAllByAtr('user','id',$this->id);
		$str = $rs[0]['actionCustom'];
		if(strlen($str) != 0){
			$items = explode(';;;',$str);
			$kinds = array();
			$names = array();
			foreach($items as $item){
				if(strlen($item)>0){
					$contents = explode(',,,',$item);
					array_push($kinds,$contents[0]);
					array_push($names,$contents[1]);
				}
			}
			$rss = array();
			$rss['pos'] = 'actionCuss';
			$rss['total'] = count($kinds);
			for($i=0;$i<count($kinds);$i++){
				$kind = $kinds[$i];
				$name = $names[$i];
				$rss['row'.$i] = array('kind'=>$kind,'name'=>$name);
			}
			$this->rs['rows3'] = $rss;
		}			
		$str = $rs[0]['goodsCustom'];
		if(strlen($str) != 0){
			$items = explode(';;;',$str);
			$kinds = array();
			$names = array();
			foreach($items as $item){
				if(strlen($item)>0){
					$contents = explode(',,,',$item);
					array_push($kinds,$contents[0]);
					array_push($names,$contents[1]);
				}
			}
			$rss = array();
			$rss['pos'] = 'goodsCuss';
			$rss['total'] = count($kinds);
			for($i=0;$i<count($kinds);$i++){
				$kind = $kinds[$i];
				$name = $names[$i];
				$rss['row'.$i] = array('kind'=>$kind,'name'=>$name);
			}
			$this->rs['rows4'] = $rss;
		}
		$str = $rs[0]['topicCustom'];
		if(strlen($str) != 0){
			$items = explode(';;;',$str);
			$names = array();
			foreach($items as $item){
				if(strlen($item)>0){
					array_push($names,$item);
				}
			}
			$rss = array();
			$rss['pos'] = 'topicCuss';
			$rss['total'] = count($names);
			for($i=0;$i<count($names);$i++){
				$name = $names[$i];
				$rss['row'.$i] = array('name'=>$name);
			}
			$this->rs['rows5'] = $rss;
		}
		return json_encode($this->rs);
	}

	public function dragdelete($content){
		$rss = json_decode($content);
		if($rss->type == 'action' || $rss->type == 'goods'|| $rss->type == 'topic'){
			$rs = $this->database->delete($rss->type,'id',$rss->id);
		}
		if($rss->type == 'actionCustom' || $rss->type == 'goodsCustom'){
			$rs = $this->database->getDataByAtr('user',$rss->type,'id',$this->id);
			$str = $rs[$rss->type]; 
			$str = str_replace($rss->kind.',,,'.$rss->name.';;;', '', $str);		
			$rs = $this->database->updateParamByAtr('user',$rss->type,$str,'id',$this->id);
		}
		if($rss->type == 'topicCustom'){
			$rs = $this->database->getDataByAtr('user',$rss->type,'id',$this->id);
			$str = $rs[$rss->type]; 
			$str = str_replace($rss->name.';;;', '', $str);
			$rs = $this->database->updateParamByAtr('user',$rss->type,$str,'id',$this->id);			
		}
		if($rs){
			$this->rs['error'] = 0;
			$this->rs['msg'] = '删除成功';			
		}else{
			$this->rs['error'] = 5;
			$this->rs['msg'] = '数据库操作失败';			
		}
		return json_encode($this->rs);
	}

	public function colormade($field,$kind){	
		$rs = $this->database->updateParamByAtr('user',$field,$kind,'id',$this->id);
		if($rs){
			$this->rs['error'] = 0;
			$this->rs['msg'] = '更新成功';
		}else{
			$this->rs['error'] = 5;
			$this->rs['msg'] = '数据库操作失败';				
		}
		return json_encode($this->rs);	
	}

	public function topicmade($field,$topic){	
		$rs = $this->database->updateParamByAtr('user',$field,$topic,'id',$this->id);
		if($rs){
			$this->rs['error'] = 0;
			$this->rs['msg'] = '更新成功';
		}else{
			$this->rs['error'] = 5;
			$this->rs['msg'] = '数据库操作失败';				
		}
		return json_encode($this->rs);	
	}

	public function deleteget($field){
		$rs = $this->database->updateParamByAtr('user',$field,00000,'id',$this->id);
		if($rs){
			$this->rs['error'] = 0;
			$this->rs['msg'] = '更新成功';
		}else{
			$this->rs['error'] = 5;
			$this->rs['msg'] = '数据库操作失败';				
		}
	}

	public function indexget($index){
		if ($index == 1){
			$rs = $this->database->getDataByAtr('user','actionOrange,actionGreen,actionBlue','id',$this->id);			
			if($rs != Null){
				$this->rs['error'] = 0;
				$this->rs['actionOrange'] = $rs['actionOrange'];
				$this->rs['actionGreen'] = $rs['actionGreen'];
				$this->rs['actionBlue'] = $rs['actionBlue'];				
			}else{
				$this->rs['error'] = 5;
				$this->rs['msg'] = '数据库操作失败';				
			}
		}else if($index == 2){
			$rs = $this->database->getDataByAtr('user','goodsRed,goodsGreen,goodsBlue','id',$this->id);			
			if($rs != Null){
				$this->rs['error'] = 0;
				$this->rs['goodsRed'] = $rs['goodsRed'];
				$this->rs['goodsGreen'] = $rs['goodsGreen'];
				$this->rs['goodsBlue'] = $rs['goodsBlue'];
			}else{
				$this->rs['error'] = 5;
				$this->rs['msg'] = '数据库操作失败';				
			}
		}else if($index == 3){
			$rs = $this->database->getDataByAtr('user','topic0,topic1,topic2,topic3,topic4','id',$this->id);
			if($rs != Null){
				$this->rs['error'] = 0;
				$i = 0;
				$this->rs['hasDelete'] = 0;
				foreach($rs as $key=>$value){
					if($value != 0){
						$suc = $this->database->getAllByAtr('topic','id',$value);
						if($suc){
							$suc = $suc[0];
							if(($suc['limitTime'] == 0)||($suc['limitTime'] > time() - $suc['creatTime'])){
								$rss['id'] = $value;
								$rss['name'] = $suc['name'];
								$this->rs["rows".$i] = $rss;
								$i++;
							}else{
								$succ = $this->database->delete('topic','id',$suc['id']);
								if($succ == false){$this->rs['msg1'] = '数据库删除失败';}
								$filename  = dirname(__FILE__).'/topics/'.$suc['id'].'.xml';
								$succ = @ unlink ($filename);
								if($succ == false){$this->rs['msg2'] = '文件删除失败';}
								$this->rs['hasDelete']++;
								$rs1 = $this->database->updateParamByAtr('user',$key,00000,'id',$this->id);
							}
						}else{
							$this->rs['hasDelete']++;
							$rs1 = $this->database->updateParamByAtr('user',$key,00000,'id',$this->id);
						}
					}
				}
				$this->rs['total'] = $i;
			}else{
				$this->rs['error'] = 5;
				$this->rs['msg'] = '数据库操作失败';				
			}
		}
		return json_encode($this->rs);
	}

	public function indexcustom($indexPage){
		if($indexPage == 1){
			$rs = $this->database->getDataByAtr('user','actionCustom','id',$this->id);
			$str = $rs['actionCustom'];
			if(strlen($str) != 0){
				$items = explode(';;;',$str);
				$kinds = array();
				$names = array();
				foreach($items as $item){
					if(strlen($item)>0){
						$contents = explode(',,,',$item);
						array_push($kinds,$contents[0]);
						array_push($names,$contents[1]);
					}
				}
				$k = 0;
				for($i=0;$i<count($kinds);$i++){
					$kind = $kinds[$i];
					$name = $names[$i];
					$sql = "SELECT id,name,kind FROM action WHERE kind ="."'$kind'"." and name ="."'$name'";
					$rs = $this->database->getJsonBySql($sql);
					$rss = json_decode($rs,true);
					for($j=0;$j<$rss['total'];$j++){
						$this->rs["rows".$k] = $rss["rows".$j];
						$k++;
					}
					if($rss['total'] != 0){
						$str = str_replace($kind.',,,'.$name.';;;', '', $str);
					}
				}
				$this->rs["total"] = $k;
				if($k != 0){
					$rs = $this->database->updateParamByAtr('user','actionCustom',$str,'id',$this->id);
				}
			}
		}else if($indexPage == 2){
			$rs = $this->database->getDataByAtr('user','goodsCustom','id',$this->id);
			$str = $rs['goodsCustom'];
			if(strlen($str) != 0){
				$items = explode(';;;',$str);
				$kinds = array();
				$names = array();
				foreach($items as $item){
					if(strlen($item)>0){
						$contents = explode(',,,',$item);
						array_push($kinds,$contents[0]);
						array_push($names,$contents[1]);
					}
				}
				$k = 0;
				for($i=0;$i<count($kinds);$i++){
					$kind = $kinds[$i];
					$name = $names[$i];
					$sql = "SELECT * FROM goods WHERE kind ="."'$kind'"." and name ="."'$name'";
					$rs = $this->database->getJsonBySql($sql);
					$rss = json_decode($rs,true);
					for($j=0;$j<$rss['total'];$j++){
						$this->rs["rows".$k] = $rss["rows".$j];
						$k++;
					}
					if($rss['total'] != 0){
						$str = str_replace($kind.',,,'.$name.';;;', '', $str);
					}
				}
				$this->rs["total"] = $k;
				if($k != 0){
					$rs = $this->database->updateParamByAtr('user','goodsCustom',$str,'id',$this->id);
				}
			}
		}else if($indexPage == 3){
			$rs = $this->database->getDataByAtr('user','topicCustom','id',$this->id);
			$str = $rs['topicCustom'];
			if(strlen($str) != 0){
				$items = explode(';;;',$str);
				$names = array();
				foreach($items as $item){
					if(strlen($item)>0){
						array_push($names,$item);
					}
				}
				$k = 0;
				for($i=0;$i<count($names);$i++){
					$rs = $this->database->getAllByAtr('topic','name',$names[$i]);
					if($rs){
						foreach ($rs as $row) {
							if(($row['limitTime'] == 0)||($row['limitTime'] > time() - $row['creatTime'])){
								$this->rs["rows".$k]['id'] = $row['id'];
								$this->rs["rows".$k]['name'] = $row['name'];
								switch ($row['limitTime']){
									case 86400:	 
										$this->rs["rows".$k]['limitTime'] = '1天';
										break;
									case 604800:
										$this->rs["rows".$k]['limitTime'] = '1周';
										break;
									case 2592000:
										$this->rs["rows".$k]['limitTime'] = '1月';
										break;
									default:  
										$this->rs["rows".$k]['limitTime'] = '永久';
										break;									
								}			
								$username = $this->database->getDataByAtr('user','name','id',$row['post_user']);
								$this->rs["rows".$k]['username'] = $username['name'];
								$k++;
							}else{
								$suc = $this->database->delete('topic','id',$row['id']);
								if($suc == false){$this->rs['msg1'] = '数据库删除失败';}
								$filename  = dirname(__FILE__).'/topics/'.$row['id'].'.xml';
								$succ = @ unlink ($filename);
								if($succ == false){$this->rs['msg2'] = '文件删除失败';}
							}
						}
						$str = str_replace($names[$i].';;;', '', $str);
					}
				}
				$this->rs["total"] = $k;
				if($k != 0){
					$rs = $this->database->updateParamByAtr('user','topicCustom',$str,'id',$this->id);
				}
			}
		}
		return json_encode($this->rs);
	}

	public function actionsubmit($columns,$values){
		array_push($columns,'post_user');
		array_push($values,$this->id);
		$rs = $this->database->insertData('action',$columns,$values);
		if ($rs != false){
			$this->rs['error'] = 0;
			$this->rs['msg'] = '数据插入成功';	
		}else{
			$this->rs['error'] = 5;
			$this->rs['msg'] = '数据库操作失败';			
		}
		return json_encode($this->rs);	
	}

	public function actionquery($kind,$name){
		$sql = "SELECT id,name,kind FROM action WHERE kind ="."'$kind'"." and name ="."'$name'";
		$rs = $this->database->getJsonBySql($sql);		
		return $rs;
	}

	public function actioncustom($type,$kind,$name){
		$str = $kind.",,,".$name;
		$rs = $this->database->getDataByAtr('user','actionCustom','id',$this->id);
		$repeat = false;
		if(strlen($rs['actionCustom']) != 0){
			$items = explode(';;;',$rs['actionCustom']);
			foreach($items as $item){
				if($item == $str){
					$repeat = true;				
				}
			}
		}		
		if($repeat){
			$this->rs['error'] = 1;
			$this->rs['msg'] = '您已经定制过了';		
		}else{		
			$rs = $this->database->addParamByAtr('user',$type,$str.";;;",'id',$this->id);
			if($rs){
				$this->rs['error'] = 0;
				$this->rs['msg'] = '定制成功';
			}else{
				$this->rs['error'] = 5;
				$this->rs['msg'] = '数据库操作失败';
			}
		}
		return json_encode($this->rs);
	}

	public function actionget($initialPos,$onceAmount){
		$totalArray = $this->database->getAmountByTable('action');
		$total = $totalArray['COUNT(id)'];
		if (($initialPos + $onceAmount) < $total){		
			$sql = "SELECT id,name,kind FROM action ORDER BY id DESC LIMIT $initialPos,$onceAmount";
			$rs = $this->database->getJsonBySql($sql);
			$rs = json_decode($rs,true);
			$rs['initialPos'] = $initialPos + $onceAmount;
		}else{
			$number = $total - $initialPos;
			$sql = "SELECT id,name,kind FROM action ORDER BY id DESC LIMIT $initialPos,$number";
			$rs = $this->database->getJsonBySql($sql);
			$rs = json_decode($rs,true);
			$rs['initialPos'] = 0;
		}
		return json_encode($rs);
	}

	public function actiondetails($id){
		$rs = $this->database->getAllByAtr('action','id',$id);		
		if($rs != Null){
			$this->rs = json_encode($rs);
		}else{
			$this->rs['error'] = 1;
			$this->rs['msg'] = '十分抱歉，该数据刚刚已被发布者删除';			
		}
		return $this->rs;
	}

	public function goodssubmit($columns,$values){
		array_push($columns,'post_user');
		array_push($values,$this->id);
		$this->rs['error'] = 0;
		$rs = $this->database->insertData('goods',$columns,$values);
		if ($rs != false){	
			if ($_FILES['goodsimage']['error'] > 0){
				switch ($_FILES['goodsimage']['error']){
					case 1:	 
						$this->rs['error'] = 1;
						$this->rs['msg'] = '上传的文件超过了 php.ini 中 upload_max_filesize 选项限制的值';
						break;
					case 2:			
						$this->rs['error'] = 1;
						$this->rs['msg'] = '上传文件的大小超过了 HTML 表单中 MAX_FILE_SIZE 选项指定的值';
						break;
					case 3:			
						$this->rs['error'] = 1;
						$this->rs['msg'] = '文件只有部分被上传';
						break;
					case 4:			
						$this->rs['error'] = 1;
						$this->rs['msg'] = '没有文件被上传';
						break;
					case 6:   			
						$this->rs['error'] = 1;
						$this->rs['msg'] = '找不到临时文件夹';
						break;
					case 7:	
						$this->rs['error'] = 1;
						$this->rs['msg'] =  '文件写入失败';
						break;
					default:  
						$this->rs['error'] = 1;
						$this->rs['msg'] = '未知的上传错误';
						break;
				}
			}
			if($_FILES['goodsimage']['size'] > 204800){
				$this->rs['error'] = 1;
				$this->rs['msg'] = '图片大于200kb，请先压缩再上传';
			}
			$typelist=array("image/jpeg","image/pjpeg");
			if (!in_array($_FILES['goodsimage']['type'],$typelist)){
				$this->rs['error'] = 1;
				$this->rs['msg'] = '上传的文件类型不是.jpg图片格式';
			}
	        $exten_name=pathinfo($_FILES['goodsimage']['name'],PATHINFO_EXTENSION); 
			$upfile = './goods/'.$rs.'.'.$exten_name;
			if ($this->rs['error'] != 1) {
				if (is_uploaded_file($_FILES['goodsimage']['tmp_name'])){
					if (!move_uploaded_file($_FILES['goodsimage']['tmp_name'], $upfile)){
						$this->rs['error'] = 1;
						$this->rs['msg'] = '上传文件移动失败';
					}else {
						$this->rs['error'] = 0;
						$this->rs['msg'] =	$this->id.'.'.$exten_name.'上传成功';
					}
				}else{
					$this->rs['error'] = 1;
					$this->rs['msg'] = '文件不是上传的文件'; 
				}
			}
			if ($this->rs['error'] == 1) {
				$rss = $this->database->delete('goods','id',$rs);
			}
		}else{
			$this->rs['error'] = 5;
			$this->rs['msg'] = '数据库操作失败';			
		}
 		return json_encode($this->rs);	
	}

	public function goodsquery($kind,$name){
		$sql = "SELECT * FROM goods WHERE kind ="."'$kind'"." and name ="."'$name'";
		$rs = $this->database->getJsonBySql($sql);
		return $rs;
	}

	public function goodscustom($type,$kind,$name){
		$str = $kind.",,,".$name;
		$rs = $this->database->getDataByAtr('user','goodsCustom','id',$this->id);
		$repeat = false;
		if(strlen($rs['goodsCustom']) != 0){
			$items = explode(';;;',$rs['goodsCustom']);
			foreach($items as $item){
				if($item == $str){
					$repeat = true;				
				}
			}
		}		
		if($repeat){
			$this->rs['error'] = 1;
			$this->rs['msg'] = '您已经定制过了';		
		}else{
			$rs = $this->database->addParamByAtr('user',$type,$str.';;;','id',$this->id);
			if($rs){
				$this->rs['error'] = 0;
				$this->rs['msg'] = '定制成功';
			}else{
				$this->rs['error'] = 5;
				$this->rs['msg'] = '数据库操作失败';
			}
		}
		return json_encode($this->rs);
	}
	public function goodsget($initialPos,$onceAmount){
		$totalArray = $this->database->getAmountByTable('goods');
		$total = $totalArray['COUNT(id)'];
		if($initialPos < $total){
			if (($initialPos + $onceAmount) < $total){		
				$sql = "SELECT * FROM goods ORDER BY id DESC LIMIT $initialPos,$onceAmount";
				$rs = $this->database->getJsonBySql($sql);
				$rs = json_decode($rs,true);
				$rs['initialPos'] = $initialPos + $onceAmount;
			}else{
				$number = $total - $initialPos;
				$sql = "SELECT * FROM goods ORDER BY id DESC LIMIT $initialPos,$number";
				$rs = $this->database->getJsonBySql($sql);
				$rs = json_decode($rs,true);
				$rs['initialPos'] = 0;
			}
		}else{
			$rs = array();
			$rs['error'] = 1;
			$rs['msg'] = '物品已经加载光了';
		}
		return json_encode($rs);
	}

	public function topicsubmit($columns,$values,$name){
		$sql = "SELECT id FROM topic WHERE name = '$name' AND post_user = '$this->id'";
		$rss = json_decode($this->database->getJsonBySql($sql));
		if($rss->total != 0){
			$this->rs['error'] = 1;
			$this->rs['msg'] = '您已经发布过该话题，请勿重复发布';				
		}else{
			array_push($columns,'creatTime');
			array_push($values,time());
			array_push($columns,'post_user');
			array_push($values,$this->id);
			$rs = $this->database->insertData('topic',$columns,$values);
			if ($rs != false){
				$filename  = dirname(__FILE__).'/topics/'.$rs.'.xml';
				if(!is_file($filename)){
					$orgin = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n";
					$orgin = $orgin."<response>\n";
					$orgin = $orgin."</response>";	
					file_put_contents($filename,$orgin);
				}			
				$this->rs['error'] = 0;
				$this->rs['id'] = $rs;
				$this->rs['name'] = $name;
				$this->rs['msg'] = '数据插入成功';	
			}else{
				$this->rs['error'] = 5;
				$this->rs['msg'] = '数据库操作失败';			
			}
		}
		return json_encode($this->rs);	
	}

	public function topicquery($name){
		$rs = $this->database->getAllByAtr('topic','name',$name);
		$i = 0;
		if($rs){
			foreach ($rs as $row) {
				if(($row['limitTime'] == 0)||($row['limitTime'] > time() - $row['creatTime'])){
					$this->rs["rows".$i]['id'] = $row['id'];
					$this->rs["rows".$i]['name'] = $row['name'];
					switch ($row['limitTime']){
						case 86400:	 
							$this->rs["rows".$i]['limitTime'] = '1天';
							break;
						case 604800:
							$this->rs["rows".$i]['limitTime'] = '1周';
							break;
						case 2592000:
							$this->rs["rows".$i]['limitTime'] = '1月';
							break;
						default:  
							$this->rs["rows".$i]['limitTime'] = '永久';
							break;									
					}			
					$username = $this->database->getDataByAtr('user','name','id',$row['post_user']);
					$this->rs["rows".$i]['username'] = $username['name'];
					$i++;
				}else{
					$suc = $this->database->delete('topic','id',$row['id']);
					if($suc == false){$this->rs['msg1'] = '数据库删除失败';}
					$filename  = dirname(__FILE__).'/topics/'.$row['id'].'.xml';
					$succ = @ unlink ($filename);
					if($succ == false){$this->rs['msg2'] = '文件删除失败';}
				}
			}
		}
		$this->rs["total"] = $i;
		return json_encode($this->rs);
	}

	public function topiccustom($type,$name){
		$rs = $this->database->getDataByAtr('user','topicCustom','id',$this->id);
		$repeat = false;
		if(strlen($rs['topicCustom']) != 0){
			$items = explode(';;;',$rs['topicCustom']);
			foreach($items as $item){
				if($item == $name){
					$repeat = true;				
				}
			}
		}		
		if($repeat){
			$this->rs['error'] = 1;
			$this->rs['msg'] = '您已经定制过了';		
		}else{
			$rs = $this->database->addParamByAtr('user',$type,$name.';;;','id',$this->id);
			if($rs){
				$this->rs['error'] = 0;
				$this->rs['msg'] = '定制成功';
			}else{
				$this->rs['error'] = 5;
				$this->rs['msg'] = '数据库操作失败';
			}
		}
		return json_encode($this->rs);
	}	

}
