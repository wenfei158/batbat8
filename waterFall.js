var waterFall = {
	container: null,//容器
	columnNumber: 1,//图片栏个数
	columnWidth: 170,//图片栏宽度
	indexDatabase: 0,//从第几条开始加载
	scrollTop: 0,//容器的滑动值
	detectWidth: 0,//用于检测容器宽度是否发生了很大的变化
	loadFinish: false,//是否可进行加载
	loadIndex:0,//轮到第几个栏加载

	//与加载内容相关的成员变量
	amount:13,//第一次加载的图片数量
	rootImage: "./goods/",//图片的存储位置
	idArray:[],//存储第一次加载的物品图片名称
	nameArray:[],//存储第一次加载的物品名称
	kindArray:[],//存储第一次加载的物品种类
	priceArray:[],//存储第一次加载的物品价格
	degreeArray:[],//存储第一次加载的物品新旧程度
	connectwayArray:[],//存储第一次加载的联系方式
	connectdetailsArray:[],//存储第一次加载的联系详情

	//翻页动画
	enter:function() {
	    var eledoc = null, eleFront = null,eleList = $(this).find(".flip");
		eleList.each(function() {
            if ($(this).hasClass("doc")) {
                eleBack = $(this);
            } else {
                eleFront = $(this);
            }
        });
        eleFront.addClass("enter_out")
        if(eleFront.hasClass("enter_in"))
        	eleFront.removeClass("enter_in");
        if(eleFront.hasClass("leave_out"))
        	eleFront.removeClass("leave_out");
        if(eleFront.hasClass("leave_in"))
        	eleFront.removeClass("leave_in");	            
        setTimeout(function() {
            eleBack.addClass("enter_in")
            if(eleBack.hasClass("enter_out"))
            	eleBack.removeClass("enter_out");
            if(eleBack.hasClass("leave_out"))
            	eleBack.removeClass("leave_out");
            if(eleBack.hasClass("leave_in"))
            	eleBack.removeClass("leave_in");	
        }, 225);	            
    },
    leave:function () {
	    var eleBack = null, eleFront = null,eleList = $(this).find(".flip");
		eleList.each(function() {
            if ($(this).hasClass("doc")) {
                eleFront = $(this);
            } else {
                eleBack = $(this);
            }
        });	
        eleFront.addClass("leave_out");
        if(eleFront.hasClass("leave_in"))
        	eleFront.removeClass("leave_in");
        if(eleFront.hasClass("enter_out"))
        	eleFront.removeClass("enter_out");
        if(eleFront.hasClass("enter_in"))
        	eleFront.removeClass("enter_in");	            
        setTimeout(function() {
            eleBack.addClass("leave_in");
            if(eleBack.hasClass("leave_out"))
            	eleBack.removeClass("leave_out");
            if(eleBack.hasClass("enter_out"))
            	eleBack.removeClass("enter_out");
            if(eleBack.hasClass("enter_in"))
            	eleBack.removeClass("enter_in");			            
        }, 225);
    },
	// 滚动载入
	append: function(column) {
		var self = this;
        $.get("front_interface.php",{type:"goodsGet",initialPos:this.indexDatabase,onceAmount:1},function(data,textStatus){
        	if(data.msg == undefined){
				var imgUrl = self.rootImage + data.rows0.id.replace(/^0+/,'')+ ".jpg";
				var aEle = document.createElement("a");
				aEle.href = "javascript:;";
				aEle.className = "pic_a";
				aEle.setAttribute("data-kind",data.rows0.kind);
				aEle.innerHTML = '<div class="box"><div class="doc flip enter_out"><h4>价格：'+ data.rows0.price +'</h4><h4>新旧程度：'+ data.rows0.degree +'</h4><h4>联系方式：'+ data.rows0.connectway +'</h4><h4>联系详情：'+ data.rows0.connectdetail +'</h4></div><div class="flip"><img src="'+ imgUrl +'" style="width:150px;height:180px;" /></div></div><strong>'+ data.rows0.name +'</strong>';
		  		column.appendChild(aEle);
			}else{
				self.loadFinish = true;				
			}  
        },'json');
	},

	// 是否滚动载入的检测
	appendDetect: function() {
		var start = this.loadIndex;		
		if (start != 0){
			for (start; start < this.columnNumber; start++) {
				var eleColumn = document.getElementById("waterFallColumn_" + start);
				if (eleColumn && !this.loadFinish){
					this.append(eleColumn);
					this.indexDatabase++;
				}		
			}			
		}
		this.loadIndex = 0;
		for (start = 0; start < this.columnNumber; start++) {
			var eleColumn = document.getElementById("waterFallColumn_" + start);
			if (eleColumn && !this.loadFinish){
				this.append(eleColumn);
				this.indexDatabase++;
			}		
		}
	},
	
	// 页面加载初始创建
	create: function() {
		this.columnNumber = Math.floor((this.container.clientWidth-17) / this.columnWidth);
		var line = Math.floor(this.amount / this.columnNumber);
		this.loadIndex = this.amount % this.columnNumber;
		var start = 0, htmlColumn = '', self = this;
		for (start; start < this.columnNumber; start+=1) {
			htmlColumn = htmlColumn + '<span id="waterFallColumn_'+ start +'" class="column" style="width:'+ this.columnWidth +'px;">'+ 
				function() {
					var html = '', i = 0;
					if(start < self.loadIndex) {
						for (i=0; i<line+1; i+=1) {
							var index = start + self.columnNumber * i;
							var imgUrl = self.rootImage + self.idArray[index] + ".jpg";
							html = html + '<a href="javascript:;" class="pic_a" data-kind='+ self.kindArray[index] +'><div class="box"><div class="doc flip enter_out"><h4>价格：'+ self.priceArray[index] +'</h4><h4>新旧程度：'+ self.degreeArray[index] +'</h4><h4>联系方式：'+ self.connectwayArray[index] +'</h4><h4>联系详情：'+ self.connectdetailsArray[index] +'</h4></div><div class="flip"><img src="'+ imgUrl +'" style="width:150px;height:180px;" /></div></div><strong>'+ self.nameArray[index] +'</strong></a>';
						}
					}else{
						for (i=0; i<line; i+=1) {
							index = start + self.columnNumber * i;
							var imgUrl = self.rootImage + self.idArray[index] + ".jpg";
							html = html + '<a href="javascript:;" class="pic_a" data-kind='+ self.kindArray[index] +'><div class="box"><div class="doc flip enter_out"><h4>价格：'+ self.priceArray[index] +'</h4><h4>新旧程度：'+ self.degreeArray[index] +'</h4><h4>联系方式：'+ self.connectwayArray[index] +'</h4><h4>联系详情：'+ self.connectdetailsArray[index] +'</h4></div><div class="flip"><img src="'+ imgUrl +'" style="width:150px;height:180px;" /></div></div><strong>'+ self.nameArray[index] +'</strong></a>';
						}
					}
					return html;	
				}() +
			'</span> ';	
		}
		htmlColumn += '<span id="waterFallDetect" class="column" style="width:'+ this.columnWidth +'px;"></span>';
		this.container.innerHTML = htmlColumn;
		//绑定翻转特效
		$('#content2 .pic_a .box').hover(self.enter,self.leave);	
		return this;
	},

	//内容重新排序加载	
	refresh: function() {
		var arrHtml = [], arrTemp = [], htmlAll = '', start = 0, maxLength = 0;
		for (start; start < this.columnNumber; start+=1) {
			var arrColumn = document.getElementById("waterFallColumn_" + start).innerHTML.match(/<a(?:.|\n|\r|\s)*?a>/gi);
			if (arrColumn) {
				maxLength = Math.max(maxLength, arrColumn.length);
				// arrTemp是一个二维数组
				arrTemp.push(arrColumn);//取出一个Column中的所有元素
			}
		}
		// 重新获取正常的排序
		var lengthStart, arrStart;
		for (lengthStart = 0; lengthStart<maxLength; lengthStart++) {
			for (arrStart = 0; arrStart<this.columnNumber; arrStart++) {
				if (arrTemp[arrStart][lengthStart]) {
					arrHtml.push(arrTemp[arrStart][lengthStart]);	
				}
			}	
		}
		if (arrHtml && arrHtml.length !== 0) {
			// 新栏个数		
			this.columnNumber = Math.floor((this.container.clientWidth-17) / this.columnWidth);
			// 计算每列的行数
			// 向下取整
			var line = Math.floor(arrHtml.length / this.columnNumber);
			this.loadIndex = arrHtml.length % this.columnNumber; 			
			// 重新组装HTML
			var newStart = 0, htmlColumn = '', self = this;
			for (newStart; newStart < this.columnNumber; newStart+=1) {
				htmlColumn = htmlColumn + '<span id="waterFallColumn_'+ newStart +'" class="column" style="width:'+ this.columnWidth +'px;">'+ 
					function() {
						var html = '', i = 0;
						if(newStart < self.loadIndex){
							for (i=0; i<line+1; i+=1) {
								html += arrHtml[newStart + self.columnNumber * i];
							}
						}else{
							for (i=0; i<line; i+=1) {
								html += arrHtml[newStart + self.columnNumber * i];
							}
						}
						return html;	
					}() +
				'</span> ';	
			}
			htmlColumn += '<span id="waterFallDetect" class="column" style="width:'+ this.columnWidth +'px;"></span>';
			$('#content2 .pic_a').mouseout = $('#content2 .pic_a').mouseover = null;
			this.container.innerHTML = htmlColumn;		
		}
		//绑定翻转特效
		var self = this;
		$('#content2 .pic_a .box').hover(self.enter,self.leave);
	},
	
	// 滚动加载
	scroll: function() {
		var self = this;
		this.container.onscroll = function() {
			// 滚动到底的时候加载
			var scrollTop = self.container.scrollTop;
			if (self.container.scrollHeight == (self.container.clientHeight + scrollTop)) {
				self.appendDetect();		
				overallLayout.index2made();//这个只是自己网站的个性化配置，报错的话删除掉就行
			}
		};
		return this;
	},
	
	// 浏览器窗口大小变换
	resize: function() {
		var self = this;
		window.onresize = function() {
			var detectLeft = self.container.clientWidth;
			if (detectLeft && Math.abs(detectLeft - self.detectLeft) > 150) {
				self.detectLeft = detectLeft;
				// 检测标签偏移异常，认为布局要改变
				self.refresh();	
			}
		};
		return this;
	},

	deploy: function(div1,num1,num2,array0,array1,array2,array3,array4,array5,array6) {
		if (typeof div1 == "string"){
			this.container = document.getElementById(div1);
			this.amount = num1;
			this.loadFinish = false;
			this.loadIndex = 0;
			this.idArray = array0;
			this.nameArray = array1;
			this.kindArray = array2;
			this.priceArray = array3;
			this.degreeArray = array4;
			this.connectwayArray = array5;
			this.connectdetailsArray = array6;
		}
		if (this.container) {
			this.scrollTop = this.container.scrollTop;
			this.detectWidth = this.container.clientWidth;
		}
		if(num2){
			this.indexDatabase = num2;
			this.create().resize().scroll();
		}else{
			this.create().resize();			
		}
	},
};
