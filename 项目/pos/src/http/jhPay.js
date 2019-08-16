import { Loading } from 'element-ui';
import Alert from 'components/dialog/alert.js'
const vAlert = Alert.install
export default class jhPay{
  constructor({
    open,
    message,
    close,
    error,
  }){
    this.open = open;
    this.message = message;
    this.close = close;
    this.error = error;
    this.setOut = null;
    this.loading = null;
    this.init()
  }
  init(){
    this.ws = new WebSocket("ws://127.0.0.1:1818")
    this.ws.onopen = (res) => {  this._onopen(res) }
    this.ws.onclose = (res) => { this._onclose(res) } 
    this.ws.onmessage = (res) => { this._onmessage(res) }
    this.ws.onerror = (res) => { this._onerror(res) }
    return this.ws
  }
  
  send({
    applicationType, //消费类型  循序1
    posCode,//pos机号 8位 循序2
    posEmpno,//pos机号 8位 循序3
    transactionType,//交易类型标志 循序4
    payAmount,//JH支付金额转换 循序5
    transactionDate,////消费日期 循序6
    transactionCode, //原交易参考号 用于退货 12位 不足12位空格填充 循序7
    voucherNO,//原凭证号 用于撤销 6位 不足6位空格填充 循序8
    lrcCode, //3位随机数字 循序9
    payCode, //支付码
    bankBillCode, //银商订单号  //50位 不足右补空格
    ERPBillCode, //对账订单号 //50位 比如YYYYMMDDhhmmss+随机数 不足右补空格
  }){
    this.applicationType = applicationType 
    this.posCode = posCode || '12345678'
    this.posEmpno = this._posEmpno(posEmpno)
    this.transactionType = transactionType
    this.payAmount = this._payAmount(payAmount)
    this.transactionDate = transactionDate || this._transactionDate()
    this.transactionCode = this._transactionCode(transactionCode)
    this.voucherNO = this._voucherNO(voucherNO)
    this.lrcCode = this._lrcCode()
    this.payCode = this._payCode(payCode)
    this.bankBillCode = this._bankBillCode(bankBillCode)
    this.ERPBillCode = this._ERPBillCode(ERPBillCode)
    this.ws.send(this._sendData())
  }
  _onopen(res){
    this.loading = Loading.service({
      lock: true,
      text: '支付中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if(this.setOut) clearTimeout(this.setOut)
    this.open && this.open(res)
  }
  _onmessage(res){
    console.log(res)
    this.loading.close()
    this.message && this.message(this._outputFields(res.data))
  }
  _onclose(res){
    this.close && this.close(res)
  }
  _onerror(res){
    // this.setOut =  setTimeout(()=>{
    //   console.log('13131')
    //   this.init()
    // },600)
    vAlert('银联商务控件异常！请重启程序！')
    this.error && this.error(res)
  }
  _outputFields(string) {
    console.log(string)
    let re = /[\u4E00-\u9FA5]/ig;
    let i = string.match(re).length;
    let obj = {}
    obj.returnCode = string.substring(0, 2);   // 返回码
    obj.bankCode = string.substring(2, 6);    // 银行行号
    obj.cardNO = string.substring(6, 26);    // 卡号
    obj.voucherNO = string.substring(26, 32);   // 凭证号
    obj.amount = string.substring(32, 44);    // 金额
    obj.misrepresentation = string.substring(44,84-i); // 错误说明
    obj.merchantNO = string.substring(84-i,99-i);  // 商户号
    obj.terminalNO = string.substring(99-i,107-i);  // 终端号
    obj.batchNO = string.substring(107-i,113-i);  // 批次号
    obj.tradeDate = string.substring(113-i,117-i);  // 交易日期
    obj.tradeTime = string.substring(117-i,123-i);  // 交易时间
    obj.tradeRef = string.substring(123-i,135-i);  // 交易参考号
    obj.authorization = string.substring(135-i,141-i); // 授权号
    obj.settlementDate = string.substring(141-i,145-i);// 清算日期
    obj.LRC = string.substring(145-i,148-i);   // LRC校验 
    obj.body = string
    return obj
   }
  _applicationType(){//消费类型  循序1
  if(this.payType == 1) return '02' //无硬件应用类型
  }
  _posCode(){ //pos机号 8位 循序2
      return '12345678'
  }
  _posEmpno(code){//pos机号 8位 循序3
    let userAccount = code || localStorage.getItem('userAccount')
    if(userAccount.length > 8) return userAccount.substring(0,8)
    if(userAccount.length != 8){
        let i = userAccount.length;
        for(i;i < 8; i++){
            userAccount += ' ';
        }
    }
    return userAccount
  }
  _transactionType(){ //交易类型标志 循序4
      return '00' //消费
  }
  _payAmount(data){//JH支付金额转换 循序5
      let amountArr = data.split('.')
      if(!amountArr[1]){
          amountArr[1] = '00'
      }
      if((amountArr[1]+'').length !=2){
          amountArr[1] = amountArr[1]+'0'
      }
      if(amountArr[1].length > 2){
        amountArr[1] = amountArr[1].substring(0,2)
      }
      let amount = amountArr.join('');
      let i = amount.length;
      for (i ; i < 12; i++){
          amount = '0'+amount
      }
      return amount
  }
  _transactionDate(){ //消费日期 循序6
      let date = new Date();
      let YYYY = date.getFullYear();
      let MM = date.getMonth()+1 >9 ? date.getMonth()+1 : '0'+(date.getMonth()+1)
      let DD = date.getDate()+1 >9 ? date.getDate()+1  : '0'+(date.getDate()) 
      return `${YYYY}${MM}${DD}`
  }
  _transactionCode(code){ //原交易参考号 用于退货 12位 不足12位空格填充 循序7
      let transactionCode = code || ''
      let i = transactionCode.length;
      for(i;i < 12; i++){
          transactionCode += ' ';
      }
      return transactionCode
  }
  _voucherNO(code){//原凭证号 用于撤销 6位 不足6位空格填充 循序8
      let voucherNO = code || ''
      let i = voucherNO.length;
      for(i;i < 6; i++){
          voucherNO += ' ';
      }
      return voucherNO
  }
  _lrcCode(){ //3位随机数字 循序9
      let num = '';
      for(var i=0;i<3;i++)
      {
          num+=Math.floor(Math.random()*10);
      }
      return num
  }
  _payCode(code){ //串码 循序10  50位
      let payCode = code || ''
      let i = payCode.length;
      for(i;i < 50; i++){
        payCode += ' ';
      }
      return payCode
      // return '1363899303375                                '
  }
  
  _bankBillCode(code){ //银商订单号   循序11  50位
    let bankBillCode = code || ''
    let i = bankBillCode.length;
      for(i;i < 50; i++){
        bankBillCode += ' ';
      }
      return bankBillCode
 
  }
  _ERPBillCode(code){//对账订单号 循序12 //50位 比如YYYYMMDDhhmmss+随机数 不足右补空格
    let date = new Date();
    let YYYY = date.getFullYear();
    let MM = date.getMonth()+1 >9 ? date.getMonth()+1 : '0'+(date.getMonth()+1)
    let DD = date.getDate() >9 ? date.getDate()  : '0'+(date.getDate()) 
    let hh = date.getHours() >9 ? date.getHours()  : '0'+(date.getHours())
    let mm = date.getMinutes() >9 ? date.getMinutes()  : '0'+(date.getMinutes())
    let ss = date.getSeconds() > 9 ? date.getSeconds() : '0'+(date.getSeconds())
    let ERPBillCode = ''
    if(code){
      ERPBillCode = `${YYYY}${MM}${DD}${hh}${mm}${ss}${code}`
    }
    let i = ERPBillCode.length;
    for(i;i < 50; i++){
      ERPBillCode += ' ';
    }
    return ERPBillCode

  }
  _sendData(){
      const { applicationType,posCode,posEmpno,transactionType,payAmount,transactionDate,transactionCode,voucherNO,lrcCode,payCode,bankBillCode,ERPBillCode} = this
      return `${applicationType}${posCode}${posEmpno}${transactionType}${payAmount}${transactionDate}${transactionCode}${voucherNO}${lrcCode}${payCode}${bankBillCode}${ERPBillCode}`
      
  }

}