const util = {};

util.member_card_kind_code="STAR"; //EMP_WRITE_PWD 员工卡写卡  EMP_READ_PWD 员工卡读卡 

let readCardStatus =true; //读卡状态
let readKeyBoardStatus =true; //密码键盘状态
let readTicketStatus =true; //打票状态

//退出软件
util.quit=function (){
	if(typeof(app)=="undefined"){
		alert("浏览器不支持此功能")
		return false
	}else{
		if(!app.sendMessage){
			alert("浏览器不支持此功能")
			return false
		}
	}
    app.setMessageCallback('exitapp_reponse', function (name, args){

    });
    var callbackname='exitapp_reponse';
    var type = 'exitapp';
    var sPrintData = '';
    app.sendMessage('Common_REQUEST', [callbackname, type, sPrintData]);
} 
//最小化
util.toMinimize=function (){
	if(typeof(app)=="undefined"){
		alert("浏览器不支持此功能")
		return false
	}else{
		if(!app.sendMessage){
			alert("浏览器不支持此功能")
			return false
		}
	}
	var callbackname='Common_REQUEST_001';//回调函数
	var type = 'miniapp';
	var requestdata = '';
	app.sendMessage('Common_REQUEST', [callbackname, type, requestdata]);
}
/**
 * 票类打印
 * @param type string // 票类型 coupon_print 票券打印;bill_print 小票打印;film_print 影票打印
 * @param printData object //票数据
 * @param configData object //终端配置
 * @callback function //回调函数
 */
util.printFilmTicketCount = 1;//打印的影票数量
util.printTicket=function(type,printData,configData,callback){
	if (typeof(app) == 'undefined'){
		callback("浏览器不支持此功能");
		return;
	}else{
		if(!app.sendMessage){
			callback("浏览器不支持此功能");
			return;
		}
	}
	if(!readTicketStatus){
		callback("正在打票中");
		return
	}
	readTicketStatus=false
	if(!type && (type!="film_print"||type!="bill_print"||type!="coupon_print")){
		callback("打票类型有误");
		return;
	}
	//根据偏移量重构数据
	if(type=="film_print"){
		let x_w = configData.film_print_offset.x;//x偏移量
		let y_w =configData.film_print_offset.y;//y偏移量
		let zoomX = 1;//横向放大系数
		let zoomY = 1;//纵向放大系数
		if(printData.ticket_element && printData.ticket_element.length >0){
			for(var item in printData.ticket_element){
				printData.ticket_element[item].x = printData.ticket_element[item].x * zoomX + parseInt(x_w);
				printData.ticket_element[item].y = printData.ticket_element[item].y * zoomY + parseInt(y_w);
			}
		}
	}
	if (!configData){
		callback("终端数据为空");
		return;
	}
	if (!printData){
		callback("打印数据为空");
		return;
	}
	let printObject= configData[type]
	
	if(!printObject){
		callback("找不到打印终端配置项");
		return;
	}
	let printCode=getPrintCode(printObject)//打印机打印码
	if (printCode == null){
		callback('未找到打印机.');
		return;
	}
	let callbackName=getCallbackName(type)//回调名
	let newPrintData=getPrintData(printData)//打印数据

	//向外壳发送数据
	app.sendMessage('Ticket_Print_REQUEST',[callbackName, newPrintData,printCode]);
	
	try {
		app.setMessageCallback(callbackName, function (name, args){
			readTicketStatus=true
			callback(args);
		});
	} catch (error) {
		readTicketStatus=true
		callback(error);
	}
}

//获取重组数据
function getPrintData(printData){
	return JSON.stringify(printData)
}
//获取回调函数名
function getCallbackName(type){
	if(type=="film_print") {
		let cbName = 'func_' + (new Date()).getTime() + (util.printFilmTicketCount++);
		if (util.printFilmTicketCount > 65536){
			util.printFilmTicketCount = 1;
		}
		return cbName
	} 
	// else if(type=="bill_print") {
	// 	return 'func_' + (new Date()).getTime() + newGuid();
	// } 
	// else if(type=="coupon_print") {
	// 	return 'func_' + (new Date()).getTime() + newGuid();
	// }
	return 'func_' + (new Date()).getTime() + newGuid();
}
//获取打印机打印码
function getPrintCode(printObject){
	let printCode=null//打印机打印码
	for (let i = 0 ; i < printObject.length ; i++){
		if (printObject[i].selected){
			printCode = printObject[i].code;
			break;
		}
	}
	if(printCode==null && printObject.length > 0){
		printCode=printObject[0].code
	}
	return  printCode
}
//生成唯一Guid
function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}
/**
 * 操作密码键盘
 * @param type string // 操作键盘类型 open 打开密码键盘; close 关闭密码键盘
 * @param configData object //终端配置
 * @callback function //回调函数
 */
util.secKeyBoard= function(type,configData,callback){
	if (typeof(app) == 'undefined'){
		callback("浏览器不支持此功能");
		return;
	}else{
		if(!app.sendMessage){
			callback("浏览器不支持此功能");
			return;
		}
	}
	if(readKeyBoardStatus){
		readKeyBoardStatus=false
	}else{
		callback("密码键盘开启中");
		return
	}
	if(!type && (type!="open"||type!="close")){
		callback("操作键盘类型有误");
		return;
	}
	if (!configData){
		callback("终端数据为空");
		return;
	}
	let callbackName=getCallbackName()//回调名
	let pwd=""//密码
	let initPwd=""//初始密码
	let keyboardObject = configData.keyboard//终端键盘配置
	if (!keyboardObject){
		callback("找不到键盘终端配置项");
		return;
	}
	let keyBoardCode=getPrintCode(keyboardObject)//键盘配置码
	if(!keyBoardCode){
		callback("未找到键盘");
		return;
	}
	if(type=="close"){
		keyBoardCode =keyBoardCode + "_CLOSE"
	}

	//向外壳发送数据
	app.sendMessage('SecKeyBoard_Input_REQUEST', [callbackName,keyBoardCode]);

	try {
		app.setMessageCallback(callbackName, function (name, args){
			readKeyBoardStatus=true
			callback(args)
		})
	} catch (error) {
		readKeyBoardStatus=true
		callback(error)
	}
	
	
}
/**
 * 餐卡读卡器读卡方法
 * @param {} callBack
 */
util.readCard2 = function (callBack){
	var callbackname = 'func' + (new Date()).getTime() + (newGuid());
	var result = {};
	//typeof app == "undefined"
	if(false){
		result.status = -1;
		result.msg = "浏览器不支持访问硬件设备";
		callBack(result);
		return;
	}else{
		getDevice(0,function(device){
			    alert('88888888888888885555555555555=============');
			    alert(device);
			    alert(device.code.split('&')[0]);
			    alert(device.pwd);
			    
				if(device == null){
					result.status = -1;
					result.msg = "找不到合适的设备";
					callBack(result);
				}else{
					if(!is_reading_member){
						is_reading_member = true;
						app.setMessageCallback(callbackname, function (status,args) {
							alert('-------------------------------------------------');
							alert(status);
							alert(args);
							if(args){
							   if(args.length>0){
								   if(args[0]==0){
									   result.status = 0;
									   result.data = args[1];
								   }else{
									   result.status = -1;
									   result.msg = args[1];
								   }
							   }else{
								   result.status = -1;
								   result.msg = "系统异常，请联系管理员";
							   }
							}else{
							    result.status = -1;
							    result.msg = "系统异常，请联系管理员";
							}
							//重新赋值默认为"大地会员卡"
							util.member_card_kind_code="STAR";
							is_reading_member = false;
							callBack(result);
							alert("---->读餐卡返回状态:--->"+device.code+"------->"+device.pwd+"------>"+result.status+"---->"+result.data+"------>"+result.msg);
						});
						app.sendMessage('Card_ReadSN_REQUEST', [callbackname, device.code.split('&')[0]]);
					}
				}
		
		});
	
	}	

};
/**
 * 长城读卡器读卡方法
 * @param {} callBack
 */
util.readCard1 = function (callBack){
	var callbackname = 'func' + (new Date()).getTime() + (newGuid());
	var result = {};
	//typeof app == "undefined"
	if(false){
		result.status = -1;
		result.msg = "浏览器不支持访问硬件设备";
		callBack(result);
		return;
	}else{
		getDevice(0,function(device){
			    alert('88888888888888885555555555555=============');
			    alert(device);
			    alert(device.code.split('&')[1]);
			    alert(device.pwd);
			    
				if(device == null){
					result.status = -1;
					result.msg = "找不到合适的设备";
					callBack(result);
				}else{
					if(!is_reading_member){
						is_reading_member = true;
						app.setMessageCallback(callbackname, function (name, args) {
							var data = args[0].toString();
							alert('-------------------------------------------------');
							alert(args);
							alert(data);
							if(data == "-1"){
							   result.status = -1;
							   result.msg = args[1].toString();
							   if(result.msg.trim() == ''){
							   		result.msg = "系统异常，请联系管理员";
							   }
							}else{
							   result.status = 0;
							   result.data = args[0].toString();
							}
							//重新赋值默认为"大地会员卡"
							util.member_card_kind_code="STAR";
							is_reading_member = false;
							callBack(result);
							alert("---->读卡返回状态:--->"+device.code+"------->"+device.pwd+"------>"+result.status+"---->"+result.data+"------>"+result.msg);
						});
						app.sendMessage('Card_ReadNum_REQUEST', [callbackname, device.code.split('&')[1], device.pwd]);
					}
				}
		
		});
	
	}	

};
/**
 * 读卡方法
 * @param configData object //终端配置
 * @callback function //回调函数
 */
util.readCard = function (configData,callBack){
	if (typeof(app) == 'undefined'){
		callBack("浏览器不支持此功能");
		return;
	}else{
		if(!app.sendMessage){
			callBack("浏览器不支持此功能");
			return;
		}
	}
	if(readCardStatus){
		readCardStatus=false
	}else{
		callback("正在读卡中");
		return
	}
	if (!configData){
		callBack("终端数据为空");
		return;
	}
	let cardReadObject = configData.card_reader//终端读卡配置
	if (!cardReadObject){
		callback("找不到读卡器终端配置项");
		return;
	}
	var callbackName = getCallbackName()//函数名
	let pwd="383333333030"//密码
	let initPwd="FFFFFFFFFFFF"//初始密码
	let printCode=getPrintCode(cardReadObject)//读卡器码
	if (printCode == null){
		callback('未找到读卡器');
		return;
	}
	//向外壳发送数据
	if(printCode=='FHJY&GWI-60BR'){
		app.sendMessage('Card_ReadNum_REQUEST', [callbackName,printCode.split('&')[0],pwd]);
	}else{
		app.sendMessage('Card_ReadNum_REQUEST', [callbackName,printCode,pwd]);
	}

	try {
		app.setMessageCallback(callbackName, function (name, args) {
			readCardStatus=true
			callBack(args);
		});
	} catch (error) {
		readCardStatus=true
		callBack(error);
	}
		
};
/**
 * 写卡方法
 * @param configData object //终端配置
 * @callback function //回调函数
 */
util.writeCard=function(configData,callBack) {
	if (typeof(app) == 'undefined'){
		callBack("浏览器不支持此功能");
		return;
	}else{
		if(!app.sendMessage){
			callBack("浏览器不支持此功能");
			return;
		}
	}
	if (!configData){
		callBack("终端数据为空");
		return;
	}else{
		if(!configData.card_reader){
			callBack("读卡终端数据为空");
			return;
		}
	}
	let callbackName = getCallbackName()//回掉函数名
	let pwd="383333333030";//密码
	let initPwd="FFFFFFFFFFFF";//初始密码
	let cardNum="Zy4vZtBgzc1rjjb";//卡号
	let sNewPassword = '';
	let sNewCardType = '';
	let sNewSecNo = '123456';
	let readCardCode =getPrintCode(configData.card_reader)//读卡器打印码
	//向外壳传送数据	
	app.sendMessage('Card_WriteNum_REQUEST', [callbackName, readCardCode, pwd, cardNum, sNewPassword, sNewCardType, sNewSecNo]);
	try{
		app.setMessageCallback(callbackName, function (name, args) {
		//如果返回1  代表写卡成功  则用ajax方式 请求服务器后台  将会员卡的状态改成已写卡。
		callBack(args)
		});
	} catch(e) {
		callBack(e)
	}
}
/**
 * 重置卡密码
 * @param configData object //终端配置
 * @callback function //回调函数
 */
//
util.resetCardPwd=function(configData,callBack){
	if (typeof(app) == 'undefined'){
		callBack("浏览器不支持此功能");
		return;
	}
	if (!configData){
		callBack("终端数据为空");
		return;
	}else{
		if(!configData.card_reader){
			callBack("读卡终端数据为空");
			return;
		}
	}
	let callbackName= getCallbackName()//回掉函数名
	let callbackName2= getCallbackName()//回掉函数名2
	let pwd="383333333030"//密码
	let initPwd="FFFFFFFFFFFF"//初始密码
	let readCardCode =getPrintCode(configData.card_reader)//读卡器打印码
	//向外壳传送数据	
	app.sendMessage('Common_ChangeCardPwd_REQUEST', [callbackName, readCardCode, initPwd, pwd]);
	app.setMessageCallback(callbackName, function (name, args) {
			
		if(args[0] == 0){//表示修改密码成功  说明该卡是新卡 不用后续操作了。
			callBack(args)
		} else{//表示该卡 不是新卡 需要在判断
			app.sendMessage('Common_ChangeCardPwd_REQUEST', [callbackName2,readCardCode, pwd, pwd]);
			app.setMessageCallback(callbackName2, function (u_name, u_args) {
				callBack(u_args)
			});
		}
  	});
}
/**
 * 获取外壳配置的读卡器类型
 * @param cardReaderData 读卡终端数据
 */
util.reIntitReadCard = function (cardReaderData){
	let device=null//测试
	if(cardReaderData.length>0){
		for(let i = 0;i<cardReaderData.length;i++){
			let cardReaderItem = cardReaderData[i];
			let selected = cardReaderItem.selected;
			let _success = false;
			if(typeof selected == 'string'){
				_success = (selected == "true");
			}else{
				_success = selected;
			}
			if(_success){
				device = {};
				device.name = cardReaderItem.name;
				device.code = cardReaderItem.code;
			}
		}
		//如果驱动等于null，默认取第一个
		if(device == null){
			device = {};
			device.name = cardReaderData[0].name;
			device.code = cardReaderData[0].code;
		}
	}
	return device
};
/**
 * 获得设备
 * @param {} type 0 读卡器 1 打印机 2 密码键盘 4钱箱 5银联pos机类型 6银联pos机端口
 */
function getDevice(type, callback) {

    readTerminalParameter(function (result) {
        alert("进入获取硬件信息方法");
        alert("type===" + type);
        alert(result)
        //获得读卡密码
        if (type == 0 || type == 2) {
            alert("获取读卡器硬件信息");
            //获得密码
            var kindCode = util.member_card_kind_code;
            var memberCardKindCodeObj = getSession(kindCode);
            alert("memberCardKindCodeObj====" + memberCardKindCodeObj);
            if (memberCardKindCodeObj == null) {
                var postData = "kind_code=" + kindCode;
                alert("postData===" + postData);
                //通过Code获得密码
                // 加载静态数据
                var requestparameter = {
                    url: "cms.basis.common.GetMemberCardKind",
                    data: postData,
                    async: false,
                    request: 'data',
                    success: function (json) {
						alert("退票打印2");
                        if ($.trim(json) != null) {

                            var pwd = json.result.cardAuthPwd;
                            var initPwd = json.result.cardAuthInitPwd;
                            alert("读卡密码=====" + pwd);
                            //放入session
                            putSession(kindCode, json);
                            getDeviceObject(type, result, pwd, initPwd, callback);
                            alert("退票打印5");
                        } else {
                            callback(null);
                        }
                    }
                };
                ajax_request(requestparameter); // 提交请求		
            } else {
                //如果可以拿到值，就直接掉获取驱动方法
                getDeviceObject(type, result, memberCardKindCodeObj.result.cardAuthPwd, null, callback);
            }
            alert("完成获取读卡器硬件信息");
        } else {
            alert("获取读卡器以外的硬件信息");
            //如果可以拿到值，就直接掉获取驱动方法
            getDeviceObject(type, result, null, null, callback);

        }
    });
}
/**
 * 5银联pos机类型 6银联pos机端口
 * @param type
 * @param result
 * @param pwd
 * @param initPwd
 * @param callback
 * @return
 */
function getDeviceObject(type, result, pwd, initPwd, callback) {
    var device = null;
	//读卡器
    if (type == 0) {
        var cardReaders = result.card_reader;
        if (cardReaders == null && cardReaders.length == 0) {
            callback(null);
        } else {
            for (var i = 0; i < cardReaders.length; i++) {
                var cardReader = cardReaders[i];
                var selected = cardReader.selected;
                var _success = false;
                if (typeof selected == 'string') {
                    _success = (selected == "true");
                } else {
                    _success = selected;
                }


                if (_success) {
                    device = {};
                    device.name = cardReader.name;
                    device.code = cardReader.code;
                    device.pwd = pwd;
                    device.initPwd = initPwd;
                }

            }
            //如果驱动等于null，默认取第一个
            if (device == null) {

                device = {};
                device.name = cardReaders[0].name;
                device.code = cardReaders[0].code;
                device.pwd = pwd;
                device.initPwd = initPwd;

            }

            callback(device);

        }


    }
    //打印机
    else if (type == 1) {
        alert("退票打印3");
        var filmsPrint = result.film_print;

        if (filmsPrint == null && filmsPrint.lengtg == 0) {
            callback(null);
        } else {
            for (var i = 0; i < filmsPrint.length; i++) {
                var filmPrint = filmsPrint[i];
                var selected = filmPrint.selected;
                var _success = false;
                if (typeof selected == 'string') {
                    _success = (selected == "true");
                } else {
                    _success = selected;
                }
                if (_success) {
                    device = {};
                    device.name = filmPrint.name;
                    device.pwd = pwd;
                    device.code = filmPrint.code;
                }
                alert("退票打印4");
            }

            //如果驱动等于null，默认取第一个
            if (device == null) {

                device = {};
                device.name = filmsPrint[0].name;
                device.code = filmsPrint[0].code;
                device.pwd = pwd;
                device.initPwd = initPwd;

            }


            callback(device);
        }
    }
    //密码键盘
    else if (type == 2) {

        var keyboard = result.keyboard;

        if (keyboard == null && keyboard.lengtg == 0) {

            callback(null);

        } else {

            for (var i = 0; i < keyboard.length; i++) {

                var keyboardrs = keyboard[i];

                var selected = keyboardrs.selected;

                var _success = false;
                if (typeof selected == 'string') {
                    _success = (selected == "true");

                } else {
                    _success = selected;
                }

                if (_success) {
                    device = {};

                    device.name = keyboardrs.name;
                    device.code = keyboardrs.code;
                    device.pwd = pwd;


                }

            }

            //如果驱动等于null，默认取第一个
            if (device == null) {

                device = {};
                device.name = keyboard[0].name;
                device.code = keyboard[0].code;
                device.pwd = pwd;
                device.initPwd = initPwd;

            }
            callback(device);

        }
    }
    //小票打印
    else if (type == 3) {

        var printProofs = result.bill_print;

        if (printProofs == null && printProofs.length == 0) {

            callback(null);

        } else {
            for (var i = 0; i < printProofs.length; i++) {

                var printProof = printProofs[i];

                var selected = printProof.selected;

                var _success = false;
                if (typeof selected == 'string') {
                    _success = (selected == "true");

                } else {
                    _success = selected;
                }

                if (_success) {
                    device = {};

                    device.name = printProof.name;
                    device.code = printProof.code;
                    device.pwd = pwd;


                }

            }

            //如果驱动等于null，默认取第一个
            if (device == null) {

                device = {};
                device.name = printProofs[0].name;
                device.code = printProofs[0].code;
                device.pwd = pwd;
                device.initPwd = initPwd;

            }
            callback(device);

        }
    }
    //钱箱
    else if (type == 4) {
        alert("钱箱");
        var cashBox = result.cash_box;
        if (cashBox == null && cashBox.length == 0) {
            callback(null);
        } else {
            for (var i = 0; i < cashBox.length; i++) {
                var cb = cashBox[i];
                var selected = cb.selected;
                var _success = false;
                if (typeof selected == 'string') {
                    _success = (selected == "true");
                } else {
                    _success = selected;
                }
                if (_success) {
                    device = {};
                    device.name = cb.name;
                    device.pwd = pwd;
                    device.code = cb.code;
                }
                alert("钱箱5");
            }
			//如果驱动等于null，默认取第一个
			
            if (device == null) {
                device = {};
                device.name = cashBox[0].name;
                device.code = cashBox[0].code;
                device.pwd = pwd;
                device.initPwd = initPwd;
			}
			window.$appConfigData="device"
			
            callback(device);
        }
    }
    //银联pos机类型
    else if (type == 5) {
		alert("银联pos机类型");
		
        var POSTypeList = rs.pos_type; //银行卡支付对接POS类型
        if (POSTypeList == null || POSTypeList.length == 0) {
            callback(null);
        } else {
            for (var i = 0; i < POSTypeList.length; i++) {
                var cb = POSTypeList[i];
                var selected = cb.selected;
                var _success = false;
                if (typeof selected == 'string') {
                    _success = (selected == "true");
                } else {
                    _success = selected;
                }
                if (_success) {
                    device = {};
                    device.name = cb.name;
                    device.pwd = pwd;
                    device.code = cb.code;
                }
                alert("钱箱5");
            }
			//如果驱动等于null，默认取第一个
			
            if (device == null) {
                device = {};
                device.name = POSTypeList[0].name;
                device.code = POSTypeList[0].code;
                device.pwd = pwd;
                device.initPwd = initPwd;
			}
            callback(device);
        }
    }
    //银联pos机类型 端口
    else if (type == 6) {
        alert("银联pos机类型 端口");
        var pos_com = rs.pos_com; //通讯端口
        if (pos_com == null) {
            callback(null);
        } else {
            device = {};
            device.name = "";
            device.pwd = pwd;
            device.code = pos_com;

            alert("银联pos机类型 端口");
            //如果驱动等于null，默认取第一个
            if (device == null) {
                device = {};
                device.name = "";
                device.code = pos_com;
                device.pwd = pwd;
                device.initPwd = initPwd;
            }
            callback(device);
        }
    }

}
/**
 * 读取终端参数配置
 * @param callback 接收参数的回调方法
 */
util.readTerminalParameter=function(callback){
	if (typeof(callback) != 'function'){
		return;
	}
	if (typeof(app) != "undefined" && app.setMessageCallback){
		var callbackname='readconfig_reponse_' + (newGuid());
		//向外壳发送数据
		app.setMessageCallback(callbackname, function (name, args) {
			if(args[0]==0){
				let rs = JSON.parse(args[2]);
				var filmPrintOffset = rs.film_print_offset;
				if(typeof(filmPrintOffset) == "undefined" || filmPrintOffset == null){
					var o = {
						x: 0 //X坐标偏移量
						,y: 0//Y坐标偏移量
					};
					rs.film_print_offset = o;
				}
				callback(rs);
			}
			else{
				callback(args);
			}
		});		
		var type = 'pos';
		app.sendMessage('Common_DataRead_REQUEST', [callbackname, type]);
	} else{
		//如果是浏览器上运行，以下提供虚拟静态数据
		var result = null;
		result = {
			film_print_offset:{	//影票打印机偏移坐标
				x:0 //X坐标偏移量
				,y:0//Y坐标偏移量
			}
			,bill_print:[ { "code": "Send To OneNote 2016", "name": "Send To OneNote 2016", "selected": false }, { "code": "Microsoft XPS Document Writer", "name": "Microsoft XPS Document Writer", "selected": true }, { "code": "Microsoft Print to PDF", "name": "Microsoft Print to PDF", "selected": false }, { "code": "Fax", "name": "Fax", "selected": false } ]
			,card_reader:[ { "code": "S8", "name": "峰华_S8", "selected": false }, { "code": "E7", "name": "峰华_E7", "selected": true }, { "code": "Z9", "name": "德卡_Z9", "selected": false }, { "code": "QM8", "name": "德卡_QM8", "selected": false }, { "code": "QM8_OSK", "name": "德卡_QM8_OSK", "selected": false }, { "code": "FKSF2", "name": "方卡_SF2", "selected": false }, { "code": "FKSF2C", "name": "方卡_SF2C", "selected": false }, { "code": "TYRM", "name": "明华_R330", "selected": false }, { "code": "FHJY", "name": "德生F3RF", "selected": false }, { "code": "FHJY&GWI-60BR", "name": "德生F3RF+长城GWI-60BR", "selected": false }, { "code": "SENOR", "name": "星乔读卡器", "selected": false } ] 
			,cash_box:[ { "code": "Send To OneNote 2016", "name": "Send To OneNote 2016", "selected": false }, { "code": "Microsoft XPS Document Writer", "name": "Microsoft XPS Document Writer", "selected": false }, { "code": "Microsoft Print to PDF", "name": "Microsoft Print to PDF", "selected": false }, { "code": "Fax", "name": "Fax", "selected": false }, { "code": "COM3", "name": "COM3", "selected": true } ] 
			,coupon_print:[ { "code": "Send To OneNote 2016", "name": "Send To OneNote 2016", "selected": false }, { "code": "Microsoft XPS Document Writer", "name": "Microsoft XPS Document Writer", "selected": false }, { "code": "Microsoft Print to PDF", "name": "Microsoft Print to PDF", "selected": true }, { "code": "Fax", "name": "Fax", "selected": false } ] 
			,film_print:[ { "code": "Send To OneNote 2016", "name": "Send To OneNote 2016", "selected": true }, { "code": "Microsoft XPS Document Writer", "name": "Microsoft XPS Document Writer", "selected": false }, { "code": "Microsoft Print to PDF", "name": "Microsoft Print to PDF", "selected": false }, { "code": "Fax", "name": "Fax", "selected": false } ] 
			,keyboard:[ { "code": "E7", "name": "峰华_E7", "selected": false }, { "code": "Z9", "name": "德卡_Z9", "selected": false }, { "code": "CM511", "name": "辰明_CM511", "selected": false }, { "code": "CM512", "name": "辰明_CM512", "selected": false }, { "code": "Numeric Keypad", "name": "标准键盘", "selected": true } ] 
			,counter_type:[{code:'movie',selected:false},{code:'goods',selected:false},{code:'both',selected:true}]
			,meal_preparation:[{"code":"0","selected":false},{"code":"1","selected":true}],"pos_show_type":[{"code":" ","name":"无客显","selected":true},{"code":"ZHONGQI","name":"中崎","selected":false},{"code":"XINGQIAO","name":"星乔","selected":false}]
			,pos_show_type:[{"code":"ZHONGQI","name":"中崎","selected":false},{"code":"XINGQIAO","name":"星乔","selected":false}]
			,pos_type:[{"code":"2","name":"不对接","selected":true},{"code":"0","name":"快钱POS机","selected":false},{"code":"1","name":"杉德POS机","selected":false}]
			,print_voucher:[{"code":"0","selected":false},{"code":"1","selected":true}]
		};
		callback(result);
	}
}
/**
 * 写入终端参数配置
 * @param json 保存数据对象
 * @param callback 接收参数的回调方法
 */
util.writeTerminalParameter=function(json,callback){
	if (typeof(app) == 'undefined'){
		callback("浏览器不支持此功能");
		return;
	}else{
		if(!app.sendMessage){
			callback("浏览器不支持此功能");
			return;
		}
	}
	if (!json){
		callback("写入数据为空");
		return;
	}
	var callbackname='writeconfig_reponse_'+newGuid();//回调名
	//向外壳发送数据
	var type = 'pos';//写入类型
	var requestdata = JSON.stringify(json);//写入数据
	app.sendMessage('Common_DataWrite_REQUEST', [callbackname, type, requestdata]);
	
	app.setMessageCallback(callbackname, function (name, args) {
		if(args[0]==0){
			callback(args);
		}else{
			callback(args);
		}
	});
	
}


export default util