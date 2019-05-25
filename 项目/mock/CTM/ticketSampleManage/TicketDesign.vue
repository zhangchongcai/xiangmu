<template>
    <div :class='["ticket_design",isZoom ? "full" : ""]'  >
        <div class="ticket_temp"></div>
        
        <el-container>
            <div class="aside_lef">
                <el-aside width="260px" >
                    <div class="edit_ele" >
                        <!-- 全部元素 -->
                        <div class="title"><span>票版元素</span><span>(请单击选择)</span></div>
                        <el-collapse v-model="activeNames">
                        <el-collapse-item title="全部元素" name="1">
                            <div v-for="(item,ind) in ele_list" :key="ind" class="content" v-show="!item.isSele">
                                    <span @mousedown="drag($event,item)">
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
                                    <span @mousedown="drag($event,item)">
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
                    <p class="main_title">票版名称：广电标准版第三方</p> 
                    <i class="iconfont icon-neiye-quanping" @click="scale_zoom"></i>        
                    <div :class='["design_box",isZoom ? "design_box_full" : ""]' ref="design_box">
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
                            width="600px" height="600px"
                            @mousedown="mouseCanves_Mdown"></canvas>
                        </div>
                    </div>
                    <div class="del">
                            <el-button type="primary" plain @click="del_cureentElement">删除元素</el-button>
                    </div>
                </div>
                
            </el-main>
            <div class="aside_right">
                <el-aside width="330px ">
                    <div class="edi_ele">
                        <p>编辑属性</p>
                        <el-form ref="form" :model="edi_ele" label-width="80px" >
                            <div class="file_sele">
                                <el-form-item label="导入样票：">
                                    <input type="file" @change="readTicketFile($event)" ref="ticketFile">
                                </el-form-item>
                            </div>
                            
                            <el-form-item label="票版名称：">
                                <div class="inputFrame nowrap">
                                    <el-input type="input" v-model="edi_ele.name"></el-input>
                                    </div> 
                            </el-form-item>
                            <el-form-item label="票版尺寸：">
                                <div class="ticketSize">
                                    <el-input type="input" v-model="edi_ele.width" placeholder="宽mm" @change="scale_input_width"></el-input> <span style="margin:0 5px;color:#666666">X</span> 
                                    <el-input type="input" v-model="edi_ele.height" placeholder="高mm" @change="scale_input_height"></el-input>
                                </div>
                                <div class="sel_size">
                                    <el-radio-group v-model="size"
                                    @change="size_sel"
                                    >
                                        <el-radio label="60" style="margin-left: 30px;">60mm  <span style="margin:0 5px;color:#666666">X</span>  80mm</el-radio>
                                        <el-radio label="70">70mm  <span style="margin:0 5px;color:#666666">X</span> 80mm</el-radio>
                                        <el-radio label="90">80mm  <span style="margin:0 5px;color:#666666">X</span>  80mm</el-radio>
                                    </el-radio-group>
                                </div>
                                
                            </el-form-item >
                            <div class="qudao">
                                <el-form-item label="适用渠道：" prop="channels">
                                    <el-select
                                    v-model="channel_new"
                                    multiple
                                    size="mini"
                                    collapse-tags
                                    remove-tag
                                    placeholder="选择"
                                    @change="channel_change"
                                    >
                                    <el-option
                                    v-for="item in channels"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.uid">
                                    </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            
                            <el-form-item label="第三方票类专用：">
                                <el-radio-group v-model="edi_ele.isOtherUse">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="是否设置标题打印：">
                                <el-radio-group v-model="edi_ele.isPrintTitle">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="打印方向：">
                                <el-radio-group v-model="edi_ele.printMode">
                                <el-radio :label="1">横向</el-radio>
                                <el-radio :label="2">纵向</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                        <div class="curren_eleSel">
                            <el-form ref="form1" :model="edi_ele" label-width="80px">
                                <el-form-item label="当前选定：">
                                    <div class="inputFrame">
                                        {{current_element.text}}
                                    </div> 
                                </el-form-item>
                                <el-form-item label="字体大小：">
                                    <div class="inputFrame">
                                        <el-select v-model="current_element.fontSize" placeholder="请选择" @change="fontSize_change">
                                            <el-option
                                            v-for="item in fontOption"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div> 
                                </el-form-item>
                                <el-form-item label="打印标题：">
                                    <el-radio-group v-model="current_element.isPrintTitle" @change="isPrintTitle_change ">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="是否加粗：">
                                    <el-radio-group v-model="current_element.bold" @change="bold_change">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="展示方式：">
                                    <div class="el_radio" >
                                        <el-radio-group v-model="current_element.showMode" @change="showMode_change">
                                        <el-radio :label="0">文本</el-radio>
                                        <el-radio :label="1">二维码</el-radio>
                                        <el-radio :label="2">条码</el-radio>
                                        </el-radio-group>
                                    </div>
                                    
                                </el-form-item>
                                <el-form-item label="每行打印字符数：" >
                                    <div class="inputFrame">
                                        <el-select v-model="current_element.textLength" placeholder="请选择" @change="fontLength_chang">
                                            <el-option
                                            v-for="item in fontCount"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div> 
                                </el-form-item>
                                <div class="btn">
                                    <div v-if="this.uid">
                                        <el-button type="primary" @click="ticketSampleupdata">完成编辑</el-button>
                                        <el-button @click="abandon">放弃编辑</el-button>
                                    </div>
                                    <div v-else>
                                        <el-button type="primary" @click="newBuild">新建票版</el-button>
                                        <el-button @click="abandon">放弃编辑</el-button>
                                    </div>
                                </div>
                                
                            </el-form>
                        </div>
                    </div>
                </el-aside>
            </div>
            
        </el-container>
        
    </div>
</template>
<script>
import qs from 'qs';
export default {
    data() {
      return {
            isZoom:false,
            activeNames: ['1',"2"],
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
            size: '60',
            edi_ele: {
                name: '',
                width: 60,
                height: 80,
                isOtherUse:'',
                isPrintTitle:'',
                printMode:'',
            },
            //当前属性
            current_element:{
                text:'',
                fontSize:'',
                showMode:'',
                isPrintTitle:'',
                bold:'',
                textLength:'',
            },
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
            defualt_background:require('../../../assets/ticketImg/images/ticket.jpg'),
            qrcode:require('../../../assets/ticketImg/images/qrcode.jpg'),
            barcode:require('../../../assets/ticketImg/images/barcode.jpg'),
            scale_length:45,//尺标大小
            uid : '', //票版的uid
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
            element_no : 0,//元素索引号
            ticket_data:[], //画布元素列表
            selected_element:null, //当前选中的元素
             //字体大小数组
        };

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
            this.edi_ele.width = value = value>=114? 114 : value;
            this.mouseCanv_width = value * this.mmToPixel;
            this.repaintCanvas();
        },
        scale_input_height(value) {
            this.edi_ele.size="";
            this.edi_ele.height = value>=100? 100 : value;
            this.mouseCanv_height = value* this.mmToPixel*this.zoom ;
            this.repaintCanvas();
        },
        fontSize_change(val) {
            if(this.ticket_data.length && this.selected_element){
                this.ticket_data.forEach( item => {
                    if(item.element_no == this.selected_element.element_no){
                        item.size = val;
                        this.mouse_context.font = 'small-caps '+ item.size + "px Courier New";
                        item.width = this.mouse_context.measureText(item.description).width //设置元素的宽度
                        item.height = val;
                        this.repaintCanvas();
                    }
                })
            }
        },
        fontLength_chang(val) {
            if(this.ticket_data.length && this.selected_element){
                this.ticket_data.forEach( item => {
                    if(item.element_no == this.selected_element.element_no){
                        item.textLength = val;
                        this.repaintCanvas();
                    }
                })
            }
        },
        bold_change(val) {
            if(this.ticket_data.length && this.selected_element){
                this.ticket_data.forEach( item => {
                    if(item.element_no == this.selected_element.element_no){
                        item.bold = val;
                        this.repaintCanvas();
                    }
                })
            }
        },
        showMode_change(val) {
            if(this.ticket_data.length && this.selected_element){
                this.ticket_data.forEach( item => {
                    if(item.element_no == this.selected_element.element_no){
                        item.showMode = val;
                        this.repaintCanvas();
                        setTimeout(this.repaintCanvas, 10);
                    }
                })
            }
        },
        isPrintTitle_change(val) {
            if(this.ticket_data.length && this.selected_element){
                this.ticket_data.forEach( item => {
                    if(item.element_no == this.selected_element.element_no){
                        item.isPrintTitle = val;
                    }
                })
            }
        },
        //选择样式票版背景图
        readTicketFile($event) {
            let file = this.$refs.ticketFile.value;
            let oFileReader = new FileReader();
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
                this.$api.checkChannelExsit(currentItem)
                    .then(data => {
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
                                this.$message({
                                    message: '渠道已被其他票版绑定，请先解绑',
                                    type: 'warning',
                                    duration: 1000,
                                    onClose: () => {}
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
                this.scale_length = 55
                this.mouse_context.scale(1.3,1.3);
                this.zoom = 1.3
                this.repaintCanvas();
            }else{
                this.scale_length = 45
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
        elementCurrentValChange(item) {
            this.current_element.text = item.name? item.name : "";; //显示当前的名字
            this.current_element.fontSize = item.size? item.size : "";; 
            this.current_element.showMode = item? item.showMode : ""; 
            this.current_element.isPrintTitle = item? item.isPrintTitle : ""; 
            this.current_element.bold = item? item.bold : ""; 
            this.current_element.textLength = item.textLength? item.textLength : "";       
        },
        //删除当前元素
        del_cureentElement() {
            console.log(this.selected_element,"删除当前元素")
            if(this.selected_element){
                var sel = this.selected_element;
                var code = sel.itemCode;
                this.ticket_data.forEach((item,ind) => {
                    if(sel.element_no == item.element_no){
                        this.elementCurrentValChange("");
                        this.ticket_data.splice(ind,1);
                        this.selected_element = null;
                        this.repaintCanvas();
                    }
                });
                var flag = this.ticket_data.find((item)=>{
                    return item.code == code 
                });
                this.ele_list.forEach(item=> {
                    if(item.code == code ){
                        if(!flag){
                            item.isSele = 0
                        }
                    }
                })
            }
        },
        // 拖拽元素库
        drag(e,item) {
            var  target= e.target.parentNode.parentNode;
            var newEl=target.cloneNode(true);
            newEl.style.position= 'absolute';
            newEl.style.left = e.pageX + 'px';
            newEl.style.top = e.pageY + 'px';
            newEl.style.corson = 'pointer';
            document.documentElement.appendChild(newEl);
            document.onmousemove = (e) =>{
                newEl.style.left = e.pageX-5 + 'px';
                newEl.style.top = e.pageY-5 + 'px';
            };
            document.onmouseup = (e) => {
                if( e.clientX > this.boxBoder_x && 
                    e.clientX < this.boxBoder_x + this.mouseCanv_width  &&
                    e.clientY > this.boxBoder_y && e.clientY < this.boxBoder_y + this.mouseCanv_height
                    ) {
                    document.documentElement.removeChild(newEl); // 移除元素
                    var obj = {};
                    // obj = item;
                    obj = JSON.parse(JSON.stringify(item));
                    //元素在画布的坐标
                    obj.bold = 0;//是否粗体
                    obj.delFlag = 0; //是否删除
                    obj.isPrintTitle = 0; //是否打印标题
                    obj.ulX =  e.clientX - this.mouse_canv.getBoundingClientRect().left;  //设置元素的位置
                    obj.ulY =  e.clientY - this.mouse_canv.getBoundingClientRect().top;
                    obj.itemCode = obj.code; //元素code
                    obj.element_no = this.element_no++; //设置元素的编号
                    obj.showMode = 0; //默认文本
                    obj.size = 12;  //设置元素的大小
                    obj.textLength = 40; //设置元素每行的长度
                    this.mouse_context.font = 'small-caps ' + obj.size + "px Courier New";
                    obj.width = this.mouse_context.measureText(obj.description).width //设置元素的宽度
                    obj.height = obj.size; //设置高 
                    obj.itemDefaultValue = obj.description; //设置元素的默认值
                    this.selected_element = JSON.parse(JSON.stringify(obj));
                    this.elementCurrentValChange(this.selected_element);
                    this.ticket_data.push(obj);
                    this.ele_list.forEach(ie => {
                        if(ie.code == item.code) {
                            ie.isSele = 1;
                        }
                    })
                    
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
            ctx.font = 'small-caps ' + bold + " " + fontSize + "px Courier New";
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
            var width = item.showMode==1? 84 : 164;
            var height = item.showMode ==1? 76.5 : 33
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
                this.ticket_data.forEach(item=> {
                    var e_x1 = item.ulX*this.zoom ;
                    var e_x2 = (item.ulX*1*this.zoom + item.width) ;
                    var e_y1 = item.ulY*this.zoom ;
                    var e_y2 = (item.ulY*1*this.zoom + item.height) ;
                    if (x >= e_x1 && x <= e_x2 && y >= e_y1 && y <= e_y2){  
                        //当前被选中
                        flag = false
                        this.selected_element = item;
                        this.current_text = item.name
                        this.repaintCanvas()
                        this.elementCurrentValChange(item);
                        console.log(this.selected_element,'选中')
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
                    this.selected_element=null;
                    this.repaintCanvas(); //画布
                    this.elementCurrentValChange("");
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
            //向上
            if (e.keyCode == 38){
                
                if(this.selected_element){
                    this.ticket_data.forEach( (item,ind) => {
                        if(this.selected_element.element_no == item.element_no){
                            item.ulY--;
                            this.selected_element.ulY = item.ulY
                            return this.repaintCanvas();
                        }
                    }) 
                }
			}//向右
			else if (e.keyCode == 39){
                if(this.selected_element){
                    this.ticket_data.forEach( (item,ind) => {
                        if(this.selected_element.element_no == item.element_no){
                            item.ulX++;
                            this.selected_element.ulX = item.ulX
                            return this.repaintCanvas();
                        }
                    }) 
                }
			}//向下
			else if (e.keyCode == 40){
                if(this.selected_element){
                    this.ticket_data.forEach( (item,ind) => {
                        if(this.selected_element.element_no == item.element_no){
                            item.ulY++;
                            this.selected_element.ulY = item.ulY
                            return this.repaintCanvas();
                        }
                    }) 
                }
			}//向左
			else if (e.keyCode == 37){ 
                if(this.selected_element){
                    this.ticket_data.forEach( (item,ind) => {
                        if(this.selected_element.element_no == item.element_no){
                            item.ulX--;
                            this.selected_element.ulX = item.ulX
                            return this.repaintCanvas();
                        }
                    }) 
                }
				// deleteCurrentElementItem();
			}
			else if(e.keyCode == 46){
                //删除当前元素
				this.del_cureentElement();
			}
			
        },
        //--数据请求--元素列表
        getElemenlist() {
            this.$api.ticketelementList()
                .then( data => {
                    if (data && data.code === 200) {
                        data.data.forEach(item => {
                            item.isSele = 0;
                        })
                        this.ele_list = data.data
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
            console.log(uid,"票版uid")
            this.$api.ticketsampleQuery(uid)
            .then(data => {
                if(data && data.code==200){
                    data = data.data;
                    console.log(data)
                    this.ticket_data = data.ciTicketsampleitemList;
                    this.mouseCanv_width = data.width * this.mmToPixel ;
                    this.mouseCanv_height = data.height * this.mmToPixel ;
                    this.edi_ele.name = data.name;
                    this.edi_ele.width  = data.width;
                    this.edi_ele.height = data.height;
                    this.edi_ele.isPrintTitle = data.isPrintTitle;
                    this.edi_ele.isOtherUse = data.isOtherUse;
                    this.edi_ele.printMode = data.printMode;
                    //获取图片base64
                     if(data.picUrl){
                        let url = data.sele_background ? data.sele_background: null;
                        let image = new Image();
                        image.src = url ;
                        this.sele_background = image; 
                    } 
                    this.channel_new =JSON.parse(JSON.stringify(data.ticketsampleChannelUids)) ;
                    this.channel_old =JSON.parse(JSON.stringify(data.ticketsampleChannelUids)) ;
                    this.ticket_data.forEach(item => {
                        this.ele_list.forEach(it =>{ 
                            if(item.itemCode == it.code){ //票版元素的选择
                                it.isSele = 1;
                            } 
                        })
                        for(var k in this.kName){   //给名字
                            if(k == item.itemCode){ item.name = this.kName[k]}
                        }
                        item.element_no =this.element_no =this.element_no+1;
                        if(item.showMode==0){
                            this.mouse_context.font = 'small-caps ' + item.size + "px Courier New";
                            item.width = this.mouse_context.measureText(item.itemDefaultValue).width //设置元素的宽度
                            item.height = item.size; //设置高 
                        }else if(item.showMode==1){
                            item.width = 84 //设置元素的宽度
                            item.height = 76.5; //设置高 
                        }else if(item.showMode == 2){
                            item.width = 164 //设置元素的宽度
                            item.height = 33; //设置高 
                        }
                    })
                    this.repaintCanvas();
                    
                }
            })
        },
        //获取渠道信息
        getChannelList() {
            var cinemaUid = 'cd83a2a7-734e-4861-a7bb-bec328aefb9f'  //获取当前影院uid //暂写死
            this.$api.ticketGetChannelList({"cinemaUid":cinemaUid})
            .then( data => {
                if(data && data.code ===200) {
                    console.log(data)
                    this.channels = data.data
                }
            })
        },
        abandon() {
            this.$confirm('确认关闭？')
            .then(_ => {
                this.$router.go(-1)
            })
            .catch(_ => {});
        },
        judge(){
            var flag = [true,false,false]
            this.ele_list.forEach(item => {
                if(!item.isSele && item.require){
                    this.$message({
                        message: '带*号的元素必须选择',
                        type: 'error',
                        duration:1000
                    },500);
                    flag[0] = false;
                }else{}
            })
            if(this.edi_ele.name==""){
                this.$message({
                        message: '请填写票版名称',
                        type: 'error',
                        duration:1000
                    },500);
                flag[1]=false
                return;
            }else{flag[1]=true}
            if(this.channel_new.length <=0 ){
                this.$message({
                        message: '请绑定渠道',
                        type: 'error',
                        duration:1000
                    },500);
                flag[2]=false
                return;
            }else{flag[2]=true}
            return flag.every(item=>{return item})
        },
        //新建
        newBuild() {
            var flag = this.judge();
            var data = Object.assign(this.edi_ele)
            data.ciTicketsampleitemList = this.ticket_data;
            data.ticketsampleChannelUids = this.channel_new;
            if(flag){
                this.$api.ticketelementAdd(data)
                .then( data => {
                    if(data && data.code ===200 ){
                        this.$message({
                            message:'新建成功！',
                            type: 'success',
                            duration:1000,
                            onClose:()=>{
                                this.$router.push('/CTM/ticketSampleManage');
                            }
                        })
                        
                    }else{
                        this.$message({
                            message:'新建失败！',
                            type: 'error',
                            duration:700,
                            
                        })
                    }
                })
            }
        },
        //修改
        ticketSampleupdata(){
            var flag = this.judge();
            var data = Object.assign(this.edi_ele)
            data.ciTicketsampleitemList = this.ticket_data;
            data.ticketsampleChannelUids = this.channel_new;
            data.uid = this.uid;
            data.picUrl = this.sele_background;
            if(flag){
                this.$api.ticketSampleUpdata(data)
                .then( data => {
                    if(data && data.code == 200){
                        this.$message({
                            message:"修改成功！",
                            type:"success",
                            durantion:700,
                            onClose: ()=> {
                                this.$router.push("/CTM/ticketSampleManage")
                            }
                        })
                    }else{
                        this.$message({
                            message:"修改失败！",
                            type:"error",
                            duration:1000,
                        })
                    }
                })
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
        if(!this.uid){
            setTimeout( _ => {
                this.mouse_context.strokeRect(0,0,this.mouseCanv_width,this.mouseCanv_height);
                this.mouse_context.drawImage(this.defualt_background,1,1,this.mouseCanv_width-1,this.mouseCanv_height-1);
            },200)
        }
        //元素库拖动的边界范围
        this.boxBoder_x = this.mouse_canv.getBoundingClientRect().left;
        this.boxBoder_y = this.mouse_canv.getBoundingClientRect().top;

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
        //获取列表
        this.getElemenlist();
        //获取票版元素信息 
        var uid =this.uid = this.$route.query.uid;
        if(uid){
            this.getElemendetil(uid);
        }
        //获取渠道信息
        this.getChannelList();

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
        height: 100vh;
        background: #F5F5F5;
        // min-width: 1092px;
        span,label{font-size: 12px!important;}
        //文字不能被选中
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .el-aside { background: white}
        //元素库
        .aside_lef {
            margin: 10px 0 0 10px  ;
            .el-aside{height: 100%;}
            .edit_ele{
                box-sizing: border-box;
                padding:0 0 0 10px;
                position: relative;
                //折叠title
                .title{
                    padding: 15px;
                    span:nth-child(1){font-size: 14px;font-weight: 550;color: #333333;}
                    span:nth-child(2){color:#666666}
                }
                
                .el-collapse{border: none}        
                .el-collapse-item__header{
                    color:  #666666;
                    font-size: 12px;
                    padding-left: 6px;
                    height: 40px;;
                    .el-collapse-item__arrow{position: absolute;right: 20px;}
                }
            }
        }
        .aside_right{
            margin: 10px 10px 0 0;
            box-sizing: border-box;
            // height: calc(100vh - 45px);
            overflow: hidden;
            //编辑属性
            .edi_ele{
                //饿了么 样式重定
            padding: 10px;
                
                .el-form-item{
                    margin-bottom:8px;
                }
                .file_sele{
                    white-space: nowrap;
                    input{width: 200px}
                }
                .el-form-item__label{
                    font-size: 12px;
                    width: 120px!important;
                }
                .ticketSize{
                    .el-input{width: 62px;}
                    input{width: 62px}
                }
                .sel_size{margin-left: 15px}
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
                .el_radio{
                    .el-radio:nth-child(1){margin-left: 0px}
                    .el-radio{margin-left: 10px}
                }
                .nowrap{white-space: nowrap;}
                .btn{
                    margin-top: 20px;
                    text-align: center;
                }
            }
            .curren_eleSel{border-top: 1px solid #ccc} 
            
        }
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