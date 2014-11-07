var overallLayout={
    username:"",//登陆的用户名
    curIndex:0,//当前所处的页码
    canRoll:true,//是否可以进行翻转，保证切换的时间        
    up:true,//页头是否隐藏
    firstTime1:true,//第一页是否第一次加载
    firstTime2:true,//第二页是否第一次加载
    firstTime3:true,//第三页是否第一次加载
    initialPos1:0,//第一页数据库加载的位置
    onceAmount1:30,//第一页每次加载的默认个数
    initialPos2:0,//第二页数据库加载的位置
    onceAmount2:13,//第二页每次加载的默认个数
    timestamp:[0,0,0,0,0],//第三页聊天最后加载的时间
    comet:[false,false,false,false,false],//第三页是否处于comet状态

//翻页处理
    //翻到index页
    showPage:function(index){
        if ( this.curIndex === index ) 
            return; 
        if (this.canRoll === false) 
            return;
        this.canRoll = false;        
        $("#selector"+this.curIndex).removeClass("active").addClass("disappear");
        $("#selector"+index).css("display","block").removeClass("disappear").addClass("active");
        $("#l"+index).addClass("focus").siblings().removeClass("focus");
        $(".scroll"+index).css("display","block");    
        
        var self = this;
        setTimeout((function(i){
            return function(){
                $("#selector"+i).css("display","none");
                $(".scroll"+i).css("display","none");            
            };
        })(self.curIndex),1000);  

        setTimeout(function(){
            self.canRoll = true;
        },1000);

        setTimeout((function(i){
            return function(){
                $(".scroll"+i).css("display","none");
            };
        })(index),30000);      
        
        this.curIndex = index;
        if(index == 1){
            if(this.firstTime1){
                this.tagGet();
                this.firstTime1 = false;
            }        
        }
        if(index == 2) {
            if(this.firstTime2){
                this.goodsGet();
                this.firstTime2 = false;
            }
        }
        if(index == 3){
            if(this.firstTime3){
                cardRotate.deploy("content3");
                this.firstTime3 = false;
            }
        }
        if(this.username.length != 0){
            $.get("front_interface.php",{type:"indexCustom",indexPage:index},function(data,textStatus){
                if(data.total > 0){
                    if(index == 1){
                        $("#content1 a").each(function(){
                            $(this).unbind();
                        });
                        if(tagCloud.timer != null){tagCloud.switchRotate(false);}
                        $("#content1").empty().unbind();
                        for(var i=0; i<data.total;i++){ 
                            var str = '<a href="javascript:;" data-for='+data['rows'+i].id+" data-kind="+data['rows'+i].kind+">"+data['rows'+i].name+"</a>";
                            $("#content1").append($(str));
                        }
                        tagCloud.deploy("content1",200,5);
                        $("#content1 a").each(function(){
                            var elem = $("#selector1 .action_details");
                            $(this).click(function(event){
                                if(elem.attr('data-for') != $(this).attr('data-for')){
                                    $.get("front_interface.php",{type:"actionDetails",id:$(this).attr('data-for')},function(data,textStatus){
                                        elem.empty();
                                        if(tagCloud.timer != null){tagCloud.switchRotate(false);}
                                        if(data[0].msg == undefined){
                                            var htmlcode = "<strong>活动名称：</strong>: "+data[0].name+"<br />";
                                            htmlcode = htmlcode + "<strong>活动时间：</strong>: "+data[0].time+"<br />";
                                            htmlcode = htmlcode + "<strong>活动地点：</strong>: "+data[0].site+"<br />";
                                            htmlcode = htmlcode + "<strong>活动人数：</strong>: "+data[0].pnum+"<br />";
                                            htmlcode = htmlcode + "<strong>联系方式：</strong>: "+data[0].connectway+"<br />";
                                            htmlcode = htmlcode + "<strong>联系详情：</strong>: "+data[0].connectdetails+"<br />";                        
                                        }else{
                                            var htmlcode = "<strong>"+data[0].msg+"</strong>";
                                        }
                                        elem.append(htmlcode);
                                        elem.css({"left":(event.clientX+30),"top":(event.clientY+30)}).show();
                                        elem.attr('data-for',data[0].id)
                                    },'json');
                                }else{
                                    elem.empty().hide();
                                    elem.attr('data-for',"");
                                    tagCloud.switchRotate(true);
                                }
                            });
                        });
                        self.index1made();
                        alert("您定制的活动已有人发布，已为您加载");
                    }
                    if(index == 2){
                        var elem = $("#content2");
                        $("#content2 a .box").each(function(){
                            $(this).unbind();
                        });    
                        elem.empty().unbind("scoll");
                        $(window).unbind("resize");
                        var idArray =[],nameArray =[],kindArray =[],priceArray =[],degreeArray =[],connectwayArray =[],connectdetailsArray =[];
                        for(var i=0; i<data.total;i++){ 
                            idArray.push(data['rows'+i].id.replace(/^0+/,''));
                            nameArray.push(data['rows'+i].name);
                            kindArray.push(data['rows'+i].kind);
                            priceArray.push(data['rows'+i].price);
                            degreeArray.push(data['rows'+i].degree);
                            connectwayArray.push(data['rows'+i].connectway);
                            connectdetailsArray.push(data['rows'+i].connectdetails);
                        }
                        waterFall.deploy("content2",data.total,false,idArray,nameArray,kindArray,priceArray,degreeArray,connectwayArray,connectdetailsArray);
                        self.index2made(); 
                        alert("您定制的物品已有人发布，已为您加载");
                    }
                    if(index == 3){
                        $("#aside3 #resultShow #result a").each(function(){
                            $(this).unbind();
                        });
                        $("#aside3 #resultShow #result").empty();
                        for(var i=0;i<data.total;i++){
                            var row = "rows"+i;
                            var str = '<a href="javascript:;" data-for='+data[row].id+" data-name="+data[row].name+">"+data[row].name+"_"+data[row].username+"</a>";
                            $("#aside3 #resultShow #result").append($(str));
                        }
                        $("#aside3 #resultShow #result a").each(function(){
                            $(this).click(function(){
                                var suc = self.addTopic($(this).attr('data-for'),$(this).attr('data-name'));
                                if(typeof(suc) == "number"){
                                    alert("该话题已成功为您添加至第"+suc+"话题框");
                                }else{
                                    alert(suc);
                                }
                            });
                        });
                        alert("您定制的话题已有人发布，您可以在“查询与定制结果”中查看");
                    }
                }
            },'json');                
        }
    },
    //显示上一页||下一页
    jumpPage:function(up) {
        var $actived = $(".active");
        var activeIndex = parseInt($actived.attr('id').substr(-1));        
        this.showPage(activeIndex + (up?-1:1));
    },
    //屏幕上的向上、向下按钮翻页
    upBtnDown:function (){
        var $actived = $(".active");
        var activeIndex = parseInt($actived.attr('id').substr(-1));
        var numOfChildren = $(".pagesToolbar ul").children().length;
        if (activeIndex<numOfChildren + 1 && this.canRoll){
            this.jumpPage(true);
        }
    },
    downBtnDown:function(){
        var $actived = $(".active");
        var activeIndex = parseInt($actived.attr('id').substr(-1));
        var numOfChildren = $(".pagesToolbar ul").children().length;
        if (activeIndex<numOfChildren && this.canRoll){
            this.jumpPage(false);
        }
    },
//注册时的即时提醒
    nameCheck:function() {
        var self = this;
        setTimeout(function() {
            if ($.testRemind.display == false && $.html5Validate.isAllpass($(self)) == false) {
                $(self).testRemind("请输入由5-20个数字/字母组成的用户名");    
            }    
        }, 100);
    },
    pwdCheck:function() {
        var self = this;
        setTimeout(function() {
            if ($.testRemind.display == false && $.html5Validate.isAllpass($(self)) == false) {
                $(self).testRemind("密码长度不小于6位不大于20位");    
            }    
        }, 100);
    },

//控制栏的处理事件
    showType: function(_this){
        if(this.username.length == 0){
            alert("请先登录，才能进行个性化定制");
        }else{
            $(_this).children(".option").toggleClass("hidden").toggleClass("visible");
        }
    },
    selectType:function(e){
        var target = e.target;
        var typeName = $(target).html();
        var order = $(target).data("value");
        $(target).parent().parent().children("span").text(typeName);
        var btn = $(target).parent().parent().attr("id");
        if(btn.match(/^action/)){
            var elems = document.querySelectorAll("#content1 a");
            var color = btn.slice(6).toLowerCase();
            var reg0 = new RegExp('(\\s|^)' + color + '(\\s|$)');
            switch(color){
                case 'orange':
                    var reg1 = new RegExp('(\\s|^)green(\\s|$)');
                    var reg2 = new RegExp('(\\s|^)blue(\\s|$)');
                    break;
                case 'green':
                    var reg1 = new RegExp('(\\s|^)orange(\\s|$)');
                    var reg2 = new RegExp('(\\s|^)blue(\\s|$)');
                    break;
                case 'blue':
                    var reg1 = new RegExp('(\\s|^)orange(\\s|$)');
                    var reg2 = new RegExp('(\\s|^)green(\\s|$)');
                    break;                               
            }
        }else{
            var elems = document.querySelectorAll("#content2 a");
            var color = btn.slice(5).toLowerCase();            
            var reg0 = new RegExp('(\\s|^)' + color + '(\\s|$)');
            switch(color){
                case 'red':
                    var reg1 = new RegExp('(\\s|^)green(\\s|$)');
                    var reg2 = new RegExp('(\\s|^)blue(\\s|$)');
                    break;
                case 'green':
                    var reg1 = new RegExp('(\\s|^)red(\\s|$)');
                    var reg2 = new RegExp('(\\s|^)blue(\\s|$)');
                    break;
                case 'blue':
                    var reg1 = new RegExp('(\\s|^)red(\\s|$)');
                    var reg2 = new RegExp('(\\s|^)green(\\s|$)');
                    break;                               
            }
        }
        $.get("front_interface.php",{type:"colorGet",field:btn,kind:order},function(data,textStatus){
            if (data.error == 0){
                for(var i=0;i<elems.length;i++){
                    var elem = elems.item(i);
                    if(elem.getAttribute('data-kind') == order){
                        if (elem.className.match(reg1)){
                            elem.className = elem.className.replace(reg1,'');
                        }
                        if (elem.className.match(reg2)){
                            elem.className = elem.className.replace(reg2,'');
                        }
                        if (!elem.className.match(reg0)){
                            elem.className += " " + color;
                        }
                    }else{
                        if (elem.className.match(reg0)){
                            elem.className = elem.className.replace(reg0,'');
                        }                       
                    }
                }
            }else{
                alert("十分抱歉，服务器出错，请稍后再试！");
            }
        },'json'); 
    },
    //获取颜色定制的属性并进行配置(以及话题)
    index1made:function(){
        if(this.username.length != 0){
            $.get("front_interface.php",{type:"indexGet",index:1},function(data,textStatus){
                $("#actionOrange span").html($("#actionOrange ul.option").find("li[data-value="+data.actionOrange+"]").html());
                $("#actionGreen span").html($("#actionGreen ul.option").find("li[data-value="+data.actionGreen+"]").html());
                $("#actionBlue span").html($("#actionBlue ul.option").find("li[data-value="+data.actionBlue+"]").html());
                var order,reg0,reg1,reg2,color;
                var elems = document.querySelectorAll("#content1 a");
                for(var j=0;j<3;j++){
                    switch(j){
                        case 0:
                            order = data.actionOrange;
                            color = 'orange';
                            reg0 = new RegExp('(\\s|^)orange(\\s|$)');
                            reg1 = new RegExp('(\\s|^)green(\\s|$)');
                            reg2 = new RegExp('(\\s|^)blue(\\s|$)');
                            break;
                        case 1:
                            order = data.actionGreen;
                            color = 'green';
                            reg0 = new RegExp('(\\s|^)green(\\s|$)');
                            reg1 = new RegExp('(\\s|^)orange(\\s|$)');
                            reg2 = new RegExp('(\\s|^)blue(\\s|$)');
                            break;
                        case 2:
                            order = data.actionBlue;
                            color = 'blue';
                            reg0 = new RegExp('(\\s|^)blue(\\s|$)');
                            reg1 = new RegExp('(\\s|^)orange(\\s|$)');
                            reg2 = new RegExp('(\\s|^)green(\\s|$)');
                            break;
                    }
                    if(order != 0){
                        for(var i=0;i<elems.length;i++){
                            var elem = elems.item(i);
                            if(elem.getAttribute('data-kind') == order){
                                if (elem.className.match(reg1)){
                                    elem.className = elem.className.replace(reg1,'');
                                }
                                if (elem.className.match(reg2)){
                                    elem.className = elem.className.replace(reg2,'');
                                }
                                if (!elem.className.match(reg0)){
                                    elem.className += " " + color;
                                }
                            }else{
                                if (elem.className.match(reg0)){
                                    elem.className = elem.className.replace(reg0,'');
                                }
                            }
                        }
                    }
                }
            },'json');
        } 
    },
    index2made:function(){
        if(this.username.length != 0){
            $.get("front_interface.php",{type:"indexGet",index:2},function(data,textStatus){
                $("#goodsRed span").html($("#goodsRed ul.option").find("li[data-value="+data.goodsRed+"]").html());
                $("#goodsGreen span").html($("#goodsGreen ul.option").find("li[data-value="+data.goodsGreen+"]").html());
                $("#goodsBlue span").html($("#goodsBlue ul.option").find("li[data-value="+data.goodsBlue+"]").html());
                var order,reg0,reg1,reg2,color;
                var elems = document.querySelectorAll("#content2 a");
                for(var j=0;j<3;j++){
                    switch(j){
                        case 0:
                            order = data.goodsRed;
                            color = 'red';
                            reg0 = new RegExp('(\\s|^)red(\\s|$)');
                            reg1 = new RegExp('(\\s|^)green(\\s|$)');
                            reg2 = new RegExp('(\\s|^)blue(\\s|$)');
                            break;
                        case 1:
                            order = data.goodsGreen;
                            color = 'green';
                            reg0 = new RegExp('(\\s|^)green(\\s|$)');
                            reg1 = new RegExp('(\\s|^)orange(\\s|$)');
                            reg2 = new RegExp('(\\s|^)blue(\\s|$)');
                            break;
                        case 2:
                            order = data.goodsBlue;
                            color = 'blue';
                            reg0 = new RegExp('(\\s|^)blue(\\s|$)');
                            reg1 = new RegExp('(\\s|^)orange(\\s|$)');
                            reg2 = new RegExp('(\\s|^)green(\\s|$)');
                            break;
                    }
                    if(order != 0){
                        for(var i=0;i<elems.length;i++){
                            var elem = elems.item(i);
                            if(elem.getAttribute('data-kind') == order){
                                if (elem.className.match(reg1)){
                                    elem.className = elem.className.replace(reg1,'');
                                }
                                if (elem.className.match(reg2)){
                                    elem.className = elem.className.replace(reg2,'');
                                }
                                if (!elem.className.match(reg0)){
                                    elem.className += " " + color;
                                }
                            }else{
                                if (elem.className.match(reg0)){
                                    elem.className = elem.className.replace(reg0,'');
                                }
                            }
                        }
                    }
                }
            },'json'); 
        } 
    },
    index3made:function(){
        if(this.username.length != 0){
            var self = this;
            $.get("front_interface.php",{type:"indexGet",index:3},function(data,textStatus){
                    for(var i=0; i<data.total;i++){
                        self.addTopic(data['rows'+i].id,data['rows'+i].name);
                    }
                    if(data.hasDelete>0){
                        alert("您之前加载的话题中有"+data.hasDelete+"个已被发布者删除或已到期");
                    }
            },'json'); 
        } 
    },

//初始化时创建content内容
    //第一个页面的
    actionSubmit:function(_this){
        if(this.username.length != 0){
            $.post("front_interface.php",$(_this).serialize(),function(data,textStatus){ 
                if (data.error == 0) {
                    alert("活动发布成功"); 
                }else{
                    alert("十分抱歉，服务器出错，请稍后再试！");
                }
            },"json");
        } else {
            alert("请先登录，才能进行活动发布");
        }
    },
    actionQuery:function(){
        if(this.username.length != 0){
            var self = this;
            $.get("front_interface.php",{type:"actionQuery",kind:$("#actionQueryForm #actionQueryKind").val(),name:$("#actionQueryForm #actionQueryName").val()},function(data,textStatus){
                if(data.total > 0){
                    $("#content1 a").each(function(){
                        $(this).unbind();
                    });
                    if(tagCloud.timer != null){tagCloud.switchRotate(false);}
                    $("#content1").empty().unbind();
                    for(var i=0; i<data.total;i++){ 
                        var str = '<a href="javascript:;" data-for='+data['rows'+i].id+" data-kind="+data['rows'+i].kind+">"+data['rows'+i].name+"</a>";
                        $("#content1").append($(str));
                    }
                    tagCloud.deploy("content1",200,5);
                    $("#content1 a").each(function(){
                        var elem = $("#selector1 .action_details");
                        $(this).click(function(event){
                            if(elem.attr('data-for') != $(this).attr('data-for')){
                                $.get("front_interface.php",{type:"actionDetails",id:$(this).attr('data-for')},function(data,textStatus){
                                    elem.empty();
                                    if(tagCloud.timer != null){tagCloud.switchRotate(false);}
                                    if(data[0].msg == undefined){
                                        var htmlcode = "<strong>活动名称：</strong>: "+data[0].name+"<br />";
                                        htmlcode = htmlcode + "<strong>活动时间：</strong>: "+data[0].time+"<br />";
                                        htmlcode = htmlcode + "<strong>活动地点：</strong>: "+data[0].site+"<br />";
                                        htmlcode = htmlcode + "<strong>活动人数：</strong>: "+data[0].pnum+"<br />";
                                        htmlcode = htmlcode + "<strong>联系方式：</strong>: "+data[0].connectway+"<br />";
                                        htmlcode = htmlcode + "<strong>联系详情：</strong>: "+data[0].connectdetails+"<br />";                        
                                    }else{
                                        var htmlcode = "<strong>"+data[0].msg+"</strong>";
                                    }
                                    elem.append(htmlcode);
                                    elem.css({"left":(event.clientX+30),"top":(event.clientY+30)}).show();
                                    elem.attr('data-for',data[0].id)
                                },'json');
                            }else{
                                elem.empty().hide();
                                elem.attr('data-for',"");
                                tagCloud.switchRotate(true);
                            }
                        });
                    });
                    self.index1made(); 
                }else{
                    alert("还没有人发布该活动，您可以自己发布或选择定制");
                }
            },'json');
            return false;
        } else {
            alert("请先登录，才能进行活动查询");
        } 
    },
    actionCustom:function(){
        if(this.username.length != 0){
            var self = this;
            $.get("front_interface.php",{type:"actionCustom",kind:$("#actionQueryForm #actionQueryKind").val(),name:$("#actionQueryForm #actionQueryName").val()},function(data,textStatus){
                if(data.error == 0){
                    alert("该活动已为您定制成功，如有人发布会第一时间告知您");
                }else if(data.error == 1){
                    alert("您已经定制过该活动，请勿重复定制");
                }else{
                    alert("后台操作失败，请稍后再试");
                }
            },'json');
            return false;
        } else {
            alert("请先登录，才能进行活动定制");
        }
    },
    tagGet:function(){
        var self = this;
        $.get("front_interface.php",{type:"actionGet",initialPos:this.initialPos1,onceAmount:this.onceAmount1},function(data,textStatus){
            self.initialPos1 = data.initialPos;
            $("#content1 a").each(function(){
                $(this).unbind();
            });
            if(tagCloud.timer != null){tagCloud.switchRotate(false);}
            $("#content1").empty().unbind();
            for(var i=0; i<data.total;i++){ 
                var str = '<a href="javascript:;" data-for='+data['rows'+i].id+" data-kind="+data['rows'+i].kind+">"+data['rows'+i].name+"</a>";
                $("#content1").append($(str));
            }
            tagCloud.deploy("content1",200,5);
            $("#content1 a").each(function(){
                var elem = $("#selector1 .action_details");
                $(this).click(function(event){
                    if(elem.attr('data-for') != $(this).attr('data-for')){
                        $.get("front_interface.php",{type:"actionDetails",id:$(this).attr('data-for')},function(data,textStatus){
                            elem.empty();
                            if(tagCloud.timer != null){tagCloud.switchRotate(false);}
                            if(data[0].msg == undefined){
                                var htmlcode = "<strong>活动名称：</strong>: "+data[0].name+"<br />";
                                htmlcode = htmlcode + "<strong>活动时间：</strong> "+data[0].time+"<br />";
                                htmlcode = htmlcode + "<strong>活动地点：</strong> "+data[0].site+"<br />";
                                htmlcode = htmlcode + "<strong>活动人数：</strong> "+data[0].pnum+"<br />";
                                htmlcode = htmlcode + "<strong>联系方式：</strong> "+data[0].connectway+"<br />";
                                htmlcode = htmlcode + "<strong>联系详情：</strong> "+data[0].connectdetails+"<br />";
                            }else{
                                var htmlcode = "<strong>"+data[0].msg+"</strong>";
                            }
                            elem.append(htmlcode);
                            elem.css({"left":(event.clientX+30),"top":(event.clientY+30)}).show();
                            elem.attr('data-for',data[0].id);
                        },'json');
                    }else{
                        elem.empty().hide();
                        elem.attr('data-for',"");
                        tagCloud.switchRotate(true);
                    }
                });
            });
            if(self.username != ""){
                self.index1made();
            }
        },'json');
    },

    //第二个页面的
    goodsSubmit:function(_this){
        if($("#goodsSubmit #goodsimage").val() == ""){
            $("#goodsSubmit #goodsimage").testRemind("请上传物品照片");             
        }else{
            if(this.username.length != 0){
                var options = {
                    url: "front_interface.php",
                    type:"post",
                    dataType:"json",
                    success: function(data){ 
                                if (data.error == 0) {
                                    alert("物品发布成功"); 
                                }else if(data.error == 1){
                                    alert(data.msg);
                                }else{
                                    alert("十分抱歉，服务器出错，请稍后再试！");
                                }            
                            }
                };
                $(_this).ajaxSubmit(options);
            } else {
                alert("请先登录，才能进行物品发布");
            }
        }
    },
    goodsQuery:function(){
        if(this.username.length != 0){
            var self = this;
            $.get("front_interface.php",{type:"goodsQuery",kind:$("#goodsQueryForm #goodsQueryKind").val(),name:$("#goodsQueryForm #goodsQueryName").val()},function(data,textStatus){
                if(data.total > 0){
                    var elem = $("#content2");
                    $("#content2 a .box").each(function(){
                        $(this).unbind();
                    });    
                    elem.empty().unbind("scoll");
                    $(window).unbind("resize");
                    var idArray =[],nameArray =[],kindArray =[],priceArray =[],degreeArray =[],connectwayArray =[],connectdetailsArray =[];
                    for(var i=0; i<data.total;i++){ 
                        idArray.push(data['rows'+i].id.replace(/^0+/,''));
                        nameArray.push(data['rows'+i].name);
                        kindArray.push(data['rows'+i].kind);
                        priceArray.push(data['rows'+i].price);
                        degreeArray.push(data['rows'+i].degree);
                        connectwayArray.push(data['rows'+i].connectway);
                        connectdetailsArray.push(data['rows'+i].connectdetails);
                    }
                    waterFall.deploy("content2",data.total,false,idArray,nameArray,kindArray,priceArray,degreeArray,connectwayArray,connectdetailsArray);
                    self.index2made(); 
                }else{
                    alert("还没有人发布该物品，您可以先选择定制，如有人发布会第一时间告诉您");
                }               
            },'json');
            return false;
        } else {
            alert("请先登录，才能进行物品查询");
        }
    },
    goodsCustom:function(){
        if(this.username.length != 0){
            var self = this;
            $.get("front_interface.php",{type:"goodsCustom",kind:$("#goodsQueryForm #goodsQueryKind").val(),name:$("#goodsQueryForm #goodsQueryName").val()},function(data,textStatus){
                if(data.error == 0){
                    alert("该物品已为您定制成功，如有人发布会第一时间告知您");
                }else if(data.error == 1){
                    alert("您已经定制过该物品，请勿重复定制");
                }else{
                    alert("后台操作失败，请稍后再试");
                }
            },'json');
            return false;
        } else {
            alert("请先登录，才能进行物品定制");
        }
    },
    goodsGet:function(){
        var elem = $("#content2");
        var row = Math.ceil(elem[0].clientHeight / 215);
        var column = Math.floor((elem[0].clientWidth-20) / 170); 
        this.onceAmount2 = row * column;
        var self = this;
        $.get("front_interface.php",{type:"goodsGet",initialPos:this.initialPos2,onceAmount:this.onceAmount2},function(data,textStatus){
            var indexPos = self.initialPos2 + data.total;
            self.initialPos2 = data.initialPos;
            $("#content2 a .box").each(function(){
                $(this).unbind();
            });    
            elem.empty().unbind("scoll");
            $(window).unbind("resize");
            var idArray =[],nameArray =[],kindArray =[],priceArray =[],degreeArray =[],connectwayArray =[],connectdetailsArray =[];
            for(var i=0; i<data.total;i++){ 
                idArray.push(data['rows'+i].id.replace(/^0+/,''));
                nameArray.push(data['rows'+i].name);
                kindArray.push(data['rows'+i].kind);
                priceArray.push(data['rows'+i].price);
                degreeArray.push(data['rows'+i].degree);
                connectwayArray.push(data['rows'+i].connectway);
                connectdetailsArray.push(data['rows'+i].connectdetails);
            }
            waterFall.deploy("content2",data.total,indexPos,idArray,nameArray,kindArray,priceArray,degreeArray,connectwayArray,connectdetailsArray);
            if(self.username != ""){
                self.index2made();
            }
        },'json');
    },

    //第三个页面的
    monitor:function(elem,id){
        var index = parseInt(elem.attr('id').slice(-1));
        var self = this;
        self.comet[index] = true;
        function connect(){
            var timetamp = self.timestamp[index];
            $.ajax({
                data : {'timestamp':timetamp,'topicId':id},
                url : 'message.php',
                type : 'post',
                timeout : 0,
                dataType:'JSON',
                success : function(data){
                    error = false;
                    self.timestamp[index] = data.timestamp;
                    for(var i=0; i<data.total;i++){
                        var str = "rows"+i;
                        var author = data[str].username; //发布者
                        var content = data[str].content; //内容
                        var htmlcode = "<strong>"+author+"</strong>: "+content+"<br />";
                        elem.prepend(htmlcode); //添加到文档中
                    }
                },
                error : function(){
                    error = true;
                    if(self.comet[index]){setTimeout(function(){connect();}, 5000);}
                },
                complete : function(){
                    if(self.comet[index]){
                        if (error){
                            // 请求有错误时,延迟5s再连接
                            setTimeout(function(){connect();}, 5000);
                        }else
                            connect();
                    }
                },
            });
        }
        connect();
    },
    addTopic:function(id,name){
        var item =$('#container3 #itemlist').children('div');
        var desc =$('#container3 #itemdescription').children('span');
        var order = new Array();
        var str = "";
        item.each(function(){
            if($(this).attr('data-for') == id){
                str = "您已经添加过该话题，请勿重复添加";
                return str;
            }
            if($(this).attr('data-for') == ""){
                order.push($(this).attr('data-order'));
            }
        });
        if(str.length != 0){return str;}
        if(order.length == 0){
            str = "您已经添满了5个话题，请先删除1个再进行添加";
            return str;
        }else{
            var min = Math.min.apply(Math,order);
            var elem = item.filter("div[data-order="+min+"]");
            elem.attr('data-for', id);
            var span = desc.filter("span[data-for='']:first");
            span.attr('data-for', id).text(name);
            if(min == 0){
                span.fadeIn();
            }
            $.get("front_interface.php",{type:"topicGet",field:elem.attr('id'),topic:id});
            this.monitor(elem,id);
            return (min+1);
        }
    },
    topicSubmit:function(_this){
        if(this.username.length != 0){
            var self = this;
            $.post("front_interface.php",$(_this).serialize(),function(data,textStatus){ 
                if (data.error == 0) {
                    var suc = self.addTopic(data.id,data.name);
                    if(suc != false){
                        alert("该话题发布成功，且已为您添加至第"+suc+"话题框");
                    }else{
                        alert("因为您的话题框添加已满，该话题只进行了发布，未为您添加至话题框");
                    }
                }else if(data.error == 1){
                    alert(data.msg);
                }else{
                    alert("十分抱歉，服务器出错，请稍后再试！");
                }              
            },"json");
        } else {
            alert("请先登录，才能进行话题发布");
        }
    },
    topicQuery:function(){
        if(this.username.length != 0){
            var self = this;
            $.get("front_interface.php",{type:"topicQuery",name:$("#topicQueryForm #topicQueryName").val()},function(data,textStatus){
                if(data.total == 0){
                    alert("还没有人发布该话题，您可以自己发布或选择定制");
                }else{
                    $("#aside3 #resultShow #result a").each(function(){
                        $(this).unbind();
                    });
                    $("#aside3 #resultShow #result").empty();
                    for(var i=0;i<data.total;i++){
                        var row = "rows"+i;
                        var str = '<a href="javascript:;" data-for='+data[row].id+" data-name="+data[row].name+">"+data[row].name+"_"+data[row].username+"</a>";
                        $("#aside3 #resultShow #result").append($(str));
                    }
                    $("#aside3 #resultShow #result a").each(function(){
                        $(this).click(function(){
                            var suc = self.addTopic($(this).attr('data-for'),$(this).attr('data-name'));
                            if(typeof(suc) == "number"){
                                alert("该话题已成功为您添加至第"+suc+"话题框");
                            }else{
                                alert(suc);
                            }
                        });
                    });
                }                    
            },'json');
            return false;
        } else {
            alert("请先登录，才能进行话题查询");
        } 
    },
    topicCustom:function(){
        if(this.username.length != 0){
            var self = this;
            $.get("front_interface.php",{type:"topicCustom",name:$("#topicQueryForm #topicQueryName").val()},function(data,textStatus){
                if(data.error == 0){
                    alert("该话题已为您定制成功，如有人发布会第一时间告知您");
                }else if(data.error == 1){
                    alert("您已经定制过该话题，请勿重复定制");
                }else{
                    alert("后台操作失败，请稍后再试");
                }
            },'json');
            return false;
        } else {
            alert("请先登录，才能进行话题定制");
        } 
    },
    postMsg:function(){
        if(this.username.length != 0){
            var item =$('#container3 #itemlist').children('div');
            var elem = item.filter("div[data-order=0]");
            var id = elem.attr('data-for');
            if(id){
                var index = parseInt(elem.attr('id').slice(-1));
                var timetamp = this.timestamp[index];
                if($("#information").val().length != 0 && !$("#information").val().match(/^\s*$/g)){
                    $.post("message.php",{topicId:id,message:$("#information").val(),name:this.username},function(data,textStatus){
                        $("#information").val("");            
                    });
                }
            }else{
                alert("您还没在话题框上绑定话题");                
            }
        } else {
            alert("请先登录，才能发送信息");
        } 
    },   
    deleteTopic:function(){
        var item = $('#container3 #itemlist').children('div');
        var elem = item.filter("div[data-order=0]");
        //消除comet状态
        var tid = elem.attr('data-for');
        if(tid.length != 0){
            var index = parseInt(elem.attr('id').slice(-1));
            this.comet[index] = false;//改为可以再次绑定comet的属性
            $.post("message.php",{topicId:tid,message:'exit__delete__close',name:this.username});
            //消除等待的连接
            var self = this;
            setTimeout(function(){
                self.timestamp[index] = 0;//改为可以再次绑定comet的属性            
            },1000);
            //清除对应的span和div
            var desc =$('#container3 #itemdescription').children('span');
            var span = desc.filter("span[data-for="+tid+"]");
            span.attr('data-for',"").text("").hide();
            elem.attr('data-for',"").empty();
            //消除数据库中的个性定制
            $.get("front_interface.php",{type:"deleteGet",field:elem.attr('id')});
            //让下一个话题跳转至首位置
            var order = new Array();
            item.each(function(){
                if($(this).attr('data-for') != ""){
                    order.push($(this).attr('data-order'));
                }
            });
            if(order.length != 0){
                var min = Math.min.apply(Math,order);
                var elem = item.filter("div[data-order="+min+"]");
                elem.trigger("click");
            }else{
                desc.filter(":first").fadeIn();            
            }
        }
    },

};
