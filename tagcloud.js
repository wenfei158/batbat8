var tagCloud ={
	unit:Math.PI/180,//单位
	radius:300,//半径
	active:false,//鼠标是否进入标签云
	speed:5,//速度
	mouseX:0,//鼠标位置决定移动速度
	mouseY:0,
	aA:null,//标签集合
	mcList:[],//用于存储标签的高、宽、大小、透明度
	oDiv:null,//容器
	timer:null,//用于清空setInterval

	sineCosine:function(a,b,c){
		sa = Math.sin(a * this.unit);
		ca = Math.cos(a * this.unit);
		sb = Math.sin(b * this.unit);
		cb = Math.cos(b * this.unit);
		sc = Math.sin(c * this.unit);
		cc = Math.cos(c * this.unit);
	},

	doPosition:function(){
		var l=this.oDiv.offsetWidth/2;
		var t=this.oDiv.offsetHeight/2;
		for(var i=0;i<this.mcList.length;i++)
		{
			this.aA[i].style.left=this.mcList[i].cx+l-this.mcList[i].offsetWidth/2+'px';
			this.aA[i].style.top=this.mcList[i].cy+t-this.mcList[i].offsetHeight/2+'px';
			
			this.aA[i].style.fontSize=Math.ceil(12*this.mcList[i].scale/2)+8+'px';
			
			this.aA[i].style.filter="alpha(opacity="+100*this.mcList[i].alpha+")";
			this.aA[i].style.opacity=this.mcList[i].alpha;
		}
	},

	positionAll:function(){
		var phi=0;
		var theta=0;
		var max=this.mcList.length;
		var i=0;

		var aTmp=[];
		var oFragment=document.createDocumentFragment();

		for(i=0;i<this.aA.length;i++)
		{
			aTmp.push(this.aA[i]);
		}

		aTmp.sort
		(
			function ()
			{
				return Math.random()<0.5?1:-1;
			}
		);

		for(i=0;i<aTmp.length;i++)
		{
			oFragment.appendChild(aTmp[i]);
		}

		this.oDiv.appendChild(oFragment);

		for( var i=1; i<max+1; i++){
			phi = Math.acos(-1+(2*i-1)/max);
			theta = Math.sqrt(max*Math.PI)*phi;

			this.mcList[i-1].cx = this.radius * Math.cos(theta)*Math.sin(phi);
			this.mcList[i-1].cy = this.radius * Math.sin(theta)*Math.sin(phi);
			this.mcList[i-1].cz = this.radius * Math.cos(phi);
			
			this.aA[i-1].style.left=this.mcList[i-1].cx+this.oDiv.offsetWidth/2-this.mcList[i-1].offsetWidth/2+'px';
			this.aA[i-1].style.top=this.mcList[i-1].cy+this.oDiv.offsetHeight/2-this.mcList[i-1].offsetHeight/2+'px';
		}		
	},

	depthSort:function(){
		var i=0;
		var aTmp=[];
		
		for(i=0;i<this.aA.length;i++)
		{
			aTmp.push(this.aA[i]);
		}
		
		aTmp.sort
		(
			function (vItem1, vItem2)
			{
				if(vItem1.cz>vItem2.cz)
				{
					return -1;
				}
				else if(vItem1.cz<vItem2.cz)
				{
					return 1;
				}
				else
				{
					return 0;
				}
			}
		);
		
		for(i=0;i<aTmp.length;i++)
		{
			aTmp[i].style.zIndex=i;
		}
	},

	update:function(){
		var a;
		var b;

		if(this.active)
		{
			a = -(-this.mouseY/this.radius) * this.speed;
			b = (-this.mouseX/this.radius) * this.speed;
		}
		else
		{
			a = 0.1*this.speed;
			b = 0.1*this.speed;
		}

		var c=0;
		this.sineCosine(a,b,c);
		for(var j=0;j<this.mcList.length;j++)
		{
			var rx1=this.mcList[j].cx;
			var ry1=this.mcList[j].cy*ca+this.mcList[j].cz*(-sa);
			var rz1=this.mcList[j].cy*sa+this.mcList[j].cz*ca;
			
			var rx2=rx1*cb+rz1*sb;
			var ry2=ry1;
			var rz2=rx1*(-sb)+rz1*cb;
			
			var rx3=rx2*cc+ry2*(-sc);
			var ry3=rx2*sc+ry2*cc;
			var rz3=rz2;
			
			this.mcList[j].cx=rx3;
			this.mcList[j].cy=ry3;
			this.mcList[j].cz=rz3;
			
			per=500/(500+rz3);
			
			this.mcList[j].x=rx3*per-2;
			this.mcList[j].y=ry3*per;
			this.mcList[j].scale=per;
			this.mcList[j].alpha=per;
			
			this.mcList[j].alpha=(this.mcList[j].alpha-0.6)*(10/6);
		}

		this.doPosition();
		this.depthSort();
	},

	switchRotate:function(rotate){
		if(rotate){
			var that = this;
			function callback1(){
				that.update();
			}
			this.timer = setInterval(callback1, 30);
		}else{
			clearInterval(this.timer);			
		}
	},
	init:function ()
		{
			var i=0;
			var oTag=null;
			
			this.aA=this.oDiv.getElementsByTagName('a');
			
			for(i=0;i<this.aA.length;i++)
			{
				oTag={};
				oTag.offsetWidth=this.aA[i].offsetWidth;
				oTag.offsetHeight=this.aA[i].offsetHeight;
				this.mcList.push(oTag);
			}
			
			this.sineCosine( 0,0,0 );			
			this.positionAll();

			this.oDiv.addEventListener('mouseover',function(){
				with(tagCloud){
					active = true;
				}
			},false);

			this.oDiv.addEventListener('mouseout',function(){
				with(tagCloud){
					active = false;
				}
			},false);
			
			this.oDiv.addEventListener('mousemove',function(ev){
				var oEvent=window.event || ev;
				with(tagCloud){
					mouseX=-(oEvent.pageX-(oDiv.offsetLeft+oDiv.offsetWidth/2));
					mouseY=-(oEvent.pageY-(oDiv.offsetTop+oDiv.offsetHeight/2));					
					mouseX/=5;
					mouseY/=5;
				}
			},false);
			this.switchRotate(true);
		},

	deploy:function(div1,radius1,speed1){
		this.mcList = [];
		this.mouseX = 0;
		this.mouseY = 0;
		this.active = false;
		if (typeof div1 == "string"){
			this.oDiv=document.getElementById(div1);
		}
		if (typeof radius1 == "number"){
			this.radius=radius1;
		}
		if (typeof speed1 == "number"){
			this.speed=speed1;
		}
		this.init();
	},
};
