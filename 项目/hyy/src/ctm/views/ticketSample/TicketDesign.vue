<template>
    <div :class='["ticket_design",isZoom ? "full" : ""]'  >
        <div class="aside_lef">
            <el-aside width="240px" >
                <div class="edit_ele" >
                    <!-- 全部元素 -->
                    <div class="title"><span>票版元素</span><span style="margin-left:5px;">(请拖动选择)</span></div>
                    <el-collapse v-model="activeNames">
                    <el-collapse-item title="全部元素" name="1">
                        <div v-for="(item,ind) in ele_list" :key="ind" class="content" v-show="!item.isSele">
                                <span @mousedown="drag($event,item,ind)">
                                    <span class="star_require" v-if='item.require'>*</span>
                                    <span :style="item.require? '':'padding-left:12px'" style="cursor:pointer" >
                                        {{item.name}}:{{item.description}}
                                    </span>
                                </span> 
                        </div>
                    </el-collapse-item>
                    <!-- 已选元素 -->
                    <el-collapse-item title="已选择元素" name="2">
                        <div v-for="(item,ind) in ele_list" :key="ind" class="content" v-show="item.isSele">
                                <span @mousedown="drag($event,item,ind)">
                                    <span class="star_require" v-if='item.require'>*</span>
                                    <span :style="item.require? '':'padding-left:12px'" style="cursor:pointer" >
                                        {{item.name}}:{{item.description}}
                                    </span>
                                </span> 
                        </div>
                    </el-collapse-item>
                </el-collapse>
                </div>
            </el-aside>
        </div>
        
        <el-main>
            <div class="main">
                <p class="main_title">票版名称：{{edi_ele.name}}</p> 
                <i class="iconfont icon-neiye-quanping" @click="scale_zoom"></i>        
                <div :class='["design_box",isZoom ? "" : ""]' ref="design_box">
                    <div class="scale_X" >
                        <ul>
                            <li v-for="(item,ind) in scale_length" :key="ind"></li>
                        </ul>
                    </div>
                    <div class="scale_Y" >
                        <ul>
                            <li v-for="(item,ind) in scale_length" :key="ind"></li>
                        </ul>
                    </div>
                    <div class="scale_box">
                        <canvas ref="mouse_canvas"
                        width="500px" height="500px"
                        @mousedown="mouseCanves_Mdown"></canvas>
                    </div>
                </div>
                <div class="del">
                        <el-button type="primary" plain @click="delCureentElement">删除元素</el-button>
                </div>
                        <div style="display:inline-block;border-radius:4px;font-size:12px;border:1px solid orange;padding:5px;color:#333;margin-top:5px">
                            <p>键盘“删除”键删除选中元素</p> 
                            <p>键盘方向键微调选中元素位置</p>
                        </div>
            </div>
            
        </el-main>
        <div class="aside_right">
            <el-aside width="320px ">
                <div class="edi_ele">
                    <p>编辑属性</p>
                    <div class="option-warp">
                        <label class="name">导入样票：</label>
                        <div class="content">
                            <div class="file_sele">
                                <div href="javascript::void(0)" class="file-btn" type="plain"  @click="handerTicketFile">选择文件</div>
                                <span>{{fileName}}</span>
                                <input type="file" @change="readTicketFile($event)" ref="ticketFile" style="display:none">
                            </div>
                        </div>
                    </div>
                    <div class="option-warp">
                        <label class="name">适用影院：</label>
                        <div class="content">
                            <div class="inputFrame nowrap">
                                <el-input type="input" v-model="cinemaNameList"
                                @focus="cinemaDialogShow"
                                clearable
                                @clear="clearCinemaName"
                                :disabled="isDefualtticketSample"
                                ></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="option-warp">
                        <label class="name">票版名称：</label>
                        <div class="content">
                            <div class="inputFrame nowrap">
                                <el-input type="input" v-model="edi_ele.name"
                                :disabled="isDefualtticketSample"
                            ></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="option-warp sample-size">
                        <label class="name">票版尺寸：</label>
                        <div class="content">
                            <div class="ticketSize">
                                <el-input type="input" v-model="edi_ele.width" placeholder="宽mm" @change="scale_input_width"></el-input> <span style="margin:0 5px;color:#666666">X</span> 
                                <el-input type="input" v-model="edi_ele.height" placeholder="高mm" @change="scale_input_height"></el-input>
                            </div>
                            <div class="sel-size">
                                <el-radio-group v-model="size"
                                @change="size_sel"
                                >
                                    <el-radio :label="60" style="margin-left: 30px;">60mm  <span style="margin:0 5px;color:#666666">X</span>  80mm</el-radio>
                                    <el-radio :label="70" style="margin-left: 30px;">70mm  <span style="margin:0 5px;color:#666666">X</span> 80mm</el-radio>
                                    <el-radio :label="90" style="margin-left: 30px;">90mm  <span style="margin:0 5px;color:#666666">X</span>  80mm</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                    </div>
                    <div class="option-warp" style="height:auto">
                        <label class="name">适用渠道：</label>
                        <div class="content">
                            <div class="qudao">
                                <el-select
                                v-model="channel_new"
                                multiple
                                size="mini"
                                remove-tag
                                placeholder="选择渠道"
                                @change="channel_change"
                                @visible-change="channel_handel"
                                :disabled="isDefualtticketSample"
                                >
                                <el-option
                                v-for="item in channels"
                                :key="item.value"
                                :label="item.name"
                                :value="item.uid">
                                </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="option-warp">
                        <label class="name">第三方票类专用：</label>
                        <div class="content">
                            <el-radio-group v-model="edi_ele.isOtherUse">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="option-warp">
                        <label class="name">是否设置标题打印：</label>
                        <div class="content">
                            <el-radio-group v-model="edi_ele.isPrintTitle" @change="changePrintTitle">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="option-warp">
                        <label class="name">打印方向：</label>
                        <div class="content">
                            <el-radio-group v-model="edi_ele.printMode">
                                <el-radio :label="1" style="margin-right:18px">横向</el-radio>
                                <el-radio :label="2">纵向</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="curren_eleSel">
                        <div class="option-warp">
                            <label style="margin-right:26px">当前选定</label>
                            <div class="content">{{selected_element.name}}</div>
                        </div>
                        <div class="option-warp">
                            <label class="name">字体大小：</label>
                            <div class="content">
                                <div class="inputFrame">
                                <el-select v-model="selected_element.size" placeholder="请选择" @change="fontSize_change">
                                    <el-option
                                    v-for="item in fontOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div> 
                            </div>
                        </div>
                        <div class="option-warp" v-show="edi_ele.isPrintTitle==1">
                            <label class="name">打印标题：</label>
                            <div class="content">
                                <el-radio-group v-model="selected_element.isPrintTitle" @change="isPrintTitle_change ">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                            </div>
                        </div>
                        <div class="option-warp">
                            <label class="name">是否加粗：</label>
                            <div class="content">
                                <el-radio-group v-model="selected_element.bold" @change="bold_change">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="option-warp">
                            <label class="name">展示方式：</label>
                            <div class="content">
                                <div class="show-way" >
                                    <el-radio-group v-model="selected_element.showMode" @change="showMode_change">
                                        <el-radio :label="0" :disabled="model">文本</el-radio>
                                        <el-radio :label="1" >二维码</el-radio>
                                        <el-radio :label="2" :disabled="model">条码</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                        </div>
                        <div class="option-warp">
                            <label class="name">每行打印字符数：</label>
                            <div class="content">
                                <div class="inputFrame">
                                    <el-select v-model="selected_element.textLength" placeholder="请选择" @change="fontLength_chang">
                                        <el-option
                                        v-for="item in fontCount"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div> 
                            </div>
                        </div>
                        <div class="btn">
                            <div v-if="this.uid" class="foot-btn">
                                <el-button type="primary" @click="saveTicketSample('edit')" >完成编辑</el-button>
                                <el-button @click="abandon" style="margin-left:32px">放弃编辑</el-button>
                            </div>
                            <div v-else class="foot-btn">
                                <el-button type="primary" @click="saveTicketSample('new')" >完成编辑</el-button>
                                <el-button @click="abandon" style="margin-left:32px">放弃编辑</el-button>
                            </div>
                        </div>
                            
                    </div>
                </div>
            </el-aside>
        </div>
            
    <!-- 选择影院弹窗 -->
    <!-- <muti-cinema
      title="选择影院"
      v-if="cinemaDialogVisible"
      @close="cinemaDialogVisible=false"
      :innerData="[]"
      :dialogTableVisible.sync="cinemaDialogVisible"
      ref="movieSelectDialog"
      @callBack="handleCinemaDialogCallBack"
    ></muti-cinema>     -->
    <single-cinema
      @close="singleCinemaVisible=false"
      v-if="singleCinemaVisible"
      :framedialogVisible="singleCinemaVisible"
      :whereUse="null"
      :type="2"
      :innerData="cinemaData"
      @callBackSingle="handleSingleCallBack"
      ref="frameSingleCinema"
    >
      <div slot="footerId">
        <el-button @click="singleCinemaVisible= false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmCinemaSingleDialog(), singleCinemaVisible= false"
        >确 定</el-button>
      </div>
    </single-cinema>
    </div>
</template>
<script>
import qs from 'qs';
// import MutiCinema from 'ctm/components/cinema/MutiCinema';
import SingleCinema from 'ctm/components/cinema/SingleCinema'

export default {
    components:{
        SingleCinema
    },
    data() {
      return {
        /**
         * @param 影院单选  
        */
            singleCinemaVisible: false,
            cinemaList:[],
            cinemaNameList:'',
            cinemaData:{},

            isZoom:false,
            activeNames: ['1',"2"],
            model:false,
            //字体大小数组
            fontOption: [
                { label:'12号字体',value:12 },
                { label:'13号字体',value:13 },
                { label:'14号字体',value:14 },
                { label:'15号字体',value:15 },
                { label:'16号字体',value:16 },
                { label:'17号字体',value:17 },
                { label:'18号字体',value:18 },
                { label:'19号字体',value:19 },
                { label:'20号字体',value:20 },
                { label:'21号字体',value:21 },
                { label:'22号字体',value:22 },
                { label:'23号字体',value:23 },
                { label:'24号字体',value:24 },
                { label:'25号字体',value:25 },
                { label:'26号字体',value:26 },
            ],
            //每行列数数组
            fontCount: [
                { label:'1',value:1 },  { label:'2',value:2 },{ label:'3',value:3 },{ label:'4',value:4 },{ label:'5',value:5 },{ label:'6',value:6 },{ label:'7',value:7 },{ label:'8',value:8 },{ label:'9',value:9 },{ label:'10',value:10 },
                { label:'11',value:11 },{ label:'12',value:12 },{ label:'13',value:13 },{ label:'14',value:14 },{ label:'15',value:15 },{ label:'16',value:16 },{ label:'17',value:17 },{ label:'18',value:18 },{ label:'19',value:19 },{ label:'20',value:20 },
                { label:'21',value:21 },{ label:'12',value:22 },{ label:'13',value:23 },{ label:'24',value:24 },{ label:'25',value:25 },{ label:'26',value:26 },{ label:'27',value:27 },{ label:'28',value:28 },{ label:'29',value:29 },{ label:'30',value:30 },
                { label:'31',value:31 },{ label:'32',value:32 },{ label:'33',value:33 },{ label:'34',value:34 },{ label:'35',value:35 },{ label:'36',value:36 },{ label:'37',value:37 },{ label:'38',value:38 },{ label:'39',value:39 },{ label:'40',value:40 },
            ],
            //渠道
            channels: [],
            channel_new:[],
            channel_old:[],

            //票版的元素
            ele_list: [],
            //编辑属性
            size: 60,
            edi_ele: {
                name: '',
                width: 60,
                height: 80,
                isOtherUse:1,
                isPrintTitle:1,
                printMode:2,
            },
            fileName:'未选择任何文件',//票样文件名字
            //------------------票版数据-----------
            kName:{
                "k001":"影院",
                "k002":"电影票编码",
                "k003":"影厅",
                "k004":"座位",
                "k005":"影片",
                "k006":"日期",
                "k007":"时间",
                "k008":"座类",
                "k009":"票类",
                "k010":"票价",
                "k011":"工号",
                "k012":"售出时间",
                "k013":"场次",
                "k014":"电影票信息码",
                "k015":"代售服务费",
                "k016":"增值服务费",
                "k017":"防伪码",
                "k018":"重打印",
                "k019":"对号入座",
                "k020":"支付方式",
                "k021":"副券影票编码",
                "k022":"售票员",
                "k023":"销售渠道",
                "k024":"说明"
            },
            mmToPixel: 3.99,    //默认1mm=3.99px
            //图片路径
            sele_background:null,
            defualt_background:require('ctm/assets/images/ticketSample/ticket.jpg'),
            qrcode:require('ctm/assets/images/ticketSample/qrcode.jpg'),
            barcode:require('ctm/assets/images/ticketSample/barcode.jpg'),
            scale_length:45,//尺标大小
            uid : '', //票版的uid
            isDefualtticketSample:false,
            //票版的边界
            boxBoder_x:"",
            boxBoder_y:"",
            mouse_canv:null,//画布对象
            mouse_context:"", //画布上下文
            mouseCanv_width:240,  //画布大小
            mouseCanv_height:319,
            selected_line_length:14, //十字架长度
            mouse_down_coord:{x:0,y:0},  //画布的坐标
            zoom:1.0,   //比例大小
            ticket_data:[], //画布元素列表
            selected_No : '',//选中元素索引号
            selected_element:{//当前选中的元素
                name:'',
                size:'',
                showMode:'',
                isPrintTitle:'',
                bold:'',
                textLength:'',
            }, 
             //字体大小数组
        };

    },
    watch: {
        mouse_context: {
            handler(New , Old) {
                this.repaintCanvas()
            }
        },
        ticket_data: {
            handler(New , Old) {
                this.repaintCanvas()
            }
        },
        defualt_background: {
            handler(New , Old) {
                console.log(New)
                this.repaintCanvas()
            }
        },
        cinemaList : {
            handler(New , Old) {
                console.log(New)
                if(New.length){
                    this.getChannelList(New[0].id);
                }
            }
        }
    },
    methods: {
        //尺寸大小改变
        size_sel(value) {
            this.edi_ele.width = value;
            this.edi_ele.height = 80;
            this.mouseCanv_width = this.edi_ele.width * this.mmToPixel ;
            this.mouseCanv_height = this.edi_ele.height * this.mmToPixel  ;
            this.repaintCanvas();
        },
        scale_input_width(value) {
            this.edi_ele.size="";
            this.edi_ele.width = value = value>=120? 120 : value;
            this.mouseCanv_width = value * this.mmToPixel;
            this.size = '';
            this.repaintCanvas();
        },
        scale_input_height(value) {
            this.edi_ele.size="";
            this.edi_ele.height = value =  value>=120? 120 : value;
            this.mouseCanv_height = value* this.mmToPixel;
            this.repaintCanvas();
        },
        fontSize_change(val) {
            if(this.ticket_data.length && this.selected_No>=0){
                let selected_element = this.selected_element
                selected_element.size = val
                this.mouse_context.font = 'small-caps '+ item.size + "px Courier New"
                selected_element.width = this.mouse_context.measureText(item.description).width //设置元素的宽度
                selected_element.height = val
                this.repaintCanvas()
            }
        },
        fontLength_chang(val) {
            if(this.ticket_data.length && this.selected_No>=0){
                this.selected_element.textLength = val
                this.repaintCanvas()
            }
        },
        bold_change(val) {
            if(this.ticket_data.length && this.selected_No>=0){
                    this.selected_element.bold = val
                    this.repaintCanvas()
            }
        },
        showMode_change(val) {
            if(this.ticket_data.length && this.selected_No>=0){
                let selected_element = this.selected_element
                selected_element.showMode = val
                this.repaintCanvas()
                setTimeout(this.repaintCanvas, 10)
                return
            }
        },
        isPrintTitle_change(val) {
            if(this.ticket_data.length && this.selected_No>=0){
                this.selected_element.isPrintTitle = val
            }
        },
        //是否打印标题
        changePrintTitle(val) {
            if(val==2) {
                console.log(val)
                this.selected_element.isPrintTitle = 0
                this.isPrintTitle_change(0)
            }
        },
        //选择样式票版背景图
        handerTicketFile(){
            this.$refs.ticketFile.click()
        },
        readTicketFile($event) {
            let file = this.$refs.ticketFile.value;
            let oFileReader = new FileReader();
            this.fileName = file.substring(file.lastIndexOf('\\')+1)
            let fileName = file.substring(file.lastIndexOf(".")+1).toLowerCase();
            oFileReader.onloadend =  (e) => {
                let base64 = e.target.result;
                let img = new Image();
                img.src = base64;
                console.log(base64)
                this.sele_background = img;
                this.sele_background.onload = _ => {
                    this.repaintCanvas()
                }
            };
            if(fileName=="jpg" || fileName == "jpeg" || fileName == "png" || fileName == "bmp"){
                if($event.srcElement.files[0].size > 200*1024){
                    this.$refs.ticketFile.value = "";
                    return this.$message({
                        message:'不能图片超过200kb！',
                        type:'warning',
                        durantion:1000,
                    })
                }
                oFileReader.readAsDataURL($event.srcElement.files[0]);
                console.log($event)
            }else{
                this.$refs.ticketFile.value = ""
                this.$message({
                    message:'请选择图片格式！',
                    type:'warning',
                    duration:1000,
                })
            }

        },
        //选择适用影院回调函数
        handleSingleCallBack(opt) {
            this.cinemaList = []
            this.cinemaList.push(opt.data)
            console.log(this.cinemaList)
            this.cinemaNameList = opt.data.name
        },
        cinemaDialogShow() {
            this.singleCinemaVisible = true                
        },
        confirmCinemaSingleDialog () {
        this.$refs.frameSingleCinema.confirmData()
        },
        //清除适用影院
        clearCinemaName() {
            this.cinemaList = []
            this.cinemaNameList = []
            this.channels = []
            this.channel_new = []
        },
        //渠道下拉框弹出
        channel_handel(open) {
            if(open){
                if(!this.cinemaList.length) { 
                    return this.$message({type:'warning',message:'请先选择适用影院'})
                }
            }
        },
        //渠道
        channel_change(val) {
            console.log(val,'新')
            console.log(this.channel_old,'旧1')
            var flag = false;
            var currentItem ="";
            this.channel_new.forEach(item=>{
                if(this.channel_old.length==0){
                    this.channel_old.push(item)
                    console.log(item,'当前')
                    flag =true;
                    currentItem = item
                }
                var val = this.channel_old.find(it=>it==item)
                if(!val){
                    this.channel_old.push(item)
                    flag = true;
                    currentItem = item
                    console.log(item,'当前')
                }
            
            })
            if(flag){
                let data ={
                    cinemaUid : this.cinemaList[0].id,
                    channelUid : currentItem
                }
                console.log(data,'-----------检验渠道')
                this.$ctmList.checkChannelExsit(data).then(data => {
                        if(data && data.code == 200){
                            console.log(data)
                            if(data.data){  //true为已被绑定
                                this.channel_new.forEach((it,ind)=>{
                                    if(it == currentItem){
                                        this.channel_new.splice(ind,1)
                                    }
                                })
                                this.channel_old.forEach((it,ind)=>{
                                    if(it == currentItem){
                                        this.channel_old.splice(ind,1)
                                    }
                                })
                                console.log(this.channel_old,'旧2')
                                let message = data.msg? data.msg : '渠道已被其他票版绑定，请先解绑'
                                this.$message({
                                    message,
                                    type: 'warning',
                                    duration: 1500,
                                })
                            }
                        }
                    })
            }
            
        },
        //内页放大
        scale_zoom() {
            this.isZoom = !this.isZoom;
            if(this.isZoom){ //放大
                // this.scale_length = 55
                this.mouse_context.scale(1.3,1.3);
                this.zoom = 1.3
                this.repaintCanvas();
            }else{
                // this.scale_length = 45
                this.mouse_context.scale(1/1.3,1/1.3);
                this.zoom = 1;
                this.repaintCanvas();
            }
            this.$nextTick( _ => {
                // 元素库拖动的边界范围
                this.boxBoder_x = this.mouse_canv.getBoundingClientRect().left;
                this.boxBoder_y = this.mouse_canv.getBoundingClientRect().top;
            })
             
        },
        //当前选中元素 编辑的值
        selectedCurrentElement(item) {
            if(item){ 
                this.selected_element = item   
            }else{
                this.selected_element = {
                    name:'',
                    size:'',
                    showMode:'',
                    isPrintTitle:'',
                    bold:'',
                    textLength:'',
                }
                this.selected_No=-1
            }
        },
        //删除当前元素
        delCureentElement() {
            let selected = this.selected_element;
            if(this.ticket_data.length && this.selected_No>=0){
            console.log("删除当前元素:",selected.name,'序号：',this.selected_No)
                let _ticket_data = this.ticket_data
                let _itemCode = selected.itemCode;
                let name = selected.name
                _ticket_data.splice(this.selected_No,1); //删除当前选中元素
                this.selectedCurrentElement("");
                this.selected_No = -1 
                selected = null;
                let flag = _ticket_data.find((element) =>(element.itemCode == _itemCode))
                this.ele_list.forEach(item=> {
                    if(item.code == _itemCode ){
                        if(!flag){
                            item.isSele = 0
                            return
                        }
                    }
                this.repaintCanvas();
                })
            }
        },
        // 拖拽元素库
        drag(e,item,ind) {
            var  target= e.target.parentNode.parentNode;
            var newEl=target.cloneNode(true);
            newEl.style.position= 'absolute';
            newEl.style.left = e.pageX + 'px';
            newEl.style.top = e.pageY + 'px';
            newEl.style.corson = 'pointer';
            document.documentElement.appendChild(newEl);
            document.onmousemove = (e) =>{
                newEl.style.left = e.pageX-10 + 'px';
                newEl.style.top = e.pageY-10 + 'px';
            };
            document.onmouseup = (e) => {
                if( e.clientX > this.boxBoder_x && 
                    e.clientX < this.boxBoder_x + this.mouseCanv_width * this.zoom  &&
                    e.clientY > this.boxBoder_y && e.clientY < this.boxBoder_y  + this.mouseCanv_height * this.zoom
                    ) {
                    document.documentElement.removeChild(newEl); // 移除元素
                    let obj = {};
                    // obj = item;
                    obj = JSON.parse(JSON.stringify(item));
                    //元素在画布的坐标
                    obj.bold = 0;//是否粗体
                    obj.delFlag = 0; //是否删除
                    obj.isPrintTitle = 0; //是否打印标题
                    obj.ulX = ( e.clientX - this.mouse_canv.getBoundingClientRect().left) / this.zoom;  //设置元素的位置
                    obj.ulY = ( e.clientY - this.mouse_canv.getBoundingClientRect().top) / this.zoom;
                    obj.itemCode = obj.code; //元素code
                    obj.showMode = obj.code=="k014"?1: 0; //默认文本  如果是电影院信息码则只能为二维码，不能为文本
                    obj.size = 12;  //设置元素的大小
                    obj.textLength = 40; //设置元素每行的长度
                    this.mouse_context.font = 'small-caps ' + obj.size + "px Courier New";
                    obj.width = this.mouse_context.measureText(obj.description).width //设置元素的宽度
                    obj.height = obj.size; //设置高 
                    obj.itemDefaultValue = obj.description; //设置元素的默认值
                    this.ticket_data.push(obj);
                    this.selectedCurrentElement(this.ticket_data[this.ticket_data.length-1]); //设置当前选中的元素
                    this.selected_No = this.ticket_data.length-1 //设置当前选中元素的下标
                    this.ele_list[ind].isSele = 1;
                    
                    this.repaintCanvas();  //重绘
                    
                }else{
                    this.$message( {
                        message: '请将元素拖到画布上',
                        type: 'warning',
                        duration: 1000,
                    })
                    document.documentElement.removeChild(newEl);
                }   
                document.onmousemove = null;
                document.onmouseup = null;
            };

        },

        //画十字架
        draw_cross() {
            var mouse_context= this.mouse_context;
            mouse_context.strokeStyle = '#F00';
            mouse_context.save();
            mouse_context.translate(0.5,0.5); 
            mouse_context.lineWidth = 1;
            var lineWidth = this.selected_line_length;
            mouse_context.beginPath();
            mouse_context.moveTo(this.selected_element.ulX - lineWidth,this.selected_element.ulY);
            mouse_context.lineTo(this.selected_element.ulX + lineWidth,this.selected_element.ulY);
            mouse_context.stroke();
            mouse_context.closePath();

            mouse_context.beginPath();
            mouse_context.moveTo(this.selected_element.ulX,this.selected_element.ulY - lineWidth);
            mouse_context.lineTo(this.selected_element.ulX,this.selected_element.ulY + lineWidth);
            mouse_context.stroke();
            mouse_context.closePath();
            mouse_context.restore();
        },
        //文本画笔
        drawText(ctx,item) {
            var fontSize = item.size? item.size : 12 ; 
            var bold = item.bold? "bold" : '';
            ctx.font =`${bold} ${fontSize}px MicrosoftYaHei`;
            ctx.fillStyle = '#333333'
            ctx.textBaseline = 'top';
            var wraplen = item.textLength;
            var text = item.itemDefaultValue
            if(item.textLength > 0) {
                var len = text.length;
                var arr_val =  new Array();
                while (len >0) {
                    if(len < wraplen){
                        arr_val.push(text);
                        break;
                    }else {
                        arr_val.push(text.substring(0, wraplen));
                    }
                    text = text.substring(wraplen,len);
                    len = text.length;
                }
                var size = arr_val.length;
                for(var i=0;i<size;i++) {
                    ctx.fillText(arr_val[i], item.ulX, i * item.size + item.ulY);
                }
                item.width = ctx.measureText(arr_val[0]).width;
            } 
            
        },
        //画二维码和条形码
        drawImage(ctx,item) {
            var img = item.showMode == 1? this.qrcode : this.barcode;
            // var width = item.showMode==1? 84 : 164;
            // var height = item.showMode ==1? 76.5 : 33
            var width = item.showMode==1? 100 : 195;
            var height = item.showMode ==1? 100 : 30
            item.width = width;
            item.height = height;
            this.mouse_context.drawImage(img,item.ulX,item.ulY,width,height);
            

        },
        //mouse_canvas 鼠标down事件
        mouseCanves_Mdown(e) {
            var canv = this.mouse_canv;
            var e = e||event;
            var x = this.mousecav_x = e.clientX - canv.getBoundingClientRect().left;
            var y = this.mousecav_y = e.clientY - canv.getBoundingClientRect().top;
            //如果画布有元素 则进行画笔
            if(this.ticket_data.length) {
                var flag = true
                this.ticket_data.forEach((item , index)=> {
                    var e_x1 = item.ulX*this.zoom ;
                    var e_x2 = (item.ulX*1*this.zoom + item.width) ;
                    var e_y1 = item.ulY*this.zoom ;
                    var e_y2 = (item.ulY*1*this.zoom + item.height) ;
                    if (x >= e_x1 && x <= e_x2 && y >= e_y1 && y <= e_y2) {  
                        //当前被选中
                        flag = false
                        this.selected_element = item;
                        this.current_text = item.name
                        this.repaintCanvas()
                        this.selectedCurrentElement(item);
                        this.selected_No = index
                        console.log('选中元素：',this.selected_element,'下标：',index)
                        var text_dis_x = x - item.ulX;
                        var text_dis_y = y - item.ulY;
                        console.log(text_dis_x,"鼠标到元素的距离")
                        canv.onmousemove = ($event) => {
                            var e = $event||event;
                            var cx = this.mouse_down_coord.x = e.clientX - canv.getBoundingClientRect().left;
                            var cy = this.mouse_down_coord.y = e.clientY - canv.getBoundingClientRect().top;
                            
                            //重新给元素定位
                            item.ulX =  cx - text_dis_x;
                            item.ulY =  cy - text_dis_y;
                            item.ulX = item.ulX <= 0? 0 : item.ulX
                            item.ulX = item.ulX >= this.mouseCanv_width  - item.width*2/3? this.mouseCanv_width-item.width*2/3 : item.ulX
                            item.ulY = item.ulY >= this.mouseCanv_height - item.size ? this.mouseCanv_height - item.size  : item.ulY;
                            item.ulY = item.ulY < 0 ? 0 :item.ulY;
                            console.log(item.ulX,item.ulY,"------元素此时的位置-------")
                            this.repaintCanvas();
                        };
                        canv.onmouseup = function() {
                            canv.onmousemove = null;
                            canv.onmouseup = null;
                        };
                        canv.onmouseout = () => {
                            canv.onmousemove = null;
                            canv.onmouseup = null;
                        } 
                    }
                });
                if(flag) {
                    this.selectedCurrentElement("");
                    this.repaintCanvas(); //画布
                    console.log(this.selected_element,'没有选中')
                }
            }
            
        },
        //画布重绘
        repaintCanvas() {
            //鼠标移动每一帧都清除画布内容，然后重新绘画
            this.mouse_context.clearRect(0,0,600,600);
            //画背景
                this.mouse_context.strokeStyle = '#343434';
                this.mouse_context.save();
                this.mouse_context.beginPath();
                this.mouse_context.strokeRect(0,0,this.mouseCanv_width,this.mouseCanv_height);
                this.mouse_context.closePath(); 
            if (this.sele_background) {				
                this.mouse_context.drawImage(this.sele_background,1,1,this.mouseCanv_width-1,this.mouseCanv_height-1);
            }
            else{
                this.mouse_context.restore();
                this.mouse_context.save();
                this.mouse_context.beginPath();
                this.mouse_context.drawImage(this.defualt_background,1,1,this.mouseCanv_width-1,this.mouseCanv_height-1);
                this.mouse_context.closePath();
                this.mouse_context.stroke(); 
            }


            //绘画条形码和二维码
            if(this.ticket_data.length) {
                this.ticket_data.forEach(item => {
                    if(item.showMode==1) {      //二维码
                        this.drawImage(this.mouse_context,item);
                    }else if(item.showMode==2) { // 条形码
                        this.drawImage(this.mouse_context,item);

                    }else {                     //文本
                        this.drawText(this.mouse_context,item);
                    }
                })
            }
            //如果选中
            if(this.selected_element) {
                this.draw_cross();
            }
            
        },
        //键盘在画布移动事件
        keyDownonCanva(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            let selected = this.selected_element
            switch(e.keyCode) {
                case 38:
                //向上
                    if(this.ticket_data.length && this.selected_No>=0){
                            selected.ulY--;
                            selected.ulY = selected.ulY < 0 ? 0 :selected.ulY;
                            selected.ulY = selected.ulY
                            this.repaintCanvas()
                    }
                    break;
                case 39:
                //向右
                    if(this.ticket_data.length && this.selected_No>=0){
                            selected.ulX++;
                            selected.ulX = selected.ulX >= this.mouseCanv_width  - selected.width*2/3? this.mouseCanv_width-selected.width*2/3 : selected.ulX
                            selected.ulX = selected.ulX
                            this.repaintCanvas()
                    }
                    break;
                case 40:
                //向下
                    if(this.ticket_data.length && this.selected_No>=0){
                            selected.ulY++
                            selected.ulY = selected.ulY >= this.mouseCanv_height - selected.size ? this.mouseCanv_height - selected.size  : selected.ulY;
                            selected.ulY = selected.ulY
                            this.repaintCanvas()
                    }
                    break;
                case 37:
                //向左
                    if(this.ticket_data.length && this.selected_No>=0){
                            selected.ulX--
                            selected.ulX = selected.ulX <= 0? 0 : selected.ulX
                            selected.ulX = selected.ulX
                            this.repaintCanvas()
                    }
                    break;
                case 46:
                //删除当前元素
                    if(this.ticket_data.length && this.selected_No>=0){
                            this.delCureentElement()
                    }
                    break;
                default:
                            this.repaintCanvas()
			}
			
        },
        //--数据请求--元素列表
        getElemenlist() {
            this.$ctmList.ticketelementList().then( data => {
                if (data && data.code === 200) {
                    data.data.forEach(item => {
                        item.isSele = 0
                    })
                    this.ele_list = data.data
                    var uid =this.uid = this.$route.query.uid
                    if(uid){
                        this.getElemendetil(uid);
                    }
                    
                } else {
                    this.$message({
                        message: '数据请求失败！',
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                        }
                    })
                }
            }).catch( err => {
                console.log(err)
            })
        },
        //获取票版信息
        getElemendetil(uid) {
            this.$ctmList.ticketsampleQuery(uid) .then(res => {
                if(res && res.code==200){
                    let data = res.data
                    this.ticket_data = JSON.parse(JSON.stringify(data.ciTicketsampleitemList))
                    this.mouseCanv_width = data.width
                    this.mouseCanv_height = data.height
                    this.edi_ele.name = data.name
                    this.edi_ele.width  =Math.ceil(data.width/this.mmToPixel) 
                    this.edi_ele.height =Math.ceil(data.height/this.mmToPixel) 
                    this.edi_ele.isPrintTitle = data.isPrintTitle
                    this.edi_ele.isOtherUse = data.isOtherUse
                    this.edi_ele.printMode = data.printMode
                    this.isDefualtticketSample = data.isDefault==1? true : false
                    //获取适用影院
                    this.cinemaNameList = data.cinemaNames? data.cinemaNames.join(',') : ''
                    console.log('data.cinemaList[0]',data.cinemaList[0])
                    if(data.cinemaList && data.cinemaList.length){
                        let _data = {
                            id : data.cinemaList[0].cinemaUid,
                            fullName : data.cinemaList[0].cinemaName
                        }
                        this.cinemaData  = data.cinemaList? _data : {}
                        this.cinemaList = data.cinemaList? [_data] : []
                    }
                    this.size = Math.ceil(data.width/this.mmToPixel) 
                    //获取渠道请求
                    if(this.cinemaData) { 
                        this.getChannelList(this.cinemaData.id)
                    }
                    //获取图片base64
                     if(data.picUrl){
                        let url = data.sele_background ? data.sele_background: null
                        let image = new Image()
                        image.src = url 
                        this.sele_background = image
                    } 
                    //赋值渠道
                    this.channel_new =data.ticketsampleChannelUids? JSON.parse(JSON.stringify(data.ticketsampleChannelUids)) : [] ;
                    this.channel_old =data.ticketsampleChannelUids? JSON.parse(JSON.stringify(data.ticketsampleChannelUids)) : [] ;
                    this.ticket_data.forEach(item => {
                        this.ele_list.forEach(it =>{ 
                            if(item.itemCode == it.code){ //票版元素的选择
                                it.isSele = 1;
                            } 
                        })
                        for(var k in this.kName){   //给名字
                            if(k == item.itemCode){ item.name = this.kName[k]}
                        }
                        if(item.showMode==0){
                            this.mouse_context.font = 'small-caps ' + item.size + "px Courier New";
                            item.width = this.mouse_context.measureText(item.itemDefaultValue).width //设置元素的宽度
                            item.height = item.size; //设置高 
                        }else if(item.showMode==1){
                            // item.width = 84 //设置元素的宽度
                            // item.height = 76.5; //设置高 
                            item.width = 100 //设置元素的宽度
                            item.height = 100; //设置高 
                        }else if(item.showMode == 2){
                            // item.width = 164 //设置元素的宽度
                            // item.height = 33; //设置高 
                            item.width = 195 //设置元素的宽度
                            item.height = 30; //设置高 
                        }
                    })
                }
            })
        },
        //获取渠道信息
        getChannelList(cinemaUid) {
            // this.$ctmList.getUserInfo().then(res => {
                // let cinemaUid = res.data.cinemaUid
                this.$ctmList.ticketGetChannelList({"cinemaUid":cinemaUid,"type":2}) .then( data => {
                    if(data && data.code ===200) {
                        this.channels = data.data
                        console.log('获取的渠道数据：-------------',data.data)
                    }
                })
            // })
        },
        abandon() {
            this.$confirm('确认放弃编辑?','提示',{type:'warning'}).then(_ => {
                this.$store.commit("tagNav/removeTagNav", {
                    name: this.$route.name,
                    path: this.$route.path,
                    title: this.$route.meta.title,
                    query: this.$route.query
                })
                this.$router.push({
                    name:'ticketSampleManage'
                })
            }).catch(_ => {});
        },
        judge() {
            let ele_list = this.ele_list
            for(var i=0;i<ele_list.length;i++){
                if(!ele_list[i].isSele && ele_list[i].require) {
                    this.$message({
                        message: '带*号的元素必须选择',
                        type: 'warning',
                        duration:1000
                    });
                    return false
                }
            }
            if(!this.cinemaList.length && !this.isDefualtticketSample) { 
                this.$message({
                    type:'warning',
                    message:'请选择适用影院',
                    duration:1000
                })
                return false
            }

            if(this.edi_ele.name=="") {
                this.$message({
                        message: '请填写票版名称',
                        type: 'warning',
                        duration:1000
                    });
                return false
            }
            if(!this.channel_new.length && !this.isDefualtticketSample) {
                this.$message({
                        message: '请选择适用渠道',
                        type: 'warning',
                        duration:1000
                    });
                return false
            }
            if(this.ticket_data.length) {
                let ticket_data = this.ticket_data
                for(var j=0;j<ticket_data.length;j++){
                    if(ticket_data[j].ulX>this.mouseCanv_width || ticket_data[j].ulY>this.mouseCanv_height){
                        this.$message({
                            message:'元素不能露在票版外面！',
                            type:'warning',
                            duration:1000
                        })
                        return false
                    }
                }
            }
            return true
        },
        /**
         *  @function saveTicketSample 修改保存
         *  @param type = edit 修改
         *  @param type = new  新建
         */
        
        saveTicketSample(type){
            var flag = this.judge();
            if(flag){
                var data = Object.assign(this.edi_ele)
                let _ticket_data = JSON.parse(JSON.stringify(this.ticket_data))
                _ticket_data.forEach(item=> {         
                    delete item.id
                })
                data.ciTicketsampleitemList = _ticket_data;
                data.ticketsampleChannelUids = this.channel_new;
                //适用影院
                let cinemaList = [] 
                this.cinemaList.forEach(_item => {
                    cinemaList.push({
                        cinemaName : _item.fullName,
                        cinemaUid :  _item.id
                    })
                } )
                data.cinemaList = cinemaList
                data.picUrl = this.sele_background;

                data.width = this.edi_ele.width*this.mmToPixel
                data.height = this.edi_ele.height*this.mmToPixel

                if(type == 'edit'){ //修改
                    data.uid = this.uid  
                    this.$ctmList.ticketSampleUpdata(data).then( data => {
                        if(data && data.code == 200){
                            this.$message({
                                message:"修改成功！",
                                type:"success",
                                duration:1000,
                                onClose: ()=> {
                                    this.$router.push("/ticket/ticketSampleManage")
                                }
                            })
                        }else{
                            this.$message({
                                message:data.msg?data.msg:'修改失败',
                                type:"error",
                                duration:1000,
                            })
                        }
                    })
                }else if (type == 'new') { //新建
                    this.$ctmList.ticketelementAdd(data).then( data => {
                        if(data && data.code ===200 ){
                            this.$message({
                                message:'新建成功！',
                                type: 'success',
                                duration:1000,
                                onClose:()=>{
                                    this.$router.push('/ticket/ticketSampleManage');
                                }
                            })
                        }else{
                            this.$message({
                                message:data.msg?data.msg:'新建失败！',
                                type: 'error',
                                duration:1000,
                                
                            })
                        }
                    })
                }
            }
        },
    },
    computed: {
        windowWidth(e) {
            return this.$store.state.innerWidth
        },
        //票版盒子大小
        box_size() {
            return 'width:' + (this.edi_ele.width* this.mmToPixel ).toFixed(2)+'px' + ';' +'height:' + (this.edi_ele.height * this.mmToPixel ).toFixed(2)+'px'
        },
    },
    mounted() {
        //获取canvas对象
        let canv = this.$refs.mouse_canvas;
        this.mouse_canv = canv
        this.mouse_context = canv.getContext("2d");
       //新建初始化画布
        // this.repaintCanvas();
        if(!this.uid){
            setTimeout( this.repaintCanvas,500)
            this.repaintCanvas()
        }
        //元素库拖动的边界范围
        this.boxBoder_x = this.mouse_canv.getBoundingClientRect().left;
        this.boxBoder_y = this.mouse_canv.getBoundingClientRect().top;
        let breadcrumb = document.querySelector('.el-breadcrumb')
        if(breadcrumb){
            console.log(breadcrumb)
            this.boxBoder_y-=30
        }

        //键盘事件
        window.onkeydown = this.keyDownonCanva;

    },
    created() {
        let img = new Image();
        img.src = this.defualt_background;
        this.defualt_background = img;

        let img2 = new Image();
        img2.src = this.qrcode;
        this.qrcode = img2;

        let img3 = new Image();
        img3.src = this.barcode;
        this.barcode =  img3 ;
        

        /* 获取列表
         *  Func- getElemenlist
        */
        this.getElemenlist();
        //获取票版元素信息 
    }
}
</script>
<style lang="scss">
    .star_require{color: #f56c6c;cursor: pointer;}
    .full{
        position: fixed;
        top:0;
        right:0;
        left: 0;
        bottom: 0;
    }
    .ticket_design {
        display: flex;
        background: #F5F5F5;
        min-width: 1092px;
        overflow: auto;
        span,label{font-size: 12px!important;}
        
        //文字不能被选中
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .el-aside { background: white!important}
        //元素库
        .aside_lef {
            margin: 10px 0 10px 10px;
            .el-aside{height: 100%;}
            .edit_ele{
                box-sizing: border-box;
                padding:0 10px 0 10px;
                position: relative;
                overflow: hidden;

                //折叠title
                .title{
                    padding: 15px 0 5px 6px;
                    span:nth-child(1){font-size: 14px;font-weight: 550;color: #333333;}
                    span:nth-child(2){color:#666666}
                }
                
                .el-collapse{
                    border: none;
                    padding: 0;
                    .el-collapse-item__header{
                        position: relative;
                        box-sizing: border-box;
                        width: 100%;
                        color:  #666666;
                        font-size: 12px;
                        padding: 0;
                        padding-left: 6px;
                        height: 40px;
                        line-height: 40px;
                        .el-collapse-item__arrow{
                            position: absolute;
                            right: 20px;
                            top: 30%;
                        }
                    }
                        .el-collapse-item__header::after{
                            background-color: #F5F5F5;
                            width: 100%;
                        }
                        
                    .el-collapse-item__wrap{
                        padding-top: 12px;
                        .el-collapse-item__content{
                            padding-bottom: 10px;
                        }
                    }
                }        
            }
            
        }
        .aside_right{
            position: relative;
            margin: 10px 10px 10px 0;
            box-sizing: border-box;
            // max-height: 700px;
            overflow: auto;
            background: white;
            label{color: #333}
            .option-warp{
                display: flex;
                height: 38px;
                line-height: 38px;
                justify-content: flex-end;
                .name{margin-right: 12px;}
                .content{width: 180px;color: #666!important}
                span{color: #666}
            }
            .sample-size{
                height: auto;
                .sel-size{
                    label{
                        margin-top: 9px;
                    }
                    .el-radio-group{
                        margin-left: -25px;
                    }
                }
            }
            //编辑属性
            .edi_ele{
                //饿了么 样式重定
                padding: 10px;
                .file_sele{
                    display: flex;
                    justify-content: flex-start;
                    .file-btn{
                        background: #FFFFFF;
                        border: 1px solid #BCBCBC;
                        display: inline-block;
                        text-align: center;
                        width: 64px;
                        height: 32px;
                        line-height: 32px;
                        font-size: 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: all .3s;
                        &:hover{
                            border: 1px solid #3B74FF;
                            color:  #3B74FF;
                        }
                    }
                }
                .ticketSize{
                    .el-input{width: 62px;}
                    input{width: 62px;font-size: 12px;padding: 0 10px;text-align: center}
                }
                .qudao{
                    white-space: nowrap;
                    .el-input{width: 150px;}
                    .el-select__tags{max-width: 145px!important;}
                    span{font-size: 12px;}
                }
                .inputFrame{
                    width: 150px;
                    white-space: nowrap;
                    color: #333333;
                }
                
                .show-way{
                    white-space: nowrap;
                    .el-radio{margin: 0px}
                    .el-radio:nth-child(1){margin: 0px}
                    .el-radio:nth-child(2){margin-left: 20px;}
                    .el-radio:nth-child(3){margin-left: 10px;}
                }
                .nowrap{white-space: nowrap;}
                .btn{
                    height: 32px;;
                    text-align: center;
                    margin-top: 20px;
                    .el-button--default{
                        margin-left: 10px;
                    }
                }
            }
            .curren_eleSel{border-top: 1px solid #F5F5F5} 
            
        }
        .el-main{height: auto;overflow: hidden;}
        .main{
            text-align: center;
            position: relative;
            .iconfont{
                width: 19px;
                height: 19px;
                position: absolute;
                right: 40px;
                top: 25px;
                cursor: pointer;
                color: #333333;
            }
            .main_title{
            font-family: MicrosoftYaHei;
            display: inline-block;
            font-size: 14px;
            color: #343434;
            letter-spacing: 0;
            margin: 25px 0;
            font-weight: 550;
            }
            // 票版设计
            .design_box_full{
                width: 650px!important;
                height: 650px!important;
            }
            .design_box {
                width: 550px;
                height: 550px;
                margin: 0 auto;
                overflow: hidden;
                box-sizing: border-box;
                position: relative;
                .scale_X{
                    height:10px ;
                    position: absolute;
                    border-bottom: 1px solid #666;
                    ul{
                        margin-left: 40px;
                        li{
                            float: left;margin-left: 10px;width: 1px;height: 10px;background: #666;
                        }
                        li:nth-child(1){margin: 0px;}
                    }
                }
                .scale_Y{
                    width: 10px;
                    position: absolute;
                    border-right: 1px solid #666;
                    ul{
                        margin-top: 40px;
                        li{
                            margin-top: 10px;width: 10px;height: 1px;background: #666;
                        }
                        li:nth-child(1){margin: 0px;}
                    }
                }
                .scale_box{
                    position: absolute;
                    box-sizing: border-box;
                    top: 40px;
                    left: 40px;
                }
            }
            .del{text-align: center}
        }
        
        
    }
    

</style>