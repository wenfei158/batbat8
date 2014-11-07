<?php
//调用此页面，如果下面的式子成立，则生成验证码图片
if($_GET['action']=='verifycode'){
    rand_create();
}
//验证码图片生成
function rand_create(){
    //通知浏览器将要输出png图片
    header('content-type: image/png');
    //准备好随机数发生器种子 
    srand((double)microtime()*1000000);
    //准备图片的相关参数 
    $im = imagecreate(62,20);
    $black = imagecolorallocate($im, 0,0,0); //rgb黑色标识符
    $white = imagecolorallocate($im, 255,255,255); //rgb白色标识符
    $gray = imagecolorallocate($im, 200,200,200); //rgb灰色标识符
    //开始作图    
    imagefill($im,0,0,$gray);
    while(($randval=rand()%100000)<10000);{ 
        //将四位整数验证码绘入图片
        if (!session_id()) session_start();
        $_SESSION['check_num'] = $randval; 
        imagestring($im, 5, 10, 3, $randval, $black);
    } 
    //加入干扰象素 
    for($i=0;$i<200;$i++){
        $randcolor = imagecolorallocate($im,rand(0,255),rand(0,255),rand(0,255));
        imagesetpixel($im, rand()%70 , rand()%30 , $randcolor);
    }
    //输出验证图片
    imagepng($im);
    //销毁图像标识符
    imagedestroy($im); 
}
?>
