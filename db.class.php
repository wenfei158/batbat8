<?php
/**
* 类名：DB
* 说明：数据库操作类
*/
class Database
{
    private $host;            //服务器
    private $username;        //数据库用户名
    private $password;        //数据密码
    private $dbname;          //数据库名
    private $conn;            //数据库连接变量

    /**
    * DB类构造函数，连接数据库
    */
    public function __construct(){
        $this->host = "127.0.0.1";
        $this->username = "wenfei158";
        $this->password = "19880517";
        $this->dbname = "sharing_information";
    }

    /**
    * 打开数据库连接
    */
    public function open(){
        @ $this->conn = new mysqli($this->host,$this->username,$this->password,$this->dbname);
        $this->conn->query("SET CHARACTER SET utf8");
    }

    /**
    * 关闭数据连接
    */
    public function close(){
        $this->conn->close();
    }

    /**
    * 通过sql语句获取数据
    * @return: json()
    */
    public function getJsonBySql($sql){
        $this->open();
        $result = array();  
        @ $rs = $this->conn->query($sql);
        $num_rs = $rs->num_rows; 
        $result["total"] = $num_rs; 
        $i = 0;
        while(@ $row = $rs->fetch_object()){
            $result["rows".$i] = $row;
            $i++;
        }
        $this->close();
        return json_encode($result);
    }

    /**
    * 获取某个表中数据的总量
    */
    public function getAmountByTable($tableName){
        $this->open();
        $sql = "SELECT COUNT(id) FROM ".$tableName;
        @ $rs = $this->conn->query($sql);
        @ $id = $rs->fetch_assoc();
        $this->close();
        if($id) return $id;
        else return NULL; 
    }

    /**
    * 通过表中的某一属性获取另一属性(ID或唯一约束的属性)
    */
    public function getDataByAtr($tableName,$key,$atrName,$atrValue){
        $this->open();
        $sql = "SELECT $key FROM ".$tableName." WHERE $atrName = '$atrValue'";
        @ $rs = $this->conn->query($sql);
        @ $id = $rs->fetch_assoc();
        $this->close();
        if($id) return $id;
        else return NULL; 
    }
    /**
    * 通过表中的某一属性获取其他所有属性(不具唯一性)
    */
    public function getAllByAtr($tableName,$atrName,$atrValue){
        $this->open();
        $sql = "SELECT * FROM ".$tableName." WHERE $atrName = '$atrValue'";
        @ $rs = $this->conn->query($sql);
        $result = array();
        while(@ $id = $rs->fetch_assoc()){
            array_push($result,$id);
        }
        $this->close();
        if(count($result) != 0) return $result;
        else return NULL;
    }

    /**
    * 向数据库表中插入数据
    * @param：$table,表名
    * @param：$columns,包含表中所有字段名的数组。默认空数组，则是全部有序字段名
    * @param：$values,包含对应所有字段的属性值的数组
    */
    public function insertData($table,$columns=array(),$values=array()){
        $this->open();
        $sql = 'insert into '.$table .'( ';
        for($i = 0; $i < sizeof($columns);$i++)
        {
            $sql .= $columns[$i];
            if($i < sizeof($columns) - 1)
            {
                $sql .= ',';
            }
        }
        $sql .= ') values ( ';
        for($i = 0; $i < sizeof($values);$i ++)
        {
            $sql .= "'".$values[$i]."'";
            if($i < sizeof($values) - 1)
            {
                $sql .= ',';
            }
        }
        $sql .= ' )';
        @ $result = $this->conn->query($sql);
        if ($result == true){
            $id = $this->conn->insert_id;
            $this->close();
            return $id;
        }else{
            $this->close();
            return false;                
        }
    }

    /**
    * 更新表中的属性值
    */
    public function updateParamByAtr($tableName,$key,$value,$atrName,$atrValue){
        $this->open();
        $sql = "UPDATE ".$tableName." SET $key = '$value' WHERE $atrName = '$atrValue' ";
        @ $result = $this->conn->query($sql);
        $this->close();        
        return $result;  
    }

    /**
    * 往表中的属性值追加信息
    */
    public function addParamByAtr($tableName,$key,$value,$atrName,$atrValue){
        $this->open();
        $sql = "UPDATE ".$tableName." SET $key = CONCAT($key,'$value') WHERE $atrName = '$atrValue' ";
        @ $result = $this->conn->query($sql);
        $this->close();        
        return $result;  
    }

    /**
    * 通过通过表中的某一属性删除记录
    */
    public function delete($tableName,$atrName,$atrValue){
        $this->open();
        $deleteResult = false;
        $sql = "DELETE FROM ".$tableName." WHERE $atrName = '$atrValue'";
        if(@ $this->conn->query($sql)) $deleteResult = true;
        $this->close();
        return $deleteResult;
    }

}

?>
