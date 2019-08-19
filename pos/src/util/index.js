// formatTime(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// formatTime(new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
const formatTime = (dateObj, fmt) => { 
        let o = {   
            "M+" : dateObj.getMonth()+1,                 //月份   
            "d+" : dateObj.getDate(),                    //日   
            "h+" : dateObj.getHours(),                   //小时   
            "m+" : dateObj.getMinutes(),                 //分   
            "s+" : dateObj.getSeconds(),                 //秒   
            "q+" : Math.floor((dateObj.getMonth()+3)/3), //季度   
            "S"  : dateObj.getMilliseconds()             //毫秒   
        };   
        if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (dateObj.getFullYear()+"").substr(4 - RegExp.$1.length));   
        for(let k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
        return fmt;
}

const NumberTransform = (num) => {
    let str = num;
    
    let len1 = str.substr(0, 1);
    let len2 = str.substr(1, 1);

    //如果第一位是0，第二位不是点，就用数字把点替换掉
    if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1);
    }
    //第一位不能是.
    if (len1 == ".") {
        str = "";
    }
    //限制只能输入一个小数点
    if (str.indexOf(".") != -1) {
        let str_ = str.substr(str.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
        str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
    }

    //正则替换，保留数字和小数点
    str = str.replace(/[^\d^\.]+/g,'')
    //如果需要保留小数点后两位，则用下面公式
    str = str.replace(/\.\d\d\d$/,'')
    
    if(Number(str) >= 1000 || Number(str) < 0) {
        str = ''
    }
    return str;
}

export default {
    formatTime,
    NumberTransform
}