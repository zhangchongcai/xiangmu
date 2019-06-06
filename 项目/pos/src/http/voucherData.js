
let print_voucher = {
	ROW_WORD_COUNT : 9,
	ROW_HEIGHT_BIG : 13,
	ROW_HEIGHT_SMALL : 12,
	LINE_HEIGHT_GAP : 4,
	ROW_MARGIN_LEFT : 5,
	BARCODE_HEIGHT : 32,
	WORD_LENGTH:17.6
}
let FormatterData = {}



FormatterData.trade_print = function(type,voucherInfo) { 
	/**
	 * 组装打印数据
	 * 1是销售交易凭证；
	 * 2是取货凭证；
	 * 3是取货交易凭证
	 */
	var printInfo = {};
	printInfo.width = 200;
	printInfo.height = 300;
	printInfo.ticket_element = [];


	var yPos = 0;
	//头部
	yPos = print_voucher.print_title_info(type,voucherInfo,printInfo,yPos,12, 0, 0);
	//内容
	yPos = print_voucher.print_content_info(type, voucherInfo, printInfo, yPos, 11, 0, 0);
	// //尾部
	yPos = print_voucher.print_end_info(type, voucherInfo, printInfo, yPos, 11, 0, 0);

	console.log(yPos);
	
	if(yPos>printInfo.height) {
		printInfo.height = yPos
	}

	return printInfo
}



 /**
 * 组装抬头信息
 */
print_voucher.print_title_info = function(type,voucherInfo,printInfo,yPos,fontSize,fontBlack,showModle){
	let _oneMarginLeft = ( printInfo.width - (print_voucher.WORD_LENGTH * 4) )/2
	printInfo.ticket_element.push({elementValue:'欢迎光临', x:_oneMarginLeft, y:yPos, font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	let _towMarginLeft = ( printInfo.width -  (voucherInfo.cinemaName.length+4) * print_voucher.WORD_LENGTH ) / 2
	printInfo.ticket_element.push({elementValue:(voucherInfo.cinemaName + '数字影院'), x:20, y:(yPos += print_voucher.ROW_HEIGHT_BIG), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	let  title = "销售交易凭证 " 
	let  _threeMarginLeft = ( printInfo.width - (print_voucher.WORD_LENGTH * 6) )/2
	console.log(_towMarginLeft,'---',_threeMarginLeft)
	if(type == 2){
		title = "   取货凭证 " 
		_threeMarginLeft = _oneMarginLeft
	}else if(type == 3){
		title = "取货交易凭证 " 
		_threeMarginLeft = ( printInfo.width - (print_voucher.WORD_LENGTH * 6) )/2
	}
	printInfo.ticket_element.push({elementValue: title, x:_threeMarginLeft, y:(yPos += print_voucher.ROW_HEIGHT_BIG), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	return yPos;	
};

/**
 * 组装内容
 */
print_voucher.print_content_info = function(type, voucherInfo, printInfo, yPos, fontSize, fontBlack, showModle){
	printInfo.ticket_element.push({elementValue:'------------------------------------', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	if(type == 1){//销售交易凭证
		var index = 1;
		for(var i=0;i<voucherInfo.arr_goods.length;i++){
			var data = voucherInfo.arr_goods[i];
			var name_ = "";
			if(data.goodsName.length > print_voucher.ROW_WORD_COUNT){
				name_ = data.goodsName.substring(0, print_voucher.ROW_WORD_COUNT);
			}else{
				name_ = data.goodsName;
			}
			var split_line_height = 0;
			if(index == 1){
				split_line_height = print_voucher.LINE_HEIGHT_GAP;
			}
			printInfo.ticket_element.push({elementValue:(index+"." + name_), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - split_line_height)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			printInfo.ticket_element.push({elementValue:(+ data.saleNum+" x "+parseFloat(data.salePrice).toFixed(2)), x:115, y:yPos, font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			
			if(data.goodsName.length > print_voucher.ROW_WORD_COUNT){
				var name_2 = data.goodsName.substring(print_voucher.ROW_WORD_COUNT,data.goodsName.length);
				printInfo.ticket_element.push({elementValue:("  " + name_2), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			}
			//套餐子商品明细
			// if(print_voucher.isPrintComboItemDetail() && data.arr_combo_item.isArray(data.arr_combo_item) && data.arr_combo_item.length > 0){
			// 	data.arr_combo_item.forEach((_item, _index){
			// 		var name_prefix = _item.name.trim().substring(0, print_voucher.ROW_WORD_COUNT), name_suffix = _item.name.trim().substring(print_voucher.ROW_WORD_COUNT);
			// 		printInfo.ticket_element.push({elementValue:name_prefix, x:(print_voucher.ROW_MARGIN_LEFT + 10), y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			// 		printInfo.ticket_element.push({elementValue:("  x "+_item.count.trim()), x:115, y:yPos, font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			// 		if(name_suffix != ''){
			// 			printInfo.ticket_element.push({elementValue:name_suffix, x:(print_voucher.ROW_MARGIN_LEFT + 10), y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			// 		}
			// 	});
			// }
			index++;
		}
		printInfo.ticket_element.push({elementValue:'------------------------------------', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		printInfo.ticket_element.push({elementValue:("总件数："+voucherInfo.totalCount), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		printInfo.ticket_element.push({elementValue:("应收： "+parseFloat(voucherInfo.totalPrice).toFixed(2)), x:90, y:yPos, font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		printInfo.ticket_element.push({elementValue:("实收： "+parseFloat(voucherInfo.payPrice).toFixed(2)), x:90, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		if(voucherInfo.giving_price && voucherInfo.giving_price >0){
			printInfo.ticket_element.push({elementValue:("找零： "+parseFloat(voucherInfo.giving_price).toFixed(2)), x:90, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		}
		if(voucherInfo.cinema_price && voucherInfo.cinema_price >0){
			printInfo.ticket_element.push({elementValue:("(含影院补贴 "+parseFloat(voucherInfo.cinema_price).toFixed(2)+")"), x:70, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		}
		printInfo.ticket_element.push({elementValue:'------------------------------------', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		printInfo.ticket_element.push({elementValue:'支付明细：', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		for(var j=0;j<voucherInfo.arr_payment.length;j++){
			var pay = voucherInfo.arr_payment[j];
			printInfo.ticket_element.push({elementValue:(pay.payTypeName+"："+ parseFloat(pay.payAmount).toFixed(2)), x:(print_voucher.ROW_MARGIN_LEFT + 20), y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		}
		
	}else if(type == 3){//取货交易凭证2017-11-27
		var index = 1;
		for(var i in voucherInfo.arr_goods){
			var data = voucherInfo.arr_goods[i];
			var name_ = "";
			if(data.name.length > print_voucher.ROW_WORD_COUNT){
				name_ = data.name.substring(0, print_voucher.ROW_WORD_COUNT);
			}else{
				name_ = data.name;
			}
			var split_line_height = 0;
			if(index == 1){
				split_line_height = print_voucher.LINE_HEIGHT_GAP;
			}
			printInfo.ticket_element.push({elementValue:(index+"." + name_), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - split_line_height)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			printInfo.ticket_element.push({elementValue:(+ data.count+" x "+parseFloat(data.price).toFixed(2)), x:115, y:yPos, font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			
			if(data.name.length > print_voucher.ROW_WORD_COUNT){
				var name_2 = data.name.substring(print_voucher.ROW_WORD_COUNT,data.name.length);
				printInfo.ticket_element.push({elementValue:("  " + name_2), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			}
			//套餐子商品明细
			if(print_voucher.isPrintComboItemDetail() && $.isArray(data.arr_combo_item) && data.arr_combo_item.length > 0){
				$.each(data.arr_combo_item, function(_index, _item){
					var name_prefix = _item.name.trim().substring(0, print_voucher.ROW_WORD_COUNT), name_suffix = _item.name.trim().substring(print_voucher.ROW_WORD_COUNT);
					printInfo.ticket_element.push({elementValue:name_prefix, x:(print_voucher.ROW_MARGIN_LEFT + 10), y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
					printInfo.ticket_element.push({elementValue:("  x "+_item.count.trim()), x:115, y:yPos, font_size:fontSize, font_black:fontBlack, show_modle:showModle});
					if(name_suffix != ''){
						printInfo.ticket_element.push({elementValue:name_suffix, x:(print_voucher.ROW_MARGIN_LEFT + 10), y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
					}
				});
			}
			index++;
		}
		printInfo.ticket_element.push({elementValue:'------------------------------------', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		printInfo.ticket_element.push({elementValue:("总件数："+voucherInfo.total_count), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		printInfo.ticket_element.push({elementValue:("应收： "+parseFloat(voucherInfo.total_price).toFixed(2)), x:90, y:yPos, font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		printInfo.ticket_element.push({elementValue:("实收： "+parseFloat(voucherInfo.pay_price).toFixed(2)), x:90, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		if(voucherInfo.giving_price && voucherInfo.giving_price >0){
			printInfo.ticket_element.push({elementValue:("找零： "+parseFloat(voucherInfo.giving_price).toFixed(2)), x:90, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		}
		if(voucherInfo.cinema_price && voucherInfo.cinema_price >0){
			printInfo.ticket_element.push({elementValue:("(含影院补贴 "+parseFloat(voucherInfo.cinema_price).toFixed(2)+")"), x:70, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		}
		printInfo.ticket_element.push({elementValue:'------------------------------------', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		printInfo.ticket_element.push({elementValue:'支付明细：', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		for(var j in voucherInfo.arr_payment){
			var pay = voucherInfo.arr_payment[j];
			printInfo.ticket_element.push({elementValue:(pay.name+"："+ parseFloat(pay.cost).toFixed(2)), x:(print_voucher.ROW_MARGIN_LEFT + 20), y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		}
	}else{//卖品取货凭证
		printInfo.ticket_element.push({elementValue: voucherInfo.get_code, x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:2});//条码
		printInfo.ticket_element.push({elementValue: voucherInfo.get_code, x:65, y:(yPos += print_voucher.BARCODE_HEIGHT), font_size:fontSize, font_black:fontBlack, show_modle:0});//文本
		printInfo.ticket_element.push({elementValue:'商品明细', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack,  show_modle:showModle});
		printInfo.ticket_element.push({elementValue:'------------------------------------', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack,  show_modle:showModle});
		var t_index = 1;
		for(var t in voucherInfo.arr_goods){
			var d = voucherInfo.arr_goods[t];
			var name_ = "";
			if(d.name.length > print_voucher.ROW_WORD_COUNT){
				name_ = d.name.substring(0, print_voucher.ROW_WORD_COUNT);
			}else{
				name_ = d.name;
			}
			var split_line_height = 0;
			if(t_index == 1){
				split_line_height = print_voucher.LINE_HEIGHT_GAP;
			}
			printInfo.ticket_element.push({elementValue:(t_index +"." + name_), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - split_line_height)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			printInfo.ticket_element.push({elementValue:(d.count+" x "+parseFloat(d.price).toFixed(2)), x:115, y:yPos, font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			if(d.name.length > print_voucher.ROW_WORD_COUNT){
				var name_2 = d.name.substring(print_voucher.ROW_WORD_COUNT,d.name.length);
				printInfo.ticket_element.push({elementValue:("  " + name_2), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
			}
			//套餐子商品明细
			if(print_voucher.isPrintComboItemDetail() && $.isArray(d.arr_combo_item) && d.arr_combo_item.length > 0){
				$.each(d.arr_combo_item, function(_index, _item){
					var name_prefix = _item.name.trim().substring(0, print_voucher.ROW_WORD_COUNT), name_suffix = _item.name.trim().substring(print_voucher.ROW_WORD_COUNT);
					printInfo.ticket_element.push({elementValue:name_prefix, x:(print_voucher.ROW_MARGIN_LEFT + 10), y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
					printInfo.ticket_element.push({elementValue:("  x "+_item.count.trim()), x:115, y:yPos, font_size:fontSize, font_black:fontBlack, show_modle:showModle});
					if(name_suffix != ''){
						printInfo.ticket_element.push({elementValue:name_suffix, x:(print_voucher.ROW_MARGIN_LEFT + 10), y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
					}
				});
			}
			t_index++;
		}
		printInfo.ticket_element.push({elementValue:'------------------------------------', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		printInfo.ticket_element.push({elementValue:("总件数："+voucherInfo.total_count), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		printInfo.ticket_element.push({elementValue:("合计： "+parseFloat(voucherInfo.total_price).toFixed(2)), x:100, y:yPos, font_size:fontSize, font_black:fontBlack, show_modle:showModle});
		
	}
	printInfo.ticket_element.push({elementValue:'------------------------------------', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack,  show_modle:showModle});
	return yPos;
};



/**
 * 组装结尾信息
 */
print_voucher.print_end_info = function(type, voucherInfo, printInfo, yPos, fontSize, fontBlack, showModle){
	printInfo.ticket_element.push({elementValue:('交易流水号：'), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	printInfo.ticket_element.push({elementValue:(voucherInfo.tradeNo), x:(print_voucher.ROW_MARGIN_LEFT + 10), y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	printInfo.ticket_element.push({elementValue:('交易时间：' + voucherInfo.tradeTime), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	printInfo.ticket_element.push({elementValue:('终端：' + voucherInfo.terminalCode), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});	
	printInfo.ticket_element.push({elementValue:('收银员：' + voucherInfo.cashier), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	
	// if(type == 1){
	// 	for(var j in voucherInfo.salesVoucherList){
	// 		var ad = voucherInfo.salesVoucherList[j];
	// 		if(ad.adType === '1' && ad.status === '1'){
	// 			printInfo.ticket_element.push({elementValue:'------------------------------------', x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	// 			printInfo.ticket_element.push({elementValue:ad.title, x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:23, font_black:fontBlack, show_modle:showModle});
	// 			var heigth = print_voucher.ROW_HEIGHT_SMALL+15;
	// 			if( ad.infoType.trim() != '' && ad.infoType.trim() == 1 ){
	// 				heigth = 120;
	// 				printInfo.ticket_element.push({elementValue:ad.info, x:print_voucher.ROW_MARGIN_LEFT+30, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL+15)), font_size:fontSize, font_black:fontBlack, show_modle: ad.infoType.trim() });
	// 			}
	// 			for (var i = 0; i < ad.description.length/25; i++) {
	// 				if(i == 0)
	// 					printInfo.ticket_element.push({elementValue:ad.description.substring(i*25,i*25+25), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += heigth), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	// 				else
	// 					printInfo.ticket_element.push({elementValue:ad.description.substring(i*25,i*25+25), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	// 			}
	// 		}
	// 	}
	// 	var count = voucherInfo.count;
	// 	var avgNum = voucherInfo.avgNum;
	// 	var modn =  (count+1) % avgNum;
	// 	for(var j in voucherInfo.salesVoucherList){
	// 		var ad = voucherInfo.salesVoucherList[j];
	// 		if(ad.adType === '2' && ad.status === '1' && modn == 0){
	// 			printInfo.ticket_element.push({elementValue:ad.title, x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL - print_voucher.LINE_HEIGHT_GAP)+10), font_size:23, font_black:fontBlack, show_modle:showModle});
				
	// 			var heigth = print_voucher.ROW_HEIGHT_SMALL+15;
				
	// 			if(ad.infoType.trim() != '' && ad.infoType.trim() == 1){
	// 				heigth = 120;
	// 				printInfo.ticket_element.push({elementValue:ad.info, x:print_voucher.ROW_MARGIN_LEFT+30, y:(yPos += (print_voucher.ROW_HEIGHT_SMALL+15)), font_size:fontSize, font_black:fontBlack, show_modle:ad.infoType.trim() });	
	// 			}

	// 			for (var i = 0; i < ad.description.length/25; i++) {
	// 				if(i == 0)
	// 					printInfo.ticket_element.push({elementValue:ad.description.substring(i*25,i*25+25), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += heigth), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	// 				else
	// 					printInfo.ticket_element.push({elementValue:ad.description.substring(i*25,i*25+25), x:print_voucher.ROW_MARGIN_LEFT, y:(yPos += print_voucher.ROW_HEIGHT_SMALL), font_size:fontSize, font_black:fontBlack, show_modle:showModle});
	// 			}
	// 		}
	// 	}
	// }
	return yPos;
};


export default FormatterData 



