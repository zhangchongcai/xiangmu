export default class printing {
  constructor(){
    this.initData();
  }
  initData(){
    this.size10 = 10;
    this.height10 = 15
    this.size12 = 12;
    this.height12 = 17;
    this.size13 = 13;
    this.height13 = 18;
    this.size15 = 15;
    this.height15 = 21;
    this.height = 0;
	  this.printInfo = {
      width:200,
      height:300,
      ticket_element:[]
    };
    this.voucherTicketCenterBodyInfo={
      '支付宝交易号:':'2088101106499364',
      '付款账户:':'SA201402210001'
    }
    this.footBodyInfo = {
      '交易流水号:' : 'SA201402210001',
      '交易时间:' : '2013-04-25 19:25:17',
      '终端:' : '003',
      '收银员:' : '张三'
    }
    this.returnGoodsVoucherData = {}
    this.pickUpGoodsVoucherData = {},
    this.voucherTicketTitle = {
      welcome : '欢迎光临',
      cinemaName:  localStorage.getItem('cinemaName'),
      voucherTypeStr : '',
    }
    this.takeMoneyVoucherData = {
      body:{
        '交易时间:' : '2019-07-19 15:43:54',
        '抽钞金额:' : '100',
        '终端:':'100042',
        '收银员:':'系统管理员',
        '抽钞人:':'李伟萍'
      },
      foot:['收银员:','抽钞人:']
    }
    this.couponVoucherData = {
      body : {
        '票券名称:' : '测试优惠券',
        '票券类型:' : '优惠券',
        '原票券编号:' : '059359021509',
        '新票券编号:' : '486637285237',
        '打印日期:' : '2019-07-17 14:22:21',
        '终端编号:' : '1000070',
        '退货单号:' : '000100007201907170003'
      },
      barCode : 12345678
    }
    this.transactionData = {}

  }
  payVoucher(){ //支付凭证
    this._initPrintInfo()
    this.voucherTicketTitle.voucherTypeStr = '支付凭证';
    this._voucherTicket();
    this.printInfo.height =  this.height > 300 ? this.height : 300
    return this.printInfo;
  }
  refundVoucher(){ //退款凭证
    this._initPrintInfo()
    this.voucherTicketTitle.voucherTypeStr = '退款凭证';
    this._voucherTicket();
    this.printInfo.height =  this.height > 300 ? this.height : 300
    return this.printInfo;
  }
  returnGoodsVoucher(data){//退货凭证
    this._initPrintInfo()
    this.voucherTicketTitle.voucherTypeStr = '退货凭证';
    this._initReturnGoodsVoucherData(data)
    this._returnGoodsVoucherTicket()
    this.printInfo.height =  this.height > 300 ? this.height : 300
    return this.printInfo;
  }
  takeMoneyVoucher(){//抽钞凭证
    this._initPrintInfo()
    this.voucherTicketTitle.voucherTypeStr = '抽钞凭证'
    delete this.voucherTicketTitle.welcome
    this._takeMoneyVoucherTicket()
    this.printInfo.height =  this.height > 300 ? this.height : 300
    return this.printInfo;

  }
  couponVoucher(data){ //票券退货凭证
    this._initPrintInfo()
    this.voucherTicketTitle.voucherTypeStr = '票券退货凭证'
    delete this.voucherTicketTitle.welcome
    this._initCouponVoucherData(data)
    this._couponVoucherTicket()
    this.printInfo.height =  this.height > 300 ? this.height : 300
    return this.printInfo;
  }
  pickUpGoodsVoucher(data){ //取货凭证
    this._initPrintInfo()
    this.voucherTicketTitle.voucherTypeStr = '取货凭证'
    delete this.voucherTicketTitle.welcome
    delete this.voucherTicketTitle.cinemaName
    this._initPickUpGoodsVoucherData(data)
    this._pickUpGoodsVoucherTicket()
    this.printInfo.height =  this.height > 300 ? this.height : 300
    return this.printInfo;

  }
  transactionVoucher(){
    
  }
  _initPrintInfo(){
    this.height = 0;
    this.voucherTicketTitle = {
      welcome : '欢迎光临',
      cinemaName:  localStorage.getItem('cinemaName'),
      voucherTypeStr : '',
    }
    this.printInfo = {
      width:200,
      height:300,
      ticket_element:[]
    };
  }
  _centerx(str,size){//居中的x
    return (this.printInfo.width - (str.length*(this.printInfo.width/size))) / 2
  }
  _rightx(str,size){//居右的x
    return (this.printInfo.width - (str.length*(this.printInfo.width/size))/2)
  }
  _initReturnGoodsVoucherData(data){
    let movies = data.movies ? data.movies[0] : {movieItems:[]};
    this.returnGoodsVoucherData = {
      cinemaTickets : {
        name : movies.movieSchName,
        names:[],
        tickets:movies.movieItems.map(item => {
          return {
            seat: item.movieName, num : 1, price:Number(item.salePrice).toFixed(2)
          }
        })
      },
      goods : data.mers ? data.mers.map(item => {
        return{
              name: item.goodsName,num:item.saleNum,price:Number(item.salePrice).toFixed(2)
              }
          }) : [],
      prices:{
        '退款合计:' : Number(data.totalAmount).toFixed(2),
        '退款明细:' : data.payRefundItems.map(item => {
          return {
            str:item.payTypeName+'：',
            pay:item.payTypeInfo,
          }
        })
      },
      foot:{
        '退货时间:' : data.refundTime,
        '交易类型:':data.saleTypeName,
        '操作人:' :data.cashier
      }
    }

  }
  _initPickUpGoodsVoucherData(data){
    let goodsEntityList = data.goodsEntityList.filter((item)=>{
        if([1,2,3,12,13].includes(item.goodsType)){
          return item
        }
    })
    this.pickUpGoodsVoucherData = {
      goodsEntityList,
      saleMerItemMap:data.saleMerItemMap,
      getCode:data.getCode,
      foot:{
        '影院：': data.cinemaName,
        '交易流水号：' : data.transactionCode,
        '交易时间：' : data.transactionDate,
        '终端：':data.terminalCode,
        '收银员：':data.cashier
      }
    }
  }
  _initTransactionData(data){
    this.transactionData = {
      goodsEntityList:data.goodsEntityList,
      saleMerItemMap:data.saleMerItemMap,
      barCode:data.billCode,
      payedMap:data.payedMap,
      
      foot:{
        '影院：': data.cinemaName,
        '交易流水号：' : data.transactionCode,
        '交易订单号':data.billCode,
        '交易时间：' : data.transactionDate,
        '终端：':data.terminalCode,
        '收银员：':data.cashier
      }
    }
  }
  _initCouponVoucherData(data){
    this.couponVoucherData = {
      body : {
        '票券名称:' : data.ticketName,
        '票券类型:' : data.ticketType,
        '原票券编号:' : data.originalTicketCode,
        '新票券编号:' : data.newTicketCode,
        '打印日期:' : data.printDate,
        '终端编号:' : data.terminalCode,
        '退货单号:' : data.refundNum,
      },
      barCode : data.newTicketCode
    }
  }
  
  _returnGoodsVoucherTicket(){//退货的第一张小票
    const { cinemaTickets,goods,prices,foot } = this.returnGoodsVoucherData;
    this._title(this.voucherTicketTitle) //标题部分
    this._hrLine()//hr线
    if(cinemaTickets.name) this._br(cinemaTickets.name,9,cinemaTickets.names)//影票命换行转数组
    for (let text of cinemaTickets.names){//遍历影票名字
      this.printInfo.ticket_element.push(this._item(text,0,this.height,this.size12))
      this.height += this.height12;
    }
    for (let item of cinemaTickets.tickets){//遍历座位
      this._twoColumn(item.seat,item.num+' X '+item.price,this.size12)
    }
    for (let item of goods){//遍历商品
      this._twoColumn(item.name,item.num+' X '+item.price)
    }
    this._hrLine()//hr线
    for (let [k,v] of Object.entries(prices)){//付款明细区
      if(typeof v == 'string' ){
        this._keyValueInfo(k,v+'元')
      }else{
        this._keyValueInfo(k,'')
        for (let item of v){
          this._keyValueInfo(item.str,item.pay,this.size12)
        }
      }
    }
    this._hrLine()//hr线
    for (let [k,v] of Object.entries(foot)){ //尾部区
      this._keyValueInfo(k,v)
    }
  }
  _couponVoucherTicket(){//票券凭证
    this._title(this.voucherTicketTitle)
    this._hrLine()
    for (let [k,v] of Object.entries(this.couponVoucherData.body)){
      this._keyValueInfo(k,v)
    }
    this._hrLine()
    this._barCode(this.couponVoucherData.barCode)
  }
  _voucherTicket(){ //第二张小票类
    this._title(this.voucherTicketTitle)
    this._hrLine()
    this._flexibleInfo();
    for (let [k,v] of Object.entries(this.voucherTicketCenterBodyInfo)){
      this._keyValueInfo(k,v)
    }
    this._hrLine()
    for (let [k,v] of Object.entries(this.footBodyInfo)){
      this._keyValueInfo(k,v)
    }
  }
  _takeMoneyVoucherTicket(){ //抽钞凭证
    this._title(this.voucherTicketTitle)
    this._hrLine()
    for (let [k,v] of Object.entries(this.takeMoneyVoucherData.body)){
      this._keyValueInfo(k,v)
    }
    this._hrLine()
    for(let text of this.takeMoneyVoucherData.foot){
      this._keyValueInfo(text,' _________',0,15)
    }
  }
  _pickUpGoodsVoucherTicket(){//取货凭证
    this._title(this.voucherTicketTitle)
    this._hrLine()
    this._barCode(this.pickUpGoodsVoucherData.getCode)
    this._hrLine()
    for(let i = 0 ; i < this.pickUpGoodsVoucherData.goodsEntityList.length; i++){
      let item = this.pickUpGoodsVoucherData.goodsEntityList[i]
      this._twoColumn(`${i+1}.${item.goodsName}`,`x ${item.saleNum}`,5,170)
      if(item.goodsType == 3){
        let subItemStr = this.pickUpGoodsVoucherData.saleMerItemMap[item.uid].map((subItem) => {
          return `${subItem.merName}x${subItem.needCount}`
        }).join(' ')
        let nameArr = [];
        this._br(subItemStr,this.size10,nameArr)
        for (let text of nameArr){//遍历影票名字
          this.printInfo.ticket_element.push(this._item(text,15,this.height,this.size10))
          this.height += this.height10;
        }
      }
    }
    this._hrLine()
    for (let [k,v] of Object.entries(this.pickUpGoodsVoucherData.foot)){ //尾部区
      this._keyValueInfo(k,v,5)
    }

  }
  _br(str,size,arr,width = this.printInfo.width){ //换行
    let maxStrNum = parseInt(width / size);
    if(str.length < maxStrNum){
      arr.push(str)
    }else{
      arr.push(str.substr(0,maxStrNum))
      this._br(str.substring(maxStrNum),size,arr,width)
    }
  }
  _barCode(code,size = 12){
    const { printInfo, _item } = this; 
    printInfo.ticket_element.push(_item(code,(this.printInfo.width - 190)/2,this.height,size,0,2))
    this.height += 33;
    printInfo.ticket_element.push(_item(code,this._centerx(code+'',24)*1.4,this.height,size,0,0))
    this.height += this.height12;
  }
  _twoColumn(leftText,rightText,x=0,width){ //两栏一行
    const { printInfo,_item,size12 } = this; 
    let nameArr = [];
    this._br(leftText,size12,nameArr,width)
    printInfo.ticket_element.push(_item(nameArr[0],x,this.height,size12))
    printInfo.ticket_element.push(_item(rightText,this._rightx(rightText,size12)+10,this.height,size12))
        this.height += this.height12;
    for(let i = 1 ; i < nameArr.length ; i++){
      printInfo.ticket_element.push(_item(nameArr[i],x,this.height,size12))
      this.height += this.height12;
    }
  }
  _hrLine(){
    const { _item } = this; 
    let v = '—————————————————'
    this.printInfo.ticket_element.push(_item(v,0,this.height,this.size12))
        this.height += this.height15;
  }
  _title(obj){
    const { printInfo,_item,size15 ,height15} = this; 
    for (let [k, v] of Object.entries(obj)) {
      printInfo.ticket_element.push(_item(v,this._centerx(v,size15),this.height,size15))
      this.height += height15;
    }
  }
  _flexibleInfo(){//flex栏
    const { printInfo,_item,height,size12,height12 } = this; 
    printInfo.ticket_element.push(_item('实收:',0,height,size12))
    printInfo.ticket_element.push(_item('支付宝:',this._centerx('支付宝',size12),height,size12))
    printInfo.ticket_element.push(_item('50.00',this._rightx('50.00',size12),height,size12))
    this.height += height12;
  }
  _keyValueInfo(k,v,x = 0,y=0){//key、value拼接
    const { printInfo,_item,height,size12,height12 } = this; 
    printInfo.ticket_element.push(_item(k+v,x,height,size12))
    this.height += height12+y;
  }
  _item(elementValue,x,y,font_size,font_black = 0,show_modle=0,){ //打印对象
    return {
      elementValue,
      x,
      y,
      font_size,
      font_black,
      show_modle
    }
  }
}