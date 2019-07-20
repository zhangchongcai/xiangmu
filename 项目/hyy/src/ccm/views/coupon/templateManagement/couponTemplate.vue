<template>
<div  :class='["coupon-template",isZoom ? "couponFull" : ""]'>
    <!-- 票版元素 -->
    <section class="aside-left">
        <h3 class="title">票版元素<span class="tips-text">(请拖动选择)</span></h3>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="元素库" name="elementLibary">
                <div v-for="(element,ind) in config.element" :key="ind" class="element-item" v-show="!element.isSele">
                    <span @mousedown="drag($event,element,ind)">
                        <span class="star_required" v-if='element.required'>*</span>
                        <span :style="element.required? '':'padding-left:12px'" style="cursor:pointer" >
                            {{element.name}}:{{element.description}}
                        </span>
                    </span>
                </div>
            </el-collapse-item>
            <el-collapse-item title="已选元素" name="elementSelect">
                <div v-for="(element,ind) in config.element" :key="ind" class="element-item" v-show="element.isSele">
                    <span @mousedown="drag($event,element,ind)">
                        <span class="star_required" v-if='element.required'>*</span>
                        <span :style="element.required? '':'padding-left:12px'" style="cursor:pointer" >
                            {{element.name}}:{{element.description}}
                        </span>
                    </span>
                </div>
            </el-collapse-item>
        </el-collapse>
    </section>
    <!-- 票版内容 -->
    <section class="container">
            <div class="container-title">
                <p class="main_title">票版名称：{{attribute.name}}</p> 
                <i class="iconfont icon-neiye-quanping" @click="scale_zoom"></i>        
            </div>
            <div :class='["design_box",isZoom ? "" : ""]' ref="design_box">
                <div class="scale_X" >
                    <ul>
                        <li v-for="(item,ind) in config.scale_length" :key="ind"></li>
                    </ul>
                </div>
                <div class="scale_Y" >
                    <ul>
                        <li v-for="(item,ind) in config.scale_length" :key="ind"></li>
                    </ul>
                </div>
                <div class="scale_box">
                    <canvas ref="main_canvas"
                    width="500px" height="500px"
                    style="position:absolute;left:0;top:0;overflow:hidden"
                    />
                    
                    <canvas ref="mouse_canvas"
                    width="500px" height="500px"
                    @mousedown="mouseCanves_Mdown"
                    @mouseup="mouseCanves_Mup"
                    @mouseout="mouseCanves_Mup"
                    style="position:absolute;left:0;top:0;overflow:hidden"
                    />
                </div>
            </div>
            <div class="del">
                    <el-button type="primary" plain @click="delCureentElement">删除元素</el-button>
            </div>
            <div style="display:inline-block;border-radius:4px;font-size:12px;border:1px solid orange;padding:5px;color:#333;margin-top:5px">
                <p>键盘“删除”键删除选中元素</p> 
                <p>键盘方向键微调选中元素位置</p>
            </div>
    </section>
    <!-- 编辑属性 -->
    <section class="aside-right">
        <div class="attribute">
            <h3 class="title">编辑属性</h3>
            <div class="option-warp">
                <label class="name">导入样票：</label>
                <div class="content">
                    <div class="file_sele">
                        <div href="javascript::void(0)" class="file-btn" type="plain"  @click="handerTicketFile">选择文件</div>
                        <span></span>
                        <input type="file" @change="readTicketFile($event)" ref="ticketFile" style="display:none">
                    </div>
                </div>
            </div>
            <!-- <div class="option-warp">
                <label class="name">适用影院：</label>
                <div class="content">
                    <div class="inputFrame nowrap">
                        <el-input type="input" v-model="cinemaNameList"
                        @focus="cinemaDialogShow"
                        clearable
                        @clear="clearCinemaName"
                        :disabled="attribute.isDefualtticketSample"
                        ></el-input>
                    </div>
                </div>
            </div> -->
            <div class="option-warp">
                <label class="name">票版名称：</label>
                <div class="content">
                    <div class="inputFrame nowrap">
                        <el-input type="input" v-model="attribute.name"
                    ></el-input>
                    </div>
                </div>
            </div>
            <div class="option-warp sample-size">
                <label class="name">纸板尺寸：</label>
                <div class="content">
                    <div class="ticketSize">
                        <el-input type="input" v-model="attribute.width" placeholder="宽mm" @change="scale_input_width"></el-input> <span style="margin:0 5px;color:#666666;font-size:12px">X</span> 
                        <el-input type="input" v-model="attribute.height" placeholder="高mm" @change="scale_input_height"></el-input>
                    </div>
                    <div class="sel-size">
                        <el-radio-group v-model="size"
                        @change="size_sel"
                        >
                            <el-radio :label="60" >60mm  <span style="margin:0 10px;color:#666666">X</span>  80mm</el-radio>
                            <el-radio :label="70" >70mm  <span style="margin:0 10px;color:#666666">X</span> 80mm</el-radio>
                            <el-radio :label="90" >90mm  <span style="margin:0 10px;color:#666666">X</span>  80mm</el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </div>
            <!-- <div class="option-warp" style="height:auto">
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
                        :disabled="attribute.isDefualtticketSample"
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
            </div> -->
            <div class="option-warp">
                <label class="name">打印标题：</label>
                <div class="content">
                    <el-radio-group v-model="attribute.isPrintTitle" @change="changePrintTitle">
                        <el-radio :label="1" style="margin-right:17px">是</el-radio>
                        <el-radio :label="2" style="margin-right:17px">否</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="option-warp">
                <label class="name">打印方向：</label>
                <div class="content">
                    <el-radio-group v-model="attribute.printMode">
                        <el-radio :label="1" style="margin-right:5px">横向</el-radio>
                        <el-radio :label="2" style="margin-right:5px">纵向</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="curren_eleSel">
                <div class="option-warp">
                    <label style="margin-right:26px">当前选定</label>
                    <div class="content">{{selected_element.name}}</div>
                </div>
                <div class="option-warp sample-size">
                    <label class="name">元素位置：</label>
                    <div class="content">
                        <div class="ticketSize">
                            <el-input type="input" v-model="selected_element.x" placeholder="宽mm" ></el-input> <span style="margin:0 5px;color:#666666;font-size:12px">X</span> 
                            <el-input type="input" v-model="selected_element.y" placeholder="高mm" ></el-input>
                        </div>
                    </div>
                </div>
                <div class="option-warp">
                    <label class="name">字体大小：</label>
                    <div class="content">
                        <div class="inputFrame">
                        <el-select v-model="selected_element.size" placeholder="请选择" @change="fontSize_change">
                            <el-option
                            v-for="item in config.fontSize"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div> 
                    </div>
                </div>
                <div class="option-warp">
                    <label class="name">字体类型：</label>
                    <div class="content">
                        <div class="inputFrame">
                        <el-select v-model="selected_element.family" placeholder="请选择" @change="fontFamily_change">
                            <el-option
                            v-for="item in config.fontFamily"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div> 
                    </div>
                </div>
                <div class="option-warp" v-show="attribute.isPrintTitle==1">
                    <label class="name">打印标题：</label>
                    <div class="content">
                        <el-radio-group v-model="selected_element.isPrintTitle" @change="isPrintTitle_change ">
                    <el-radio :label="1" style="margin-right:17px">是</el-radio>
                    <el-radio :label="0" style="margin-right:17px">否</el-radio>
                    </el-radio-group>
                    </div>
                </div>
                <div class="option-warp">
                    <label class="name">是否加粗：</label>
                    <div class="content">
                        <el-radio-group v-model="selected_element.bold" @change="bold_change">
                            <el-radio :label="1" style="margin-right:17px">是</el-radio>
                            <el-radio :label="0" style="margin-right:17px">否</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="option-warp">
                    <label class="name">展示方式：</label>
                    <div class="content">
                        <el-radio-group v-model="selected_element.showMode" @change="showMode_change">
                            <el-radio :label="0" style="margin-right:5px" :disabled="config.model=='编辑'?true:false">文本</el-radio>
                            <el-radio :label="1" style="margin-right:5px">二维码</el-radio>
                            <el-radio :label="2" style="margin-right:0px" :disabled="config.model=='编辑'?true:false">条码</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="option-warp">
                    <label class="name">每行打印字符数：</label>
                    <div class="content">
                        <div class="inputFrame">
                            <el-select v-model="selected_element.textLength" placeholder="请选择" @change="fontLength_chang">
                                <el-option
                                v-for="item in config.stringCount"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div> 
                    </div>
                </div>
                <div class="option-warp">
                    <label class="name">内容描述：</label>
                    <div class="content">
                        <div class="inputFrame nowrap">
                            <el-input type="input" v-model="selected_element.description"
                        ></el-input>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn">
                <div v-if="config.model=='编辑'?true:false" class="foot-btn">
                    <el-button type="primary" @click="saveTicketSample('edit')" >完成编辑</el-button>
                    <el-button @click="abandon" style="margin-left:32px">放弃编辑</el-button>
                </div>
                <div v-else class="foot-btn">
                    <el-button type="primary" @click="saveTicketSample('new')" >完成编辑</el-button>
                    <el-button @click="abandon" style="margin-left:32px">放弃编辑</el-button>
                </div>
            </div>
        </div>
    </section>
</div>
</template>

<script>
export default {
    data() {
        return {            
            size:60,
            isZoom:false,
            activeNames: ['elementLibary', 'elementSelect'],
            //图片
            defualt_background:require('ccm/assets/images/default.jpg'),
            qrcode:require('ccm/assets/images/qrcode.jpg'),
            barcode:require('ccm/assets/images/barcode.jpg'),
            //票版的边界
            boxBoder_x:"",
            boxBoder_y:"",
            zoom:1,
            //文字距离
            text_dis:{
                x:'',
                y:''
            },
            //画布的位置
            canvas:{
                x:0,
                y:0,
                dis_x:0,
                dis_y:0
            },
            
            //画布对象
            main_canvas:null,//画布对象
            mian_context:"", //画布上下文
            mouse_canvas:null,//画布对象
            mouse_context:"", //画布上下文
            mouseCanv_width:240,
            mouseCanv_height:319,
            selected_line_length:14,
            mmToPixel: 3.99,    //默认1mm=3.99px
            config: {
                //票版元素
                element: [{
                        name: '票券名称',
                        description: '票券名称',
                        required: true,
                        isSele:true
                    },{
                        name: '票券类型',
                        description: '兑换券',
                        required: false,
                        isSele:false
                    },{
                        name: '票券名称',
                        description: '广电标准票版第三方',
                        required: true,
                        isSele:false
                    }

                ],
                stringCount:[],
                fontSize:[],
                fontFamily:[{
                        label:'宋体',
                        label:'宋体'
                    },{
                        label:'仿宋体',
                        label:'仿宋体'
                    },
                ],
                scale_length:46, //尺标刻度尺大小
                model:'编辑',
                sele_background:null,
            },
            //编辑属性
            attribute: {
                uid:'',
                isDefualtticketSample:false,
                name: '',
                width: 60,
                height: 80,
                isPrintTitle:1,
                printMode:2,
                //当前选中元素列表
                couponprinitem:[],
                },
            //当前选中下标
            selected_No:{},

            //当前选中的元素的属性项
            selected_element:{
                name:'',
                x:'',
                y:'',
                size:'',
                showMode:'',
                family:'',
                isPrintTitle:'',
                bold:'',
                textLength:'',
                description:'',
            }, 
            
            //渠道
            channel_new:[],
            channels:[],
        }
    },
    watch :{},
    methods: {
        //尺寸大小改变
        size_sel(value) {
            this.attribute.width = value
            this.attribute.height = 80
            this.mouseCanv_width = this.attribute.width * this.mmToPixel 
            this.mouseCanv_height = this.attribute.height * this.mmToPixel 
            this.repaintCanvas();
        },
        scale_input_width(value) {
            this.size="";
            this.mouseCanv_width = value * this.mmToPixel;
            // this.size = '';
            this.repaintCanvas();
        },
        scale_input_height(value) {
            this.size="";
            this.mouseCanv_height = value* this.mmToPixel;
            this.repaintCanvas();
        },
        fontSize_change(val) {
            if(this.attribute.couponprinitem.length && this.selected_No>=0){
                let selected_element = this.selected_element
                selected_element.size = val
                this.mouse_context.font = 'small-caps '+ item.size + "px Courier New"
                selected_element.width = this.mouse_context.measureText(item.description).width //设置元素的宽度
                selected_element.height = val
                this.repaintCanvas()
            }
        },
        fontFamily_change(val) {
            if(this.attribute.couponprinitem.length && this.selected_No>=0){
                let selected_element = this.selected_element
                this.mouse_context.font = 'small-caps '+ item.size + `"px ${val}"`
                selected_element.width = this.mouse_context.measureText(item.description).width //设置元素的宽度
                selected_element.height = val
                this.repaintCanvas()
            }
        },
        fontLength_chang(val) {
            if(this.attribute.couponprinitem.length && this.selected_No>=0){
                this.selected_element.textLength = val
                this.repaintCanvas()
            }
        },
        bold_change(val) {
            if(this.attribute.couponprinitem.length && this.selected_No>=0){
                    this.selected_element.bold = val
                    this.repaintCanvas()
            }
        },
        showMode_change(val) {
            if(this.attribute.couponprinitem.length && this.selected_No>=0){
                let selected_element = this.selected_element
                selected_element.showMode = val
                this.repaintCanvas()
                setTimeout(this.repaintCanvas, 10)
                return
            }
        },
        isPrintTitle_change(val) {
            if(this.attribute.couponprinitem.length && this.selected_No>=0){
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
        //导入文件
        handerTicketFile(file) {},
        channel_handel(data) {},
        channel_change(){},
        /**
         * @function packElementItem - 组装票版元素
         * 
         * @return {Array} 
         */
        packElementItem() {
            let elementArr = [];

            let elemenet = [{
                title: '基本类型',
                content: ['票券名称','票券分类','票券类型','销售数量','起售数量','销售方式','票券编号','影院名称','影院地址','影院电话','销售单备注','销售单价']
            },{
                title: '票券消费规划',
                content: ['排除日期','星期范围','影院范围','消费渠道','消费者身份','会员生日','规则名称','票券使用数量','兑换补充金额','抵用金额','代金券消费密码','允许购买商品范围','代金券每笔低消','商品类型','商品数量','放映有效期','放映排除日期','放映星期范围','放映时段范围','影片名称','影片类型','影厅类型','']
            }]
        },
        scale_zoom() {
            this.isZoom = !this.isZoom
        },

        /**
         * @function drag -拖动元素 事件
         */
        drag(e,item,ind) {
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
                // this.mouseCanv_width * this.zoom ，this.mouseCanv_height * this.zoom
                if( e.clientX > this.boxBoder_x && 
                    e.clientX < this.boxBoder_x + 600  &&
                    e.clientY > this.boxBoder_y && e.clientY < this.boxBoder_y  + 600
                    ) {
                    document.documentElement.removeChild(newEl); // 移除元素
                    let obj = {};
                    // obj = item;
                    obj = JSON.parse(JSON.stringify(item));
                    //元素在画布的坐标
                    obj.bold = 0;//是否粗体
                    obj.delFlag = 0; //是否删除
                    obj.isPrintTitle = 0; //是否打印标题
                    obj.ulX = ( e.clientX - this.mouse_canvas.getBoundingClientRect().left) / this.zoom;  //设置元素的位置
                    obj.ulY = ( e.clientY - this.mouse_canvas.getBoundingClientRect().top) / this.zoom;
                    obj.itemCode = obj.code; //元素code
                    obj.showMode = obj.code=="k014"?1: 0; //默认文本  如果是电影院信息码则只能为二维码，不能为文本
                    obj.size = 12;  //设置元素的大小
                    obj.textLength = 40; //设置元素每行的长度
                    this.mouse_context.font = 'small-caps ' + obj.size + "px Courier New";
                    obj.width = this.mouse_context.measureText(obj.description).width //设置元素的宽度
                    obj.height = obj.size; //设置高 
                    obj.itemDefaultValue = obj.description; //设置元素的默认值
                    // console.log('新增画布元素--------',obj)
                    this.attribute.couponprinitem.push(obj);
                    this.selectedCurrentElement(obj); //设置当前选中的元素
                    this.selected_No = this.config.element.length-1 //设置当前选中元素的下标
                    this.config.element[ind].isSele = 1;
                    
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
        //当前选中元素 编辑的值
        selectedCurrentElement(_item) {
            if(_item){ 
                this.selected_element = _item
            }else{
                // let seleted = this.selected_element
                // let selectedKey = ['name','x','y','size','showMode','family','isPrintTitle','bold','textLength','description']
                // console.log(seleted)
                // for(let key  of Object.keys(seleted)) {   //清空当前选项
                //     seleted[key] = ''
                // }
                this.selected_element = {
                    name:'',
                    x:'',
                    y:'',
                    size:'',
                    showMode:'',
                    family:'',
                    isPrintTitle:'',
                    bold:'',
                    textLength:'',
                    description:'',
                }
                this.selected_No=-1
            }
        },
        /**
         * @function repaintCanvas 画布重绘画事件
         */
        //画布重绘
        repaintCanvas() {
            //鼠标移动每一帧都清除画布内容，然后重新绘画
            this.mouse_context.clearRect(0,0,600,600);
            //画背景
                // this.mouse_context.strokeStyle = '#343434';
                // this.mouse_context.save();
                // this.mouse_context.beginPath();
                // this.mouse_context.strokeRect(0,0,this.mouseCanv_width,this.mouseCanv_height);
                // this.mouse_context.closePath(); 

                //画布 x,y 
                let canvas_x = this.canvas.x
                let canvas_y = this.canvas.y
            if (this.sele_background) {				
                console.log('----画背景----')
                this.mouse_context.drawImage(this.sele_background,canvas_x,canvas_y,canvas_x + this.mouseCanv_width,canvas_y + this.mouseCanv_height);
            }
            else{
                this.mouse_context.restore();
                this.mouse_context.save();
                this.mouse_context.beginPath();
                // console.log(this.defualt_background,'是否有图片')
                console.log(`${canvas_x},${canvas_y}`)
                this.mouse_context.drawImage(this.defualt_background,canvas_x,canvas_y,this.mouseCanv_width,this.mouseCanv_height);
                this.mouse_context.closePath();
                this.mouse_context.stroke(); 
            }


            //绘画条形码和二维码
            if(this.attribute.couponprinitem.length) {
                this.attribute.couponprinitem.forEach(item => {
                    // console.log('画布的元素：',this.config.)
                    if(item.showMode==1) {      //二维码
                        this.drawImage(this.mouse_context,item);
                    }else if(item.showMode==2) { // 条形码
                        this.drawImage(this.mouse_context,item);

                    }else {                     //文本
                        this.drawText(this.mouse_context,item);
                    }
                    //如果选中
                    if(this.selected_No>=0) {
                        this.draw_cross();
                    }
                })
            }
            
            
        },
        /*
         *@function mouse_canvas -鼠标down事件
        */
        mouseCanves_Mdown(e) {
            var canv = this.mouse_canvas
            var e = e||event
            var x  = e.clientX - canv.getBoundingClientRect().left
            var y  = e.clientY - canv.getBoundingClientRect().top
            //如果画布有元素 则进行画笔
            if(this.attribute.couponprinitem.length) {
                var flag = true
                this.attribute.couponprinitem.forEach((item , index)=> {
                    var e_x1 = item.ulX*this.zoom 
                    var e_x2 = (item.ulX*1*this.zoom + item.width) 
                    var e_y1 = item.ulY*this.zoom 
                    var e_y2 = (item.ulY*1*this.zoom + item.height)

                    item.text_dis_x = x - item.ulX   //鼠标相对元素的距离 x,y
                    item.text_dis_y = y - item.ulY
                    this.canvas.dis_x = x - this.canvas.x
                    this.canvas.dis_y = y - this.canvas.y
                    /*
                     * 添加画布移动事件
                     */
                    canv.onmousemove = this.mouse_canvasMovie 
                    if (x >= e_x1 && x <= e_x2 && y >= e_y1 && y <= e_y2) {  
                        //当前被选中
                        flag = false
                        this.selected_element = item
                        // this.repaintCanvas()
                        this.selectedCurrentElement(item)
                        this.selected_No = index
                        // console.log('选中元素：',this.selected_element,'下标：',index)
                        this.text_dis.x = x - item.ulX
                        this.text_dis.y = y - item.ulY

                        
                        // console.log(this.text_dis_x,"鼠标到元素的距离")
                    }
                })
                if(flag) {
                    this.selectedCurrentElement("")
                    this.repaintCanvas() //画布
                    console.log(this.selected_element,'没有选中')
                }
            }
            
        },
        /**
         * 画布移动事件
         */
        mouse_canvasMovie($event) {
            console.log('移动-----',this.attribute.couponprinitem)
            var canv = this.mouse_canvas
            var e = $event||event

            var cx =  e.clientX - canv.getBoundingClientRect().left;
            var cy =  e.clientY - canv.getBoundingClientRect().top;
            console.log('鼠标移动距离',cx,'y轴：',cy)
            if(this.selected_No>=0){   //移动选中的元素
                console.log('已选中元素')
                let item = this.selected_element
                //重新给元素定位
                item.ulX = (cx - item.text_dis_x)
                item.ulY = (cy - item.text_dis_y)
            }else{              //移动整个画布
                this.attribute.couponprinitem.forEach(item => {
                    item.ulX = (cx - item.text_dis_x)
                    item.ulY = (cy - item.text_dis_y)
                })
                this.canvas.x = (cx - this.canvas.dis_x)
                this.canvas.y = (cy - this.canvas.dis_y)
                
            }
            // item.ulX = item.ulX <= 0? 0 : item.ulX
            // item.ulX = item.ulX >= this.mouseCanv_width  - item.width*2/3? this.mouseCanv_width-item.width*2/3 : item.ulX
            // item.ulY = item.ulY >= this.mouseCanv_height - item.size ? this.mouseCanv_height - item.size  : item.ulY
            // item.ulY = item.ulY < 0 ? 0 :item.ulY
            // console.log(item.ulX,item.ulY,"------元素此时的位置-------")
            this.repaintCanvas()
        },
        /**
         * 注销画布移动事件
         */
        mouseCanves_Mup() {
            var canv = this.mouse_canvas
            canv.onmousemove = null
            canv.onmouseup = null
        },
            
        //画十字架
        draw_cross() {
            var mouse_context= this.mouse_context
            mouse_context.strokeStyle = '#F00'
            mouse_context.save()
            mouse_context.translate(0.5,0.5);
            mouse_context.lineWidth = 1
            var lineWidth = this.selected_line_length
            mouse_context.beginPath()
            mouse_context.moveTo(this.selected_element.ulX - lineWidth,this.selected_element.ulY)
            mouse_context.lineTo(this.selected_element.ulX + lineWidth,this.selected_element.ulY)
            mouse_context.stroke()
            mouse_context.closePath()

            mouse_context.beginPath()
            mouse_context.moveTo(this.selected_element.ulX,this.selected_element.ulY - lineWidth);
            mouse_context.lineTo(this.selected_element.ulX,this.selected_element.ulY + lineWidth);
            mouse_context.stroke()
            mouse_context.closePath()
            mouse_context.restore()
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

        delCureentElement() {},
        /**
         * @function findcouponPrintModelDef - 查询票版元素定义
         */
        findcouponPrintModelDef() {
            this.$ccmList.findcouponPrintModelDef({}).then(res => {
                console.log(res)
                this.config.element = res.data
            }).catch(msg => {
                console.log(`查询票版元素错误：${msg}`);
            });
        },
        saveTicketSample(type) {},
        abandon() {},

    },
    created() {
        /**
         * @param config.stringCount    -字符串大小初始化
         * @param config.fontSize       -字体大小初始化
         */
        for(let i=0;i<40;i++){
            if(i>11&&i<27){
                this.config.stringCount.push({ label:`${i}号字体`,value:i})
            }
            this.config.fontSize.push({ label:`${i}`,value:i })
        }
        /**
         * 初始化图片
         */
        let img = new Image();
        img.src = this.defualt_background;
        this.defualt_background = img;

        let img2 = new Image();
        img2.src = this.qrcode;
        this.qrcode = img2;

        let img3 = new Image();
        img3.src = this.barcode;
        this.barcode =  img3 ;
        
        /**
         *    -初始化票版元素
         */
        this.findcouponPrintModelDef()
    },
    mounted() {
        //获取canvas对象
        let main_canvas = this.$refs.main_canvas
        this.main_canvas = main_canvas
        this.mian_context = main_canvas.getContext("2d")

        let mouse_canvas = this.$refs.mouse_canvas
        this.mouse_canvas = mouse_canvas
        this.mouse_context = mouse_canvas.getContext("2d")

        //元素库拖动的边界范围
        this.boxBoder_x = this.mouse_canvas.getBoundingClientRect().left;
        this.boxBoder_y = this.mouse_canvas.getBoundingClientRect().top;
        let breadcrumb = document.querySelector('.el-breadcrumb')
        if(breadcrumb){
            console.log(breadcrumb)
            this.boxBoder_y-=30
        }
        setTimeout(this.repaintCanvas(),500)
        
        // console.log('图片----------',this.defualt_background)

    }
}
</script>

<style lang="scss" scoped>
@mixin font-base {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    letter-spacing: 0;
    height: 19px;
}

@mixin flex {
    display: flex;
    display: -webkit-flex;
}

@mixin flex-no-wrap {
    flex-wrap: nowrap;
}
.star_required{color: #f56c6c;cursor: pointer;line-height: 14px}
.couponFull{
    position: fixed;
    height: 100%!important;
    top:0;
    right:0;
    left: 0;
    bottom: 0;
}
.coupon-template {
    //文字不能被选中
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    height:calc(100vh - 100px); 
    background: #f5f5f5;
    padding:12px;
    display: flex;
    @include flex;
    @include flex-no-wrap;
    .aside-left {
        background: #fff;
        width: 260px;
        height: 665px;
        overflow: auto;
        box-sizing: border-box;
        padding: 20px 10px 10px 10px;
        .element-item{
            font-size: 12px;
        }
    }

    .container {
        flex: 1;
        text-align: center;
        position: relative;
        .iconfont{
            position: absolute;
            right: 40px;
            top: 50%;
            transform: translateY(-50%);
            width: 19px;
            height: 19px;
            cursor: pointer;
            color: #333333;
        }
        .container-title{
            position: relative;
            text-align: center;
        }
        .main_title{
            font-family: MicrosoftYaHei;
            display: inline-block;
            font-size: 14px;
            color: #343434;
            letter-spacing: 0;
            margin: 10px 0;
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

    .aside-right {
        position: relative;
        background: green;
        width: 316px;
        padding: 20px 10px 10px 10px;
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        background: white;
        .option-warp{
            display: flex;
            height: 35px;
            line-height: 35px;
            justify-content: flex-end;
            .name{margin-right: 12px;color: #666;font-size: 12px;}
            .content{width: 180px;color: #666!important}
        }
        .sample-size{
            height: auto;
            .sel-size{
                label{
                    margin-top: 9px;
                }
            }
        }
        //编辑属性
        .attribute{
            //饿了么 样式重定
            .file_sele{
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
            .curren_eleSel{
                border-top: 1px solid #F5F5F5;
            } 
            .btn{
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: 10px;
                height: 32px;
                text-align: center;
                white-space: nowrap;
                .el-button--default{
                    margin-left: 10px;
                }
            }
        }  
    }
}

.title {
    @include font-base;
    color: #333333;
    .tips-text {
        color: #666666;
    }
}
</style>
<style lang="scss">
//覆盖element样式
.coupon-template{
    .el-radio__label{
        font-size:12px;
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
            height: 32px;
            line-height: 32px;
            .el-collapse-item__arrow{
                position: absolute;
                right: 20px;
                top: 30%;
            }
        }
        .el-collapse-item__header::after{
            background-color: #F5F5F5;
            width: 90%;
        }
        .el-collapse-item__wrap{
            padding-top: 12px;
            .el-collapse-item__content{
                padding-bottom: 10px;
            }
        }
    } 
}
</style>

