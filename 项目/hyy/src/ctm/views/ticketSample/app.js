import $ from "jquery"
const util = {};
// const HTTP_SERVER_ICE_URL = null;// 为了解决本地测试问题 on
// HTTP_SERVER_ICE_URL = "http://192.168.100.121:10468/cms-bls-3.0.1/bls";
let comm_dialog_array = new Array(); // 2014-02-28 by
let current_database_datetime = new Date().getTime();

util.member_card_kind_code = "STAR"; //EMP_WRITE_PWD 员工卡写卡  EMP_READ_PWD 员工卡读卡 

let is_reading_pwd = false; //是否正在读密码
let is_reading_member = false; //是否正在读会员卡
// let jContextPath =""

/**
 * 打印电影票
 * @param 
 * {
 * 		width: 影票宽度
 *  	,height:影票高度
 *  	,print_method:1|0 打印方向 1-> 横向打印 0表示纵向打印
 *  	,ticket_element:[		影票元素集合
 *  		{
 *  			x:X坐标
 *  			,y:Y坐标
 *  			,elementValue:打印值
 *  			,font_size:字体大小
 *  			,font_black:是否加粗 (1为加粗)
 *  			,show_modle:展示模式 1->文本  0->二维码 2->二维码 
 *  		}
 *  		,{
 *  			x:X坐标
 *  			,y:Y坐标
 *  			,elementValue:打印值
 *  			,font_size:字体大小
 *  			,font_black:是否加粗 (1为加粗)
 *  			,show_modle:展示模式 1->文本  0->二维码 2->二维码 
 *  		}
 *  	]
 * }
 * @param callback 影票打印回调方法 function(result) result="0" 表示成功 ，否则表示失败原因
 */
/**


/**退出软件**/
util.quit = function () {
    if (typeof (app) == "undefined") {
        alert("浏览器不支持此功能")
        return false
    }
    app.setMessageCallback('exitapp_reponse', function (name, args) {
        //document.getElementById('result').value = args[0].toString();
    });

    var callbackname = 'exitapp_reponse';
    var type = 'exitapp';
    var sPrintData = '';

    app.sendMessage('Common_REQUEST', [callbackname, type, sPrintData]);
}

//最小化
util.toMinimize = function () {
    if (typeof (app) == "undefined") {
        alert("浏览器不支持此功能")
        return false
    }
    var callbackname = 'Common_REQUEST_001'; //回调函数
    var type = 'miniapp';
    var requestdata = '';
    app.sendMessage('Common_REQUEST', [callbackname, type, requestdata]);
}

/**
 * 开钱箱方法
 * @param {} callBack
 */
util.openCashBox = function (callBack) {
    alert("open cash...............");
    if (typeof app != "undefined") {
        getDevice(4, function (device) {
            var callbackname = 'func' + (new Date()).getTime() + (newGuid());
            var port = device.code; //端口号
            app.sendMessage('CashBox_Open_REQUEST', [callbackname, port]);
            app.setMessageCallback(callbackname, function (name, args) {
                var data = args[0].toString();
                if (data == "-1") {
                    data.status = -1;
                    data.msg = args[1].toString();
                    if ($.trim(data.msg) == '') {
                        data.msg = "系统异常，请联系管理员";
                    }
                } else {
                    data.status = 0;
                    data.data = args[0].toString();
                }
                if (typeof callBack == 'function') {
                    callBack(data);
                }
            });

        });
    }
};
util.terminalConfig = function () {
    return {
        getTerminalCode: function () {
            return sessionStorage.getItem("terminal_code");
        },
        readTerminalType: function (callBack) {
            if (typeof (app) != "undefined") {
                alert("----->通过外壳读取终端类型");
                var callbackname = 'readType_reponse' + (new Date()).getTime() + (newGuid());
                /*if (count > 65535) {
			   				count = 1;
			   			}*/
                var type = 'terminaltype';
                var result = {};

                // 回调函数
                app.setMessageCallback(callbackname, function (name, args) {
                    //0为成功读取终端类型
                    result.status = "0"; //args[0].toString();
                    result.msg = args[1].toString();
                    result.data = "0"; //args[2].toString(); 
                    //alert("函数返回读取终端类型："+result.status+"::"+result.msg+"::"+result.data);
                    callBack(result);

                });
                app.sendMessage('Common_DataRead_REQUEST', [callbackname, type]);
            } else {
                alert("----->通过浏览器访问，终端类型为101(pos)");
                var result = {};
                result.status = '0';
                result.data = '101';
                callBack(result);
            }
        },
        readTerminalCode: function (callBack) {
            if (typeof (app) != "undefined") {
                alert("----->通过外壳读取终端编号");
                var callbackname = 'readconfig_reponse' + (new Date()).getTime() + (newGuid());
                var type = 'terminalno';
                var result = {};

                // 回调函数
                app.setMessageCallback(callbackname, function (name, args) {
                    alert('成功读取终端编号....................................>' + args);
                    //0为成功读取终端编号
                    result.status = args[0].toString();
                    result.data = args[2].toString();
                    callBack(result);
                    alert('回调成功...........');
                });
                app.sendMessage('Common_DataRead_REQUEST', [callbackname, type]);
            } else {
                alert("----->通过浏览器访问，终端编号写定为1000001");
                var result = {};
                result.status = '0';
                result.data = '100001';
                callBack(result);
            }
        },
        writeTerminalCode: function (code, callBack) {

            if (typeof (app) != "undefined") {
                alert("----->通过外壳往本地配置文件写入终端编号");
                var callbackname = 'writeconfig_reponse' + (new Date()).getTime() + newGuid();
                var type = 'terminalno';
                var code = code;
                var requestdata = '{\"terminalno\":' + '\"' + code + '\"}';
                var result = {};

                // 回调函数
                app.setMessageCallback(callbackname, function (name, args) {
                    //0为成功写入终端编号
                    result.status = args[0].toString();
                    result.msg = args[1].toString();
                    callBack(result);
                });
                app.sendMessage('Common_DataWrite_REQUEST', [callbackname, type, requestdata]);
            } else {
                alert("----->通过浏览器访问，不需要写入终端编号");
                var result = {};
                result.status = '0';
                callBack(result);
            }
        }
    };
}();

/**
 * 测试打票打印
 * @param type string // 票类型 coupon_print 票券打印;bill_print 小票打印;film_print 影票打印
 * @param printData object //票数据
 * @param configData object //终端配置
 * @callback function //回调函数
 */
util.printFilmTicketCount = 1; //打印的影票数量
util.printTicket = function (type, printData, configData, callback) {
    // if (typeof(app) == 'undefined'){
    // 	callback("浏览器不支持此功能");
    // 	return;
    // }
    if (!type && (type != "film_print" || type != "bill_print" || type != "coupon_print")) {
        callback("打票类型有误");
        return;
    }
    //根据偏移量重构数据
    if (type == "film_print") {
        let x_w = configData.film_print_offset.x;
        let y_w = configData.film_print_offset.y;
        let zoomX = 1; //横向放大系数
        let zoomY = 1; //纵向放大系数
        if (printData.ticket_element && printData.ticket_element.length > 0) {
            for (var item in printData.ticket_element) {
                printData.ticket_element[item].x = printData.ticket_element[item].x * zoomX + parseInt(x_w);
                printData.ticket_element[item].y = printData.ticket_element[item].y * zoomY + parseInt(y_w);
            }
        }
    }
    if (!printData) {
        callback("打印数据为空");
        return;
    }
    let printObject = configData[type]

    if (!printObject) {
        callback("找不到打印终端配置项");
        return;
    }
    let printCode = getPrintCode(printObject) //打印机打印码
    if (printCode == null) {
        callback('未找到打印机.');
        return;
    }
    let callbackName = getCallbackName(type) //回调名
    let newPrintData = getPrintData(printData) //打印数据
    console.log("printData", printData)
    // console.log("configData",configData)
    // console.log("printObject",printObject)
    // console.log("printCode",printCode)
    // console.log("callbackName",callbackName)

    window.$appConfigData = {
        // type:type,
        "printData": newPrintData,
        // "configData":configData,
        // "printObject":printObject,
        // "printCode":printCode,
        // "callbackName":callbackName,
    }
    //向外壳传送数据	
    try {
        app.setMessageCallback(callbackName, function (name, args) {
            callback(args);
        });
    } catch (e) {
        callback(e.description);
    }
    app.sendMessage('Ticket_Print_REQUEST', [callbackName, newPrintData, printCode]);
}
//获取打印机打印码

function getPrintData(printData) {
    alert(JSON.stringify(printData))
    return JSON.stringify(printData)
}
//获取打印机打印码

function getCallbackName(type) {
    if (type == "film_print") {
        let cbName = 'func_' + (new Date()).getTime() + (util.printFilmTicketCount++);
        if (util.printFilmTicketCount > 65536) {
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

function getPrintCode(printObject) {
    console.log(printObject)
    let printCode = null //打印机打印码
    for (let i = 0; i < printObject.length; i++) {
        if (printObject[i].selected) {
            printCode = printObject[i].code;
            break;
        }
    }
    if (printCode == null && printObject.length > 0) {
        printCode = printObject[0].code
    }
    return printCode
}
/**
 * 关闭密码键盘
 */
util.closePwd = function (callBack) {
    var callbackname = 'func' + (new Date()).getTime() + (newGuid());
    var result = {};
    if (typeof app == "undefined") {
        result.status = -1;
        result.msg = "浏览器不支持访问硬件设备";
        callBack(result);
        return;
    } else {
        alert("closePwd")
        getDevice(2, function (device) {
            if (device == null) {
                result.status = -1;
                result.msg = "找不到合适的设备";
                alert(status)
                alert("找不到合适的设备")
                callBack(result);
            } else {
                alert("sendMessage")
                app.sendMessage('SecKeyBoard_Input_REQUEST', [callbackname, device.code + "_CLOSE"]);
                is_reading_pwd = false;
            }

        });

    }
};
var xingxingcounts = 0;
/**
 * 读密码
 */
util.readPwd = function (callBack) {
    var callbackname = 'func' + (new Date()).getTime() + (newGuid());
    var result = {};
    if (typeof app == "undefined") {
        result.status = -1;
        result.msg = "浏览器不支持访问硬件设备";
        callBack(result);
        return;
    } else {
        getDevice(2, function (device) {
            if (device == null) {
                result.status = -1;
                result.msg = "找不到合适的设备";
                callBack(result);
            } else {
                //如果不是正在读密码状态，则启动读密码
                if (!is_reading_pwd) {
                    is_reading_pwd = true;

                    //每次输入密码之后回调方法
                    app.setMessageCallback(callbackname + 'consoleBack', function (name, args) {
                        alert('================------------===========');
                        alert(args);
                        alert(xingxingcounts);
                        alert(args[0].length);
                        $('.start-up-password section').show();
                        var passInput = args[0];
                        var len = passInput.length;
                        $('#numer').text('（已输入' + len + '位）');
                        var w = $(".ui-mm-box").width() - 10;
                        if (xingxingcounts < len || (len == 1 && xingxingcounts == 0)) { //输入
                            xingxingcounts++;
                            if (xingxingcounts <= 6) {
                                alert('===============88888888888888888888888888888888888');
                                $(".ui-mm-box").append("<li></li>");
                                $(".ui-mm-box li").css({
                                    "width": w / 6
                                });
                                $(".ui-mm-box li").eq(xingxingcounts - 1).addClass("ui-mm-d");
                            } else if (xingxingcounts == 7) {
                                $(".ui-mm-box").append("<li></li>");
                                $(".ui-mm-box li").css({
                                    "width": w / 7
                                });
                                $(".ui-mm-box li").eq(xingxingcounts - 1).addClass("ui-mm-d");
                            } else if (xingxingcounts == 8) {
                                $(".ui-mm-box").append("<li></li>");
                                $(".ui-mm-box li").css({
                                    "width": w / 8
                                });
                                $(".ui-mm-box li").eq(xingxingcounts - 1).addClass("ui-mm-d");
                            } else {
                                return false;
                            }
                        } else { //退格
                            alert('///////////////////666666*****************************');
                            if (xingxingcounts > 0) {
                                $(".ui-mm-box li").eq(xingxingcounts - 1).remove();
                                xingxingcounts--;
                            }
                        }
                    });
                    //回调
                    app.setMessageCallback(callbackname, function (name, args) {
                        var data = args[0].toString();
                        if (data == "-1") {
                            result.status = -1;
                            result.msg = args[1].toString();
                            if ($.trim(result.msg) == '') {
                                result.msg = "系统异常，请联系管理员";
                            }
                        } else {
                            result.status = 0;
                            result.data = args[0].toString();
                        }
                        is_reading_pwd = false;

                        //还原输入密码提示信息
                        $(".ui-mm-box li").remove();
                        $('#numer').text('（已输入0位）');
                        xingxingcounts = 0;
                        $('.start-up-password section').hide();
                        alert('uuuuuuuuuuuuuuuuuuuuuuu');
                        alert(xingxingcounts);
                        alert(result);
                        callBack(result);
                    });
                    app.sendMessage('SecKeyBoard_Input_REQUEST', [callbackname, device.code]);
                }
            }
        });
    }
};
/**
 * 餐卡读卡器读卡方法
 * @param {} callBack
 */
util.readCard2 = function (callBack) {
    var callbackname = 'func' + (new Date()).getTime() + (newGuid());
    var result = {};
    //typeof app == "undefined"
    if (false) {
        result.status = -1;
        result.msg = "浏览器不支持访问硬件设备";
        callBack(result);
        return;
    } else {
        getDevice(0, function (device) {
            alert('88888888888888885555555555555=============');
            alert(device);
            alert(device.code.split('&')[0]);
            alert(device.pwd);

            if (device == null) {
                result.status = -1;
                result.msg = "找不到合适的设备";
                callBack(result);
            } else {
                if (!is_reading_member) {
                    is_reading_member = true;
                    app.setMessageCallback(callbackname, function (status, args) {
                        alert('-------------------------------------------------');
                        alert(status);
                        alert(args);
                        if (args) {
                            if (args.length > 0) {
                                if (args[0] == 0) {
                                    result.status = 0;
                                    result.data = args[1];
                                } else {
                                    result.status = -1;
                                    result.msg = args[1];
                                }
                            } else {
                                result.status = -1;
                                result.msg = "系统异常，请联系管理员";
                            }
                        } else {
                            result.status = -1;
                            result.msg = "系统异常，请联系管理员";
                        }
                        //重新赋值默认为"大地会员卡"
                        util.member_card_kind_code = "STAR";
                        is_reading_member = false;
                        callBack(result);
                        alert("---->读餐卡返回状态:--->" + device.code + "------->" + device.pwd + "------>" + result.status +
                            "---->" + result.data + "------>" + result.msg);
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
util.readCard1 = function (callBack) {
    var callbackname = 'func' + (new Date()).getTime() + (newGuid());
    var result = {};
    //typeof app == "undefined"
    if (false) {
        result.status = -1;
        result.msg = "浏览器不支持访问硬件设备";
        callBack(result);
        return;
    } else {
        getDevice(0, function (device) {
            alert('88888888888888885555555555555=============');
            alert(device);
            alert(device.code.split('&')[1]);
            alert(device.pwd);

            if (device == null) {
                result.status = -1;
                result.msg = "找不到合适的设备";
                callBack(result);
            } else {
                if (!is_reading_member) {
                    is_reading_member = true;
                    app.setMessageCallback(callbackname, function (name, args) {
                        var data = args[0].toString();
                        alert('-------------------------------------------------');
                        alert(args);
                        alert(data);
                        if (data == "-1") {
                            result.status = -1;
                            result.msg = args[1].toString();
                            if ($.trim(result.msg) == '') {
                                result.msg = "系统异常，请联系管理员";
                            }
                        } else {
                            result.status = 0;
                            result.data = args[0].toString();
                        }
                        //重新赋值默认为"大地会员卡"
                        util.member_card_kind_code = "STAR";
                        is_reading_member = false;
                        callBack(result);
                        alert("---->读卡返回状态:--->" + device.code + "------->" + device.pwd + "------>" + result.status +
                            "---->" + result.data + "------>" + result.msg);
                    });
                    app.sendMessage('Card_ReadNum_REQUEST', [callbackname, device.code.split('&')[1], device.pwd]);
                }
            }

        });

    }

};
/**
 * 读卡方法
 * @param {} callBack
 */
util.readCard = function (callBack) {
    var callbackname = 'func' + (new Date()).getTime() + (newGuid());
    var result = {};
    //typeof app == "undefined"
    if (false) {
        result.status = -1;
        result.msg = "浏览器不支持访问硬件设备";
        callBack(result);
        return;
    } else {
        getDevice(0, function (device) {
            if (device == null) {
                result.status = -1;
                result.msg = "找不到合适的设备";
                callBack(result);
            } else {

                if (!is_reading_member) {

                    is_reading_member = true;
                    //回调
                    app.setMessageCallback(callbackname, function (name, args) {
                        var data = args[0].toString();
                        if (data == "-1") {
                            result.status = -1;
                            result.msg = args[1].toString();
                            if ($.trim(result.msg) == '') {
                                result.msg = "系统异常，请联系管理员"
                            }
                        } else {
                            result.status = 0;
                            result.data = args[0].toString();
                        }

                        //重新赋值默认为"大地会员卡"
                        util.member_card_kind_code = "STAR";

                        is_reading_member = false;

                        callBack(result);

                        alert("---->读卡返回状态:--->" + device.code + "------->" + device.pwd + "------>" + result.status +
                            "---->" + result.data + "------>" + result.msg);
                    });

                    //add by wxg
                    if (device.code == 'FHJY&GWI-60BR') {
                        app.sendMessage('Card_ReadNum_REQUEST', [callbackname, device.code.split('&')[0], device.pwd]);
                    } else {
                        app.sendMessage('Card_ReadNum_REQUEST', [callbackname, device.code, device.pwd]);
                    }
                }


            }

        });

    }

};
/**
 * 测试读卡方法
 * @param configData object //终端配置
 * @callback function //回调函数
 */
util.reReadCard = function (configData, callBack) {
    let is_reading_member = false
    var callbackname = 'func' + (new Date()).getTime() + (newGuid());
    var result = {};
    //typeof app == "undefined"
    //测试数据
    let pwd = "383333333030"
    let initPwd = "FFFFFFFFFFFF"
    if (false) {
        result.status = -1;
        result.msg = "浏览器不支持访问硬件设备";
        callBack(result);
        return;
    } else {
        getDeviceObject(0, configData, pwd, initPwd, function (device) {
            if (device == null) {
                result.status = -1;
                result.msg = "找不到合适的设备";
                callBack(result);
            } else {
                if (!is_reading_member) {
                    is_reading_member = true;
                    //回调
                    app.setMessageCallback(callbackname, function (name, args) {
                        var data = args[0].toString();
                        // window.$appConfigData=args
                        if (data == "-1") {
                            result.status = -1;
                            result.msg = args[1].toString();
                            if (result.msg.trim() == '') {
                                result.msg = "系统异常，请联系管理员"
                            }
                        } else {
                            result.status = 0;
                            result.data = args[0].toString();
                        }
                        //重新赋值默认为"大地会员卡"
                        util.member_card_kind_code = "STAR";

                        is_reading_member = false;
                        window.$appConfigData = {
                            name: name,
                            device: device,
                            result: result
                        }

                        callBack(result);

                        alert("---->读卡返回状态:--->" + device.code + "------->" + device.pwd + "------>" + result.status +
                            "---->" + result.data + "------>" + result.msg);
                    });

                    //add by wxg
                    if (device.code == 'FHJY&GWI-60BR') {
                        app.sendMessage('Card_ReadNum_REQUEST', [callbackname, device.code.split('&')[0], device.pwd]);
                    } else {
                        app.sendMessage('Card_ReadNum_REQUEST', [callbackname, device.code, device.pwd]);
                    }
                }


            }

        });

    }

};

function writeCard() {
    try {
        app
    } catch (e) {
        $.messagebox({
            title: '提示',
            type: 'ask',
            msg: "请在零售终端使用此功能"
        });
        return;
    }
    //判断 是否有选中
    if (applyGrid.getSelections().length == 0) {
        $.messagebox({
            title: '错误',
            type: 'error',
            msg: "请选择要进行写卡的会员卡！"
        });
        return;
    }

    if (selectCount < applyGrid.getSelections().length) {
        //重置密码
        setTimeout(function () {
            app.sendMessage('Common_ChangeCardPwd_REQUEST', ['update_reponse', cardTypeCode, sOldpassword, password]);
            app.setMessageCallback('update_reponse', function (u_name, u_args) {
                if (u_args[0].toString() == "0") { //表示修改密码成功  说明该卡是新卡 不用后续操作了。
                } else { //表示该卡 不是新卡 需要在判断
                    app.sendMessage('Common_ChangeCardPwd_REQUEST', ['update_reponse2', cardTypeCode, password,
                            password]);
                    app.setMessageCallback('update_reponse2', function (u_name, u_args) {
                        if (u_args[0].toString() == "-1") {
                            $.messagebox({
                                title: '错误',
                                type: 'error',
                                msg: u_args[1].toString()
                            });
                            applyGrid.reload();
                            selectCount = 0;
                            return false;
                        }
                    });
                }
            }); //不做业务处理
        }, 0);

        //setTimeout("validateReadPwd()",200); //验证密码

        setTimeout(function () {
            if (applyGrid.getSelections()[selectCount]["writeStatus"] == "WRITTEN") { //判断是否为已写入的卡
                $.messagebox({
                    title: '营销中心v3.0',
                    type: 'ask',
                    msg: '卡号状态为已写卡，是否再次写卡？',
                    buttons: [{
                            text: '确定',
                            iconCls: 'ico-btn-order-ok'
                        }, {
                            text: '取消',
                            iconCls: 'ico-btn-order-ok'
                        }],
                    fn: function (button, msg) {
                        if (button.index == 0) {

                            app.sendMessage('Card_WriteNum_REQUEST', [callbackname_w, cardTypeCode, password, applyGrid
                                    .getSelections()[selectCount]["cardNum"], sNewPassword, sNewCardType, sNewSecNo]);
                        } else {
                            applyGrid.reload();
                            selectCount = 0;
                            return false;
                        }
                    }
                });
            } else {
                app.sendMessage('Card_WriteNum_REQUEST', [callbackname_w, cardTypeCode, password, applyGrid.getSelections()[
                        selectCount]["cardNum"], sNewPassword, sNewCardType, sNewSecNo]);
            }
        }, 2000);

    } else {
        selectCount = 0; //最后将selectCount清空
        return false;
    }
}
util.reWriteCard = function (configData, callBack) {
    let callbackname = 'func' + (new Date()).getTime() + (newGuid());
    let callbackname2 = 'func' + (new Date()).getTime() + (newGuid());
    let result = {}
    let pwd = "383333333030"
    let initPwd = "FFFFFFFFFFFF"
    if (false) {
        result.status = -1;
        result.msg = "浏览器不支持访问硬件设备";
        callBack(result);
        return;
    }
    //判断 是否有选中
    // if(cardData.length == 0) {
    // 	callBack("没有卡的数据");
    //    return;
    // }

    getDeviceObject(0, configData, pwd, initPwd, function (device) {
        // if(selectCount < applyGrid.getSelections().length) {
        //重置密码
        app.sendMessage('Common_ChangeCardPwd_REQUEST', [callbackname, device.code, initPwd, pwd]);
        app.setMessageCallback(callbackname, function (name, args) {
            // callback(args)

            if (args[0].toString() == "0") { //表示修改密码成功  说明该卡是新卡 不用后续操作了。

            } else { //表示该卡 不是新卡 需要在判断

                app.sendMessage('Common_ChangeCardPwd_REQUEST', [callbackname2, device.code, pwd, pwd]);
                app.setMessageCallback(callbackname2, function (U_name, u_args) {
                    window.$appConfigData = u_args
                    // if(u_args[0].toString() == "-1"){
                    // 		$.messagebox({title:'错误',type:'error', msg:u_args[1].toString()});
                    // 		applyGrid.reload();
                    // 	selectCount = 0;
                    // 	return false;
                    //   }
                });
            }
        }); //不做业务处理
    })
    //setTimeout("validateReadPwd()",200); //验证密码

    // 	setTimeout(function(){
    // 		if(applyGrid.getSelections()[selectCount]["writeStatus"] == "WRITTEN"){//判断是否为已写入的卡
    // 			$.messagebox({title:'营销中心v3.0',type:'ask', msg:'卡号状态为已写卡，是否再次写卡？', 
    // 				buttons: [{text:'确定', iconCls:'ico-btn-order-ok'},{text:'取消', iconCls:'ico-btn-order-ok'}]
    // 				,fn:function(button, msg){
    // 					if(button.index == 0){

    // 						app.sendMessage('Card_WriteNum_REQUEST', [callbackname_w, cardTypeCode, password, applyGrid.getSelections()[selectCount]["cardNum"], sNewPassword, sNewCardType, sNewSecNo]);			
    // 					}else{
    // 						applyGrid.reload();
    // 						selectCount = 0;
    // 						return false;
    // 					}
    // 				}
    // 			});
    // 		}else{
    // 			app.sendMessage('Card_WriteNum_REQUEST', [callbackname_w, cardTypeCode, password, applyGrid.getSelections()[selectCount]["cardNum"], sNewPassword, sNewCardType, sNewSecNo]);
    // 		}
    // 	},2000);

    // }else{
    // 	selectCount = 0; //最后将selectCount清空
    // 	return false;
    // }
}
//获取外壳配置的读卡器类型
util.IntitReadCard = function (callBack) {
    let device = null //测试
    readTerminalParameter(function (result) {
        var cardReaders = result.card_reader;
        if (cardReaders.length > 0) {
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
                }

            }
            //如果驱动等于null，默认取第一个
            if (device == null) {
                device = {};
                device.name = cardReaders[0].name;
                device.code = cardReaders[0].code;
            }
        }
        callBack(device);
    });
};
/**
 * 获取外壳配置的读卡器类型
 * @param cardReaderData 读卡终端数据
 */
util.reIntitReadCard = function (cardReaderData) {
    let device = null //测试
    if (cardReaderData.length > 0) {
        for (let i = 0; i < cardReaderData.length; i++) {
            let cardReaderItem = cardReaderData[i];
            let selected = cardReaderItem.selected;
            let _success = false;
            if (typeof selected == 'string') {
                _success = (selected == "true");
            } else {
                _success = selected;
            }
            if (_success) {
                device = {};
                device.name = cardReaderItem.name;
                device.code = cardReaderItem.code;
            }
        }
        //如果驱动等于null，默认取第一个
        if (device == null) {
            device = {};
            device.name = cardReaderData[0].name;
            device.code = cardReaderData[0].code;
        }
    }
    return device
};

function NeatDialog(sHTML, sTitle) {
    window.neatDialog = null;
    this.elt = null;
    var parentDiv = $('<div/>');
    parentDiv.css('left', '0px');
    parentDiv.css('top', '0px');
    parentDiv.css('width', '100%');
    parentDiv.css('height', '100%');
    parentDiv.css("position", "absolute");
    parentDiv.css("z-index", "89999");
    //parentDiv.css('background-color','#BBB');
    parentDiv.appendTo($(document.body));

    var maskDiv = $('<div/>');
    //maskDiv.css('display','none');
    maskDiv.css("z-index", "99999");
    maskDiv.css("position", "absolute");

    maskDiv.css("opacity", "0");
    maskDiv.css("background-color", "#eee");
    maskDiv.css('overflow', 'none');
    maskDiv.css('left', '0px');
    maskDiv.css('top', '0px');
    maskDiv.css('width', '100%');
    maskDiv.css('height', '100%');
    maskDiv.appendTo(parentDiv);

    var tipDiv = $('<div/>');
    tipDiv.css('display', 'none');
    //tipDiv.css('background-color','#000');
    tipDiv.css('width', '100px');
    tipDiv.css('height', '100px');
    tipDiv.css('position', 'relative');
    tipDiv.css("z-index", "99999");
    tipDiv.css('top', '20%');
    //tipDiv.css('left','40%');
    tipDiv.css('margin-left', 'auto');
    tipDiv.css('margin-right', 'auto');

    var img = $('<img/>');
    img.attr('src', jContextPath + '/images/loading2.gif');
    img.appendTo(tipDiv);

    tipDiv.appendTo(parentDiv);
    this.elt = parentDiv[0];
    window.setTimeout(function () {
        tipDiv.show();
    }, 200);
    window.neatDialog = this;

    /*
	if (document.createElement && document.getElementById) {
		var dg = document.createElement("div");
		dg.setAttribute("style", " border:0; POSITION: relative; TOP: 25%;");
		sHTML = '<div style="">'
				+ sHTML
				+ '<div ><img src="'
				+ jContextPath
				+ '/images/loading2.gif" alt="Cancel" style="RIGHT: 48%; POSITION: absolute; TOP: 1em" /></div>'
				+ '</div><div id="sTitle" style="text-align:center;font-size:24px;padding:80px 0 0 0;">'
				+ sTitle + '</div>';
		dg.innerHTML = sHTML;
		var dbg = document.createElement("div");
		dbg.id = "nd-bdg";
		dbg
				.setAttribute(
						"style",
						"Z-INDEX: -1;FILTER: alpha(opacity=100); LEFT: 0px; WIDTH: 10%; POSITION: absolute; TOP: 0px; HEIGHT: 100%; BACKGROUND-COLOR: #eee; opacity: 0.1");
		var dgc = document.createElement("div");
		dgc
				.setAttribute(
						"style",
						"Z-INDEX: 10000; BACKGROUND: none transparent scroll repeat 0% 0%; LEFT: 0px; WIDTH: 100%; POSITION: absolute; TOP: 0px; HEIGHT: 100%");
		if (dgc != null) {
			dgc.appendChild(dbg);
			dgc.appendChild(dg);
		}

		if (document.body != null && document.body.offsetLeft > 0)
			dgc.style.marginLeft = document.body.offsetLeft + "px";
		if (document.body != null && document.body.appendChild != null)
			document.body.appendChild(dgc);
		
		this.elt = dgc;
		window.neatDialog = this;
	}
	*/
}
NeatDialog.prototype.close = function () {

    if (this.elt) {
        $(this.elt).css('cursor', 'default');
        this.elt.style.display = "none";
        this.elt.parentNode.removeChild(this.elt);
    }
    window.neatDialog = null;

}
//解决云平台跨域访问js问题 2018-04-19
//浏览器直接访问top，指向的是cmc。此时cms不允许调用 start
var curWindowTop = getCurTopWindow(window);

function getCurTopWindow(curWindow) {
    if (curWindow == null || curWindow.parent == null || curWindow == top) {
        return top;
    }
    var curWindowFrameElement = curWindow.frameElement;
    if (curWindowFrameElement != null) {
        var frameElementName = curWindow.frameElement.name;
        if (frameElementName != null && (frameElementName == "CMCToCMSMainFrame")) {
            return curWindow;
        }
    }
    var curWin = curWindow.parent;
    return getCurTopWindow(curWin);
}
/**
 * 判断当前客户端访问的是否为影院部署模式
 * @return 是影院端部署模式返回true,否则返回false
 * @since 2014-06-17 by ChenYunpei
 */
function isCinemaDeployMode() {
    var deployMode = window.sessionStorage.deploy_mode;
    return "cinema" == deployMode;
}

function setDialogMsg(msg) {
    var sTitleDiv = $("#sTitle").html();
    if ($.trim(sTitleDiv) != '') {

        $("#sTitle").html(msg);

    }

}
/**
 * 同步信息
 */
function syncInfo(parameter, callBackResult) {

    //首先判断中心端url是否为null
    if ($.trim(parameter.sync_url) != '' && isCinemaDeployMode()) {
        alert("开始执行同步影院数据方法===" + $.toJSON(parameter));

        var sync_url = parameter.sync_url;
        var sync_time_url = parameter.sync_time_url;


        //如果没有data节点
        if (typeof parameter.data == 'undefined') {

            parameter.data = {};
        }

        //如果是影院部署模式

        if (typeof parameter.data == 'string') {
            parameter.data = jQuery.parseJSON(parameter.data);
        }
        var postData = parameter.data;

        for (var key in callBackResult.data) {
            postData[key] = callBackResult.data[key];
        }

        alert('callbackResult--->' + $.toJSON(callBackResult));
        if (callBackResult.data != null) {
            for (var key in callBackResult.data) {
                alert('追加参数' + key + '=' + callBackResult.data[key]);
                postData[key] = callBackResult.data[key];

            }

        }



        // 获得所有影院
        var requestParamter = {
            url: sync_url,
            data: postData,
            request: 'data',
            asyn: false,
            success: function (json) {


                if ($.trim(sync_time_url) != '') {

                    //postData.centerCallBackResult = json;
                    alert("准备发送到影院端参数===" + $.toJSON(postData));

                    //继续发送到影院端
                    var syncRequestPatamter = {
                        url: sync_time_url,
                        data: postData,
                        request: 'data',
                        asyn: false,
                        success: function (json) {

                            alert("同步影院时间成功");
                        }
                    };

                    $.ajax(syncRequestPatamter);
                }



            }
        };

        $.ajax(requestParamter);
    }

}

function closeDialog(shadow) {

    if (shadow == false) {
        return;
    }
    if (window.openDialogCount == null) {
        window.openDialogCount = 0;
    }
    if (window.openDialogCount > 0) {
        window.openDialogCount--;
    }
    if (window.openDialogCount <= 0) {
        dialog = window.nestDialog;
        if (dialog != null && dialog.elt) {
            if (dialog.elt.parentNode != null) {
                $(dialog.elt).css('cursor', 'default');
                $(dialog.elt).hide();
                dialog.elt.parentNode.removeChild(dialog.elt);
            }
        }

        window.nestDialog = null;
    }

    /*
	var dialog = comm_dialog_array[0];
	if (dialog != null && dialog.elt) {
		dialog.elt.style.display = "none";
		if (dialog.elt.parentNode != null) {
			dialog.elt.parentNode.removeChild(dialog.elt);
		}

	}
	dialog = null;
	comm_dialog_array = new Array();
	*/
}

function cmcToCmsErrorFun(msg, detail, OT) {
    if (document.createElement && document.getElementById) {
        var dg = document.createElement("div");
        dg.setAttribute("style",
            " width: 100%;height: 100%;background-color: #eff0f0;overflow: hidden;position: relative;");

        sHTML =
            '<div style="width: 40.9rem;height: 29.1rem;position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin:auto;">';
        if ($.trim(OT) == '' || $.trim(OT) == null) {
            sHTML += '<div style="width: 40.9rem;margin:0 auto;"><img src="' + jContextPath +
                '/images/error-500.png" alt="500" style="width: 100%;"></div>';
        } else {
            sHTML += '<div style="width: 40.9rem;margin:0 auto;"><img src="' + jContextPath +
                '/images/error-overtime.png" alt="400" style="width: 100%;"></div>';
        }

        sHTML += '<div class="errorcontent-box">'

        + '<p style="font-size: 1.5rem;color: #232323;text-align: center;margin-top: 1rem;">' + $.trim(msg) + '</p>' +
            '<p style="font-size: 0.9rem;color: #959595;text-align: center;margin-top: 1rem;margin-bottom: 2rem;">' + $
            .trim(detail) + '</p>' + '</div>' + '</div>';
        dg.innerHTML = sHTML;
        var dgc = document.createElement("div");
        dgc.setAttribute(
            "style",
            "Z-INDEX: 10000; BACKGROUND: none #d5e3ef scroll repeat 0% 0%; LEFT: 0px; WIDTH: 100%; POSITION: absolute; TOP: 0px; HEIGHT: 100%");
        if (dgc != null) {
            dgc.appendChild(dg);
        }

        if (document.body != null && document.body.offsetLeft > 0) {
            dgc.style.marginLeft = document.body.offsetLeft + "px";
        }
        if (document.body != null && document.body.appendChild != null) {
            document.body.appendChild(dgc);
        }

        this.elt = dgc;
    }
}

function SetCookie(name, value) {
    //两个参数，一个是cookie的名子，一个是值
    var Days = 100; //此 cookie 将被保存 30 天
    var exp = new Date(); //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/cmsExtend";
}

function getCookie(objName) { //获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) {
            return unescape(temp[1]);
        }
    }
}
//删除cookies

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
/**
 * 重定向地址
 * @param {} urlPath
 */
function redirectURL(urlPath) {
    window.open(urlPath, '_top');
}

function checkNumber(value) {
    var reg = /^[0-9]+$/;
    return reg.test(value);
}

function requestCallBack(data, oldSucc, oldCmple, oldError, isWriteLog, parameter) {
    if (isWriteLog) alert('requestCallBack方法执行开始......................，具体参数');
    if (isWriteLog) alert(data == null ? '无数据' : JSON.stringify(data));


    //验证数字通过后才放入session
    var cdd = data.current_database_datetime;
    if (cdd == null) {
        cdd = data.currentDatabaseDatetime;
    }
    if (checkNumber(cdd)) {
        //获得当前数据库时间
        current_database_datetime = cdd;
        //放入Session
        putSession("current_database_datetime", {
            current_database_datetime: current_database_datetime
        });
    }

    if (!(data.status == -10099 || data.status == '-10099')) {
        parameter.auto_login = null;
    }

    /**
     * 2018-04-19 
     * 成功打开页面后，手工清除了浏览器缓存，再进行操作的时候，许可证等相关的缓存信息已经没有了。要么再单点成功，要么就重新跳转云平台登录
     */
    if (HTTP_SERVER_ICE_URL == null && typeof (app) == 'undefined') {
        if (data.status == '04') {
            curWindowTop.$.messagebox({
                type: 'error',
                msg: data.msg,
                buttons: [{
                        text: '确定'
      }],
                fn: function (button, msg) {

                }
            });
            return;
        }
    }

    //增加单点登录成功后把当前会话信息写入session中 on 2017-03-02 by ChenYunpei
    if (data.data != null) {
        var bdata = data.data;
        if (jQuery.trim(bdata.sso_user_token) != '') {
            window.sessionStorage.setItem('user_token', '{"user_token":"' + bdata.sso_user_token + '"}'); //如果是单点登录的话，user_token设置的是sso_token的值
            window.sessionStorage.setItem('loginFlag', '{"loginFlag":"back"}');
            window.sessionStorage.setItem('account_name', '{"account_name":"' + bdata.sso_login_name + '"}');
            window.sessionStorage.setItem('account_uid', '{"account_uid":"' + bdata.sso_account_uid + '"}');
            window.sessionStorage.setItem('name', '{"name":"' + bdata.sso_user_name + '"}');
            window.sessionStorage.setItem('current_cinemaname', '{"current_cinemaname":"' + bdata.current_cinemaname +
                '"}');
            window.sessionStorage.setItem('is_cmc_to_cms', 'true');
            window.sessionStorage.setItem('is_browser_request_cms', 'true');
        }
        if (jQuery.trim(bdata.sso_resourceCodes) != '') {
            window.sessionStorage.setItem('resourceCodes', JSON.stringify(bdata.sso_resourceCodes));
        }
        if (jQuery.trim(bdata.sso_cinemaUids) != '') {
            //window.sessionStorage.setItem('resourceCodes',JSON.stringify(data.sso_cinemaUids));
        }
        if (jQuery.trim(bdata.sso_authorization) != '') {
            alert('设置authorization.....')
            window.sessionStorage.setItem('authorization', bdata.sso_authorization);
        }
    }

    //end on 2017-03-02 by ChenYunpei

    if (data.status == 0 || data.status == 1) {
        if (typeof oldSucc == 'function') {
            if (isWriteLog) alert('即将调用业务方法.....');
            oldSucc(data.data);
            if (isWriteLog) alert('调用业务方法结束.....');
        } else {
            if (isWriteLog) alert(data.url + "===没有success方法");
        }
    } else if (data.status == -2 || data.status == '-2') {
        alert('ICE返回结果为-2状态，通知客户端重新登录');
        if (HTTP_SERVER_ICE_URL != null && typeof (app) == 'undefined') {
            var result = getSession("loginFlag");
            var sst_version = sessionStorage.getItem("sst_version");
            var msg = "";
            var flag = 'back';
            if (result != null && $.trim(result.loginFlag) == 'pos') {
                msg = "用户登录超时或被强制退出！";
                flag = 'pos';
            } else if (result != null && $.trim(result.loginFlag) == 'sst') {
                msg = "连接服务器中断！";
                flag = 'sst';
            } else {
                msg = "该账号登陆超时！";
            }
            curWindowTop.$.messagebox({
                type: 'error',
                msg: msg,
                fn: function (button, msg) {
                    if (window.sessionStorage) {
                        window.sessionStorage.clear();
                    } else {
                        alert("浏览器不支持sessionStorage");
                    }
                    if (flag == 'pos') {
                        redirectURL(jContextPath + "/loginpos.jsp");
                    } else if (flag == 'sst') {
                        if ($.trim(sst_version) == "v3") {
                            redirectURL(jContextPath + "/page/sst/index_v3.jsp");
                        } else {
                            redirectURL(jContextPath + "/page/sst/index_new.jsp");
                        }
                    } else {
                        redirectURL(jContextPath + "/loginback.jsp");
                    }
                }
            });
        } else
        if (HTTP_SERVER_ICE_URL == null && typeof (app) == 'undefined') {
            alert('重新登录');
            global_data_obj = null;
            delCookie("cinema_token" + getCookie("session_cmc_license_number"));
            delCookie("center_token" + getCookie("session_cmc_license_number"));
            cmcToCmsErrorFun('因安全性验证未通过，造成当前用户未登录，不可访问！', '(请关闭当前子页面，重新访问！)');
            //initSysInfo();
        } else if (app != null) {
            app.sendMessage('Common_REQUEST', ['null', 'resetlogin', '']);
        } else {

        }
    } else if (data.status == -10099 || data.status == '-10099') {
        //session有授权信息，则执行自动登录
        alert('parameter=' + parameter);
        alert('parameter.auto_login=' + (parameter != null ? parameter.auto_login : 'null'));
        alert('sessionStorage.getItem("authorization")=' + sessionStorage.getItem("authorization"));
        alert('执行自动登录条件--->' + (parameter != null && sessionStorage.getItem("authorization") != null && parameter.auto_login ==
            null));
        if (parameter != null && sessionStorage.getItem("authorization") != null && parameter.auto_login == null) {

            //执行自动登录
            parameter.authorization = sessionStorage.getItem("authorization");
            parameter.url = parameter.back_url;
            parameter.auto_login = 'auto login doing';
            ajax_request(parameter);

        } else {
            parameter.auto_login = null;
            sessionStorage.removeItem("authorization");
            //session无授权信息，则跳转
            var result = getSession("loginFlag");
            var sst_version = sessionStorage.getItem("sst_version");
            var msg = "";
            var flag = 'back';
            if (result != null && $.trim(result.loginFlag) == 'pos') {
                msg = "用户登录超时或被强制退出！";
                flag = 'pos';
            } else if (result != null && $.trim(result.loginFlag) == 'sst') {
                msg = "连接服务器中断！";
                flag = 'sst';
            } else {
                msg = "该账号登陆超时！";
            }

            if (HTTP_SERVER_ICE_URL == null && typeof (app) == 'undefined') {
                alert('该账号登陆超时！........');
                closeDialog(true);
                cmcToCmsErrorFun('该账号登陆超时！', '(单点登陆失败，请重新登陆云平台再访问)', 'true');
            } else {
                curWindowTop.$.messagebox({
                    type: 'error',
                    msg: msg,
                    fn: function (button, msg) {
                        if (flag == 'pos') {
                            redirectURL(jContextPath + "/loginpos.jsp");
                        } else if (flag == 'sst') {
                            if ($.trim(sst_version) == "v3") {
                                redirectURL(jContextPath + "/page/sst/index_v3.jsp");
                            } else {
                                redirectURL(jContextPath + "/page/sst/index_new.jsp");
                            }
                        } else {
                            redirectURL(jContextPath + "/loginback.jsp");
                        }
                    }
                });
            }
            return;
        }
    } else if (data.status == -8001) {
        //表示当前请求访问不正确的服务器
        alert('当前请求访问了不正确的服务器........');
        closeDialog(true);
        cmcToCmsErrorFun('系统异常，请联系管理员', '(逻辑服务器被终止)');
    } else if (data.status == -1) {
        if (typeof oldError == 'function') {
            oldError(data.msg, data.status);
        } else {
            alert("错误结果未处理 ->" + data.msg);
        }

    } else {
        if (typeof oldError == 'function') {
            oldError(data.msg, data.status);
        } else {
            alert("请求状态为：" + data.status + ",请求地址为：" + data.url + ",请求参数：" + (typeof data.data == 'object' ? $.toJSON(
                data.data) : parameter.data) + " 出现异常");

        }



    }

    if (typeof oldCmple == 'function') {
        oldCmple(data.data);
    } else {
        if (isWriteLog) alert(data.url + "===没有complete方法");
    }
    if (isWriteLog) alert('requestCallBack方法执行完毕......................');
}

/**
 * 云平台访问
 * @param global_data_con_obj
 * @param parameter
 * @param shadow
 * @param isWriteLog
 * @returns
 */
function sendRouteMessage(global_data_con_obj, parameter, shadow, isWriteLog) {
    if (typeof global_data_con_obj == 'object' && typeof parameter == 'object') {

        var curCommand = parameter.url;
        alert("curCommand...................................");
        alert(curCommand);

        var clazz = global_data_con_obj.domain + '.' + global_data_con_obj.version + '.' + global_data_con_obj.name +
            '.' + global_data_con_obj.operation;

        parameter.url = jContextPath + '/routeServlet' + '?class=' + clazz + '&method=' + global_data_con_obj.method;

        parameter.url += "&cmd=" + global_data_con_obj.cmd;

        parameter.url += "&curCommand=" + curCommand;


        //parameter.url += '&authorization=' + authorization;

        //增加资源ID参数及消息通知代码
        if (global_data_con_obj.resourceId != null) {
            parameter.url += '&develop_resource_id=' + global_data_con_obj.resourceId;
        }
        if (global_data_con_obj.type != null) {
            parameter.url += '&develop_request_type=' + global_data_con_obj.type;
        }

        var license_number = window.sessionStorage.getItem('license_number');
        if (license_number == null || license_number == 'null') {
            license_number = "123456";
        }
        parameter.url += '&license_number=' + license_number;

        var cmc_license_number = window.sessionStorage.getItem('session_cmc_license_number');
        if (cmc_license_number == null || cmc_license_number == 'null') {
            cmc_license_number = "123456";
        }
        parameter.url += '&cmc_license_number=' + cmc_license_number;
        /*if (isWriteLog) alert('clazz->' + clazz + ' method='
				+ global_data_con_obj.method);*/


        //alert('parameter.data->' + parameter.data);

        if (isWriteLog) alert("parameter============" + $.toJSON(parameter));
        var oldSucc = parameter.success;
        var oldCmple = parameter.complete;
        var oldError = parameter.error;

        if (typeof parameter.data == "string") {

            parameter.data = jQuery.parseJSON(parameter.data);
        }

        if (parameter.authorization != null) {
            parameter.data.authorization = parameter.authorization;
        }
        parameter.success = function (data) {
            //alert("服务端返回结果->" + JSON.stringify(data));
            // 关闭隐藏层				
            if (data) {
                requestCallBack(data, oldSucc, oldCmple, oldError, isWriteLog, parameter);
                syncInfo(parameter, data); //同步影院时间	
            }
            setDialogMsg("请求数据完毕");
            closeDialog(shadow);
        };

        //错误执行方法
        parameter.error = function (data, error) {
            //alert("服务端返回结果->" + JSON.stringify(data));
            setDialogMsg("请求数据完毕");
            // 关闭隐藏层
            closeDialog(shadow);
            if (typeof oldError == 'function') {
                requestCallBack(data, oldSucc, oldCmple, oldError, isWriteLog, parameter);
            } else {
                alert("错误结果未处理 ->" + data.msg);
            }

        };

        setDialogMsg("通过Servlet方式，开始请求数据");

        //转码url特殊字符

        //changeUrlCode(parameter.data);

        return jQuery._ajax(parameter);
    } else {
        if (isWriteLog) alert("提交参数异常");
    }

}

/**
 * 通过提交的别名，访问对应的真实访问地址
 * 
 * @param cmd
 *            访问别名
 */
function getPathByCmd(cmd, isWriteLog) {
    /*
     * 2014-02-28 by ChenYunpei 注释 // 静态本地访问，直接返回cmd if (typeof(app) ==
     * 'undefined') { return { cmd : cmd }; }
     */
    if (isWriteLog) alert('根据CMD获取加载数据对象信息..............');
    if (isWriteLog) alert('global_data_obj != null && global_data_obj.arr_addr_mapping != null=' + (global_data_obj !=
            null && global_data_obj.arr_addr_mapping != null));
    if (global_data_obj != null && global_data_obj.arr_addr_mapping != null) {
        for (var i = 0; i < global_data_obj.arr_addr_mapping.length; i++) {
            var tempCmd = global_data_obj.arr_addr_mapping[i].cmd;
            if (jQuery.trim(tempCmd) == jQuery.trim(cmd)) {
                if (isWriteLog) alert('拿动态的地址信息.....................................');
                return global_data_obj.arr_addr_mapping[i];

            }
        }

    }
    return {
        cmd: cmd
    };

}
/**
 * 追加文件参数
 * 
 */
function request_push_file_parameter(fromId, data) {
    var elements = $("#" + fromId + " input:file");
    if (elements) {
        for (var i = 0; i < elements.length; i++) {
            if (jQuery.trim(elements[i].value) != "") {

                if (jQuery.trim(data) != "") {
                    data += "&file_" + elements[i].name + "=" + elements[i].value;
                } else {
                    data += "file_" + elements[i].name + "=" + elements[i].value;
                }

            }

        }
        return data;
    }

}

/**
 * 请求参数转换为json，增对POST提交
 * 
 */
function requestParameterToJsonStr(parameters) {
    alert('参数转换前---->' + parameters.data);
    var type;
    if (typeof parameters.castType == "undefined") {

        type = false;
    }

    var object = {};
    if (type) {
        object = $.deparam(parameters.data, true); //强制数字转换成number
        // object = parameters.data.toString()
        alert(object)
    } else {

        object = $.deparam(parameters.data);
        // object = parameters.data.toString()
        alert(object)
    }

    return object;
}

function openDialog(msg, shadow) {
    if (shadow == false) {
        return;
    }

    if (window.openDialogCount == null) {
        window.openDialogCount = 0;
    }
    if (window.openDialogCount == 0) {
        window.nestDialog = new NeatDialog('', msg);
    }
    window.openDialogCount++;
    // $(window.nestDialog.elt).css('cursor','wait');
    /*
	var sHTML = '';
	if (comm_dialog_array.length <= 0) {
		comm_dialog_array.push(new NeatDialog(sHTML, msg));

	}
	*/

}

function getSessionId() {
    //alert('getSessionId============================================ begin');
    var id = null;
    var o = getSession('session_id');
    //alert('');
    if (o != null) {
        id = o.session_id;
    }
    //alert('getSession---------------->' + id);
    if (id == null || $.trim(id) == '') {
        //alert('$.trim.id==================');
        if (typeof (jSessionId) == 'undefined' || $.trim(jSessionId) == '') {
            var c_name = 'JSESSIONID';
            //alert('以上cookie信息===============================');
            //alert(document.cookie);
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + "=")
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1
                    c_end = document.cookie.indexOf(";", c_start)
                    if (c_end == -1)
                        c_end = document.cookie.length
                    id = unescape(document.cookie.substring(c_start, c_end));
                    putSession("session_id", id);
                }
            } else {
                alert('cookie session id is not null');
            }
        } else {
            id = jSessionId;
            //alert('jSessessionId======================' + id);
        }
    }

    return id;
}
/**
 * 异步请求业务服务端数据
 * 
 * @param cmd
 *            请求命令字符串(com.eee.ssw.TestData.query)
 * @param data
 *            请求参数字符串
 * @param formId
 *            表单Id
 * @param success
 *            回调方法 原型方法:方法名(json){} json指的是服务端返回过来的json数据
 * @param request
 *            请求方式page或data
 * @param shadow
 *            隐影层
 *            
 *@param castType 类型转换
 *
 *@param isWriteLog 是否写日志属性，默认为true  on 2014-05-22 by cyp，目前主要解决定时消息请求打印日志过多的问题
 * 
 * @return{url:'',center_url:'',sync_url:''}
 */

function ajax_request(parameter, shadow, isWriteLog) {

    if (typeof parameter.traditional == "undefined") {
        parameter.traditional = true;
    }

    if (isWriteLog == null) {
        isWriteLog = true;
    }

    var localSessionId = getSessionId();
    if (isWriteLog) alert("localSessionId====" + localSessionId);

    openDialog("开始发送信息", shadow);
    parameter.type = "post";
    // 控制同步异步，用于ice通讯
    if (typeof parameter.async == "undefined") {
        parameter.async = true;
    }

    if (parameter.data == null) {
        parameter.data = {};
    } else {
        if (isWriteLog) alert('typeof parameter.data-->' + typeof (parameter.data));
        // 如果参数数据是拼接字符，则转成对象
        if (typeof parameter.data == "string") {
            if (isWriteLog) alert('requestParameterToJsonStr.................................');
            parameter.data = requestParameterToJsonStr(parameter);
            if (isWriteLog) alert('==================typeof(parameter.data)=' + typeof (parameter.data));
        }

        //alert('parameter.data-->' +$.toJSON(parameter.data));
    }

    //增加单点登录令牌进入参数队列中 on 2017-03-01 by ChenYunpei
    var sso_token = window.sessionStorage.getItem('sso_token');
    alert('增加单点登录令牌进入参数队列中 on 2017-03-01 by ChenYunpei.................................sso_token : ' + sso_token);
    if (sso_token != null) {
        parameter.data.sso_token = sso_token;
    }
    //修改完成 on 2017-03-01 by ChenYunpei

    if (parameter.url != null) {
        var url = parameter.url;

        if (url != null && url.indexOf('?') != -1) {
            parameter.url = url.split('?')[0];
            var requestParameter = $.deparam(url.split('?')[1], true);
            if (isWriteLog) alert(requestParameter);
            if (requestParameter != null) {
                for (var key in requestParameter) {
                    parameter.data[key] = eval('requestParameter.' + key);
                }
            }
        }
    }

    parameter.token = localSessionId;
    if (isWriteLog) alert('typeof(parameter.data)=' + typeof (parameter.data));
    parameter.data.token = localSessionId;
    //获得用户令牌
    var userTokenJson = getSession("user_token");
    if (userTokenJson != null) {
        parameter.data.user_token = userTokenJson.user_token;
        parameter.user_token = userTokenJson.user_token;
    }

    if ($.trim(parameter.formId) != '') {
        parameter.data = $("#" + parameter.formId).serialize();
        parameter.data = request_push_file_parameter(parameter.formId,
            parameter.data);
        //parameter.data = requestParameterToJsonStr(parameter.data);

    }
    if (isWriteLog) alert(parameter.url);
    var global_data_con_obj = getPathByCmd(parameter.url, isWriteLog);
    if (isWriteLog) alert(parameter.url + "===global_data_con_obj===" + $.toJSON(global_data_con_obj));
    if (isWriteLog) alert("请求参数===" + parameter.data['request']);
    var requestType = parameter.data['request'];
    // 请求参数，用于解决组件page not undefined问题
    if ($.trim(requestType) == 'data' || $.trim(parameter.request) == 'data') {
        parameter.back_url = parameter.url;
        var accessMode = 0; // 0表示访问静态数据 1表示访问本地服务数据 2表示ICE服务数据
        if (parameter.staticData) {
            accessMode = 0;
        } else {
            //浏览器转发ICE模式  2018云平台
            if (HTTP_SERVER_ICE_URL == null && typeof (app) == 'undefined') {
                accessMode = 3;
            } else if (HTTP_SERVER_ICE_URL != null && HTTP_SERVER_ICE_URL != '' && $.trim(global_data_con_obj.name) !=
                '' && $.trim(global_data_con_obj) != '') {
                accessMode = 1;
            } else {
                if (typeof (app) != 'undefined' && $.trim(global_data_con_obj) != '' && $.trim(global_data_con_obj.name) !=
                    '') {
                    accessMode = 2;
                }
            }
        }

        if (isWriteLog) alert("数据访问方式===" + (accessMode == 0 ? '静态数据' : accessMode == 1 ? '本地服务器数据' : 'ICE服务器数据'));


        // parameter.uuid = Math.uuid();
        if (accessMode == 3) { //访问云平台
            sendRouteMessage(global_data_con_obj, parameter, shadow, isWriteLog);
        } else if (accessMode == 1) {
            // 按本地服务方式访问
            var clazz = global_data_con_obj.domain + '.' + global_data_con_obj.version + '.' + global_data_con_obj.name +
                '.' + global_data_con_obj.operation;
            parameter.url = HTTP_SERVER_ICE_URL + '?class=' + clazz + '&method=' + global_data_con_obj.method;
            //增加资源ID参数及消息通知代码
            if (global_data_con_obj.resourceId != null) {
                parameter.url += '&develop_resource_id=' + global_data_con_obj.resourceId;
            }
            if (global_data_con_obj.type != null) {
                parameter.url += '&develop_request_type=' + global_data_con_obj.type;
            }
            var license_number = window.sessionStorage.getItem('license_number');
            if (license_number == null || license_number == 'null') {
                license_number = "123456";
            }
            parameter.url += '&license_number=' + license_number;
            if (isWriteLog) alert('clazz->' + clazz + ' method=' + global_data_con_obj.method);


            //alert('parameter.data->' + parameter.data);

            if (isWriteLog) alert("parameter============" + $.toJSON(parameter));
            var oldSucc = parameter.success;
            var oldCmple = parameter.complete;
            var oldError = parameter.error;

            if (typeof parameter.data == "string") {

                parameter.data = jQuery.parseJSON(parameter.data);
            }

            if (parameter.authorization != null) {
                parameter.data.authorization = parameter.authorization;
            }
            parameter.success = function (data) {
                //alert("服务端返回结果->" + JSON.stringify(data));
                // 关闭隐藏层				
                if (data) {
                    requestCallBack(data, oldSucc, oldCmple, oldError, isWriteLog, parameter);
                    syncInfo(parameter, data); //同步影院时间	
                }
                setDialogMsg("请求数据完毕");
                closeDialog(shadow);
            };

            //错误执行方法
            parameter.error = function (data, error) {
                //alert("服务端返回结果->" + JSON.stringify(data));
                setDialogMsg("请求数据完毕");
                // 关闭隐藏层
                closeDialog(shadow);
                if (typeof oldError == 'function') {
                    requestCallBack(data, oldSucc, oldCmple, oldError, isWriteLog, parameter);
                } else {
                    alert("错误结果未处理 ->" + data.msg);
                }

            };

            setDialogMsg("通过Servlet方式，开始请求数据");

            //转码url特殊字符

            //changeUrlCode(parameter.data);

            return jQuery._ajax(parameter);
        } else if (accessMode == 0) {
            // 访问静态数据
            parameter.url = getBasePath() + '/testDataGenerator?cmd=' + global_data_con_obj.cmd;
            var oldSucc = parameter.success;
            var oldCmple = parameter.complete;
            var oldError = parameter.error;
            parameter.success = function (data) {
                //alert("服务端返回结果->" + JSON.stringify(data));
                // 关闭隐藏层
                closeDialog(shadow);
                if (data) {
                    if (data.status == 0 && typeof oldSucc == 'function') {
                        oldSucc(data.data);
                    }

                    if (data.status == 0 && typeof oldCmple == 'function') {
                        oldCmple(data.data);
                    }

                    if (data.status != 0 && typeof oldError == 'function') {
                        oldError(data.msg);
                    } else {
                        alert("错误结果未处理 ->" + data.msg);
                    }

                }
            }


            //错误执行方法
            parameter.error = function (data) {
                //alert("服务端返回结果->" + JSON.stringify(data));
                setDialogMsg("请求数据完毕");
                // 关闭隐藏层
                closeDialog(shadow);
                if (typeof oldError == 'function') {
                    oldError(data.msg);
                } else {
                    alert("错误结果未处理 ->" + data.msg);
                }

            };

            parameter.traditional = true;
            setDialogMsg("通过静态方式，开始请求数据");
            return jQuery._ajax(parameter);
        } else {
            // 访问动态数据
            setDialogMsg("开始请求数据");
            sendAsynMessage(global_data_con_obj, parameter, shadow, isWriteLog);
        }

    } else {
        // setDialogMsg("通过原生ajax方式，开始请求数据");
        if (isWriteLog) alert("访问原生ajax方法");
        closeDialog(shadow);
        return jQuery._ajax(parameter);
    }

    /*
     * // 获得请求参数 var request = null; var requestParameter = null; // 拆分URL if
     * (parameter.url) { var url = parameter.url;
     * 
     * if (url != null && url.indexOf('?') != -1) { parameter.url =
     * url.split('?')[0]; requestParameter = $.deparam(url.split('?')[1], true);
     * alert("requestparameter====" + requestParameter.request); } } else {
     * alert('请求地址不能为null'); return; }
     * 
     * if ((parameter.request && jQuery.trim(parameter.request) == 'data') ||
     * (requestParameter && requestParameter.request == 'data')) {
     * parameter.dataType = "json"; parameter.type = "POST"; // 获得提交 if
     * (jQuery.trim(parameter.formId) != null) { // 序列化表单 parameter.data = $("#" +
     * parameter.formId).serialize(); parameter.data =
     * request_push_file_parameter(parameter.formId, parameter.data); }
     * 
     * 
     * var global_data_con_obj = getPathByCmd(parameter.url); // 请求参数转换为json字符
     * //alert(parameter.data); parameter.data =
     * requestParameterToJsonStr(parameter.data);
     * 
     * //静态访问方法，开发测试用 if (load_static_data_flag || $.trim(global_data_con_obj) == '' ||
     * $.trim(global_data_con_obj.name) == '') { parameter.url = getBasePath() +
     * '/testDataGenerator?cmd=' + global_data_con_obj.cmd; // 加载静态数据 var
     * oldSucc = parameter.success; var oldCmple = parameter.complete; var
     * oldError = parameter.error;
     * 
     * 
     * 
     * parameter.success = function(data) { if (data) { if (data.status == 0 &&
     * typeof oldSucc == 'function') { oldSucc(data.data); }
     * 
     * if (data.status == 0 && typeof oldCmple == 'function') {
     * oldCmple(data.data); }
     * 
     * if (data.status != 0 && typeof oldError == 'function') {
     * oldError(data.msg); } } } return jQuery._ajax(parameter); } else {
     * $('#label').val(JSON.stringify(parameter));
     * sendAsynMessage(global_data_con_obj,parameter); } } else { return
     * jQuery._ajax(parameter); }
     */

    // 关闭隐藏层
}
/***
 * HTML5保存本地session
 * 
 */
function putSession(key, value) {

    if (window.sessionStorage) {
        if ($.trim(key) != '' && $.trim(value) != '') {
            if (typeof value == "object" && typeof key == "string") {
                value = $.toJSON(value);
                //alert('即将写入session Storeage key=' + key + ' value=' + value);
                window.sessionStorage.setItem(key, value);

            } else {
                alert("放入Session错误 key[" + key + "],value[" + value + "]");
            }

        } else {
            alert("放入Session错误 key[" + key + "],value[" + value + "]");

        }
    } else {

        alert("浏览器不支持sessionStorage");
    }


}
/***
 * HTML5获取本地session
 * 
 */
function getSession(key) {
    if (window.sessionStorage) {
        var value = window.sessionStorage.getItem(key);
        if ($.trim(value) != '') {

            return jQuery.parseJSON(value);
        }
    } else {
        alert("浏览器不支持sessionStorage");

    }

    return null;
}
/**
 * 生成唯一Guid
 * @return {}
 */
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
//测试
util.reGetDevice = function (type, configData, callback) {
    alert("进入获取硬件信息方法");
    alert("type===" + type);
    alert(configData)
    //获得读卡密码
    if (type == 0 || type == 2) {
        alert("获取读卡器硬件信息");
        //获得密码
        var kindCode = util.member_card_kind_code;
        var memberCardKindCodeObj = getSession(kindCode); //
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
                success: function (res) {
                    alert("退票打印2");
                    callback("退票打印2");
                    if (res.trim() != null) {
                        var pwd = res.result.cardAuthPwd;
                        var initPwd = res.result.cardAuthInitPwd;
                        alert("读卡密码=====" + pwd);
                        //放入session
                        putSession(kindCode, res);
                        getDeviceObject(type, configData, pwd, initPwd, callback);
                        alert("退票打印5");

                    } else {
                        alert("ajax error");
                        callback(null);
                    }
                }
            };
            // ajax_request(requestparameter); // 提交请求		
        } else {
            //如果可以拿到值，就直接掉获取驱动方法
            getDeviceObject(type, configData, memberCardKindCodeObj.result.cardAuthPwd, null, callback);
        }
        alert("完成获取读卡器硬件信息");

    } else {
        alert("获取读卡器以外的硬件信息");
        //如果可以拿到值，就直接掉获取驱动方法
        getDeviceObject(type, configData, null, null, callback);

    }
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
            window.$appConfigData = "device"

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
 * @param callback 接收参数的回调方法,原型：方法(result) result-->指的是参数JSON数据
 * @return void    无返回值
 * @author ChenYunpei
 * @since 2014-03-20
 */
util.readTerminalParameter = function (callback) {
    // alert('readTerminalParameter................begin');
    if (typeof (callback) != 'function') {
        // alert('回调方法callback不是一个方法');
        return;
    }
    if (typeof (app) != "undefined" && app.setMessageCallback) {
        console.log(app)
        console.log(typeof (app))
        // alert('从外壳中读取');
        var callbackname = 'readconfig_reponse_' + (newGuid());
        // alert(callbackname)
        // alert(app.setMessageCallback)
        app.setMessageCallback(callbackname, function (name, args) {

            // alert('外壳回应消息了');
            if (args[0] == 0) {
                let rs = JSON.parse(args[2]);
                var filmPrintOffset = rs.film_print_offset;
                if (typeof (filmPrintOffset) == "undefined" || filmPrintOffset == null) {
                    var o = {
                        x: 0 //X坐标偏移量
                        ,
                        y: 0 //Y坐标偏移量
                    };
                    rs.film_print_offset = o;
                }
                callback(rs);
            } else {
                curWindowTop.$.messagebox({
                    title: '错误',
                    type: 'error',
                    msg: '从客户端读取终端参数时抛出的错误原因是' + args[1]
                });
                callback({});
            }
        });
        var type = 'pos';
        app.sendMessage('Common_DataRead_REQUEST', [callbackname, type]);
        // alert('向外壳发送读命令完成...................');
    } else {
        // alert('读取静态测试数据.................');
        var result = null;
        result = {
            film_print_offset: { //影票打印机偏移坐标
                x: 0 //X坐标偏移量
                ,
                y: 0 //Y坐标偏移量
            },
            bill_print: [{
                    "code": "Send To OneNote 2016",
                    "name": "Send To OneNote 2016",
                    "selected": false
                }, {
                    "code": "Microsoft XPS Document Writer",
                    "name": "Microsoft XPS Document Writer",
                    "selected": true
                }, {
                    "code": "Microsoft Print to PDF",
                    "name": "Microsoft Print to PDF",
                    "selected": false
                }, {
                    "code": "Fax",
                    "name": "Fax",
                    "selected": false
                }],
            card_reader: [{
                    "code": "S8",
                    "name": "峰华_S8",
                    "selected": false
                }, {
                    "code": "E7",
                    "name": "峰华_E7",
                    "selected": true
                }, {
                    "code": "Z9",
                    "name": "德卡_Z9",
                    "selected": false
                }, {
                    "code": "QM8",
                    "name": "德卡_QM8",
                    "selected": false
                }, {
                    "code": "QM8_OSK",
                    "name": "德卡_QM8_OSK",
                    "selected": false
                }, {
                    "code": "FKSF2",
                    "name": "方卡_SF2",
                    "selected": false
                }, {
                    "code": "FKSF2C",
                    "name": "方卡_SF2C",
                    "selected": false
                }, {
                    "code": "TYRM",
                    "name": "明华_R330",
                    "selected": false
                }, {
                    "code": "FHJY",
                    "name": "德生F3RF",
                    "selected": false
                }, {
                    "code": "FHJY&GWI-60BR",
                    "name": "德生F3RF+长城GWI-60BR",
                    "selected": false
                }, {
                    "code": "SENOR",
                    "name": "星乔读卡器",
                    "selected": false
                }],
            cash_box: [{
                    "code": "Send To OneNote 2016",
                    "name": "Send To OneNote 2016",
                    "selected": false
                }, {
                    "code": "Microsoft XPS Document Writer",
                    "name": "Microsoft XPS Document Writer",
                    "selected": false
                }, {
                    "code": "Microsoft Print to PDF",
                    "name": "Microsoft Print to PDF",
                    "selected": false
                }, {
                    "code": "Fax",
                    "name": "Fax",
                    "selected": false
                }, {
                    "code": "COM3",
                    "name": "COM3",
                    "selected": true
                }],
            coupon_print: [{
                    "code": "Send To OneNote 2016",
                    "name": "Send To OneNote 2016",
                    "selected": false
                }, {
                    "code": "Microsoft XPS Document Writer",
                    "name": "Microsoft XPS Document Writer",
                    "selected": false
                }, {
                    "code": "Microsoft Print to PDF",
                    "name": "Microsoft Print to PDF",
                    "selected": true
                }, {
                    "code": "Fax",
                    "name": "Fax",
                    "selected": false
                }],
            film_print: [{
                    "code": "Send To OneNote 2016",
                    "name": "Send To OneNote 2016",
                    "selected": true
                }, {
                    "code": "Microsoft XPS Document Writer",
                    "name": "Microsoft XPS Document Writer",
                    "selected": false
                }, {
                    "code": "Microsoft Print to PDF",
                    "name": "Microsoft Print to PDF",
                    "selected": false
                }, {
                    "code": "Fax",
                    "name": "Fax",
                    "selected": false
                }],
            keyboard: [{
                    "code": "E7",
                    "name": "峰华_E7",
                    "selected": false
                }, {
                    "code": "Z9",
                    "name": "德卡_Z9",
                    "selected": false
                }, {
                    "code": "CM511",
                    "name": "辰明_CM511",
                    "selected": false
                }, {
                    "code": "CM512",
                    "name": "辰明_CM512",
                    "selected": false
                }, {
                    "code": "Numeric Keypad",
                    "name": "标准键盘",
                    "selected": true
                }],
            counter_type: [{ //柜台类型，可售：1、电影，2、卖品，3、电影和卖品
                    code: 'movie',
                    selected: false
   }
   , {
                    code: 'goods',
                    selected: false
   }
   , {
                    code: 'both',
                    selected: true
   }],


        };
        callback(result);
    }
}

/**
 * 写入终端参数配置
 * @param json 保存数据对象
 * @author ChenYunpei
 * @since 2014-03-20
 */
util.writeTerminalParameter = function (json, callback) {
    //暂时不写，等外壳弄好完再写
    //closeWin();
    if (typeof (app) != "undefined") {
        var callbackname = 'writeconfig_reponse_' + newGuid();
        app.setMessageCallback(callbackname, function (name, args) {
            if (args[0] == 0) {
                callback();
            } else {
                curWindowTop.$.messagebox({
                    title: '错误',
                    type: 'error',
                    msg: '写入终端参数时报错，具体错误原因是' + args[1]
                });
                return;
            }
        });
        var type = 'pos';
        var requestdata = JSON.stringify(json);
        app.sendMessage('Common_DataWrite_REQUEST', [callbackname, type, requestdata]);
    } else {
        alert("浏览器无法拿到app对象")
        // console.log(curWindowTop.$.fn.messagebox)
        // curWindowTop.$.messagebox({title:'成功',type:'success', msg:'浏览器修改成功',fn: function(button, msg) {
        // 	if(button.index == 0){
        // 		closeWin();
        // 	}
        // }});
    }
}



export
default util