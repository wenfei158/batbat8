var cardRotate ={
	itemList:null, //视口窗
	itemDesc:null, //说明栏
	init:function(){
		//初始化切换栏的属性
		var item, className, thisItem, newOrder, desc;
		item = this.itemList.children('div');
		desc = this.itemDesc.children('span');

		//绑定click事件，移动点击的栏到最上
		item.on('click', function() {
			thisItem  = $(this);
			thisOrder = parseInt(thisItem.attr('data-order')) - 1;
			thisItem.addClass('show');

			item.on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function() { 
				thisItem.removeClass().addClass('item-0').attr('data-order', '0');
				//换对应的文字标题
				desc.hide();
				if(thisItem.attr('data-for').length != 0){
					desc.filter('[data-for=' + thisItem.attr('data-for') + ']' ).fadeIn('fast');
				}
			});

			//位于点击的栏前面的栏都后移一位
			window.setTimeout(function () {    
				for(var i = thisOrder; i >= 0; i--) {
					movedItem = item.filter('[data-order=' + i + ']');
					newOrder  = parseInt(movedItem.attr('data-order')) + 1;
					className = 'item-' + newOrder;
					movedItem.removeClass().addClass('transition ' + className).attr('data-order', newOrder);

					item.on('transitionend webkitTransitionEnd MSTransitionEnd oTransitionEnd', function() {
						item.removeClass('transition');
					});
				}  
			}, 500);
		});		
	},
	deploy:function(div1){
		if(typeof div1 == "string"){
			this.itemList  = $("#"+div1).find('#itemlist');
			this.itemDesc  = $("#"+div1).find('#itemdescription');
		}
		this.init();
	},
};
