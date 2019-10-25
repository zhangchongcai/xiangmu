<template>
  <div :class='["coupon-template",config.isZoom ? "couponFull" : ""]'>
    <!-- 票版元素 -->
    <section class="aside-left">
      <h3 class="title">票版元素<span class="tips-text">(请拖动选择)</span></h3>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="元素库" name="elementLibary">
          <div class="element-item-top">
            <div @mousedown="drag($event,element,ind)" v-for="(element,ind) in config.element" :key="ind" v-show="!element.isSele" :class="['print-item',element.require=='1'?'star_required':'indent']">
              {{element.name}}:{{element.description}}
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="已选元素" name="elementSelect">
          <div class="element-item-bottom">
            <div @mousedown="drag($event,element,ind)" v-for="(element,ind) in config.element" :key="ind" v-show="element.isSele" :class="['print-item',element.require=='1'?'star_required':'indent']">
              {{element.name}}:{{element.description}}
            </div>
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
      <div :class='["design_box",config.isZoom ? "" : ""]' ref="design_box">
        <div class="scale_X">
          <ul>
            <li v-for="(item,ind) in config.scale_length" :key="ind"></li>
          </ul>
        </div>
        <div class="scale_Y">
          <ul>
            <li v-for="(item,ind) in config.scale_length" :key="ind"></li>
          </ul>
        </div>
        <div class="scale_box">
          <canvas ref="main_canvas" width="500px" height="500px" style="position:absolute;left:0;top:0;overflow:hidden" />

          <canvas ref="mouse_canvas" width="500px" height="500px" @mousedown="mouseCanves_Mdown" @mouseup="mouseCanves_Mup" @mouseout="mouseCanves_Mup" style="position:absolute;left:0;top:0;overflow:hidden" />
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
    <!-- 编辑属性 <el-checkbox-group v-model="checkList"> -->
    <section class="aside-right">
      <div class="attribute">
        <div class="title-tip">
          <span>编辑属性</span>
          <el-checkbox v-model="attribute.isDefault">设置为默认票版</el-checkbox>
        </div>
        <div class="option-warp">
          <label class="name">导入样票：</label>
          <div class="content">
            <div class="file_sele">
              <div href="javascript::void(0)" class="file-btn" type="plain" @click="handerTicketFile">选择文件</div>
              <span style="margin-left:5px;">{{config.fileName}}
                <i class="el-icon-close" v-if="config.file" @click="clearImg" style="cursor: pointer"></i>
              </span>
              <input type="file" @change="readTicketFile($event)" ref="ticketFile" style="display:none">
            </div>
          </div>
        </div>
        <div class="option-warp">
          <label class="name">票版名称：</label>
          <div class="content">
            <div class="inputFrame nowrap">
              <el-input type="input" v-model="attribute.name" maxlength="30" clearable></el-input>
            </div>
          </div>
        </div>
        <div class="option-warp sample-size">
          <label class="name">纸板尺寸：</label>
          <div class="content">
            <div class="ticketSize">
              <el-input type="input" maxlength="8" v-model="attribute.width" placeholder="宽mm" @change="scale_input_width"></el-input> <span style="margin:0 5px;color:#666666;font-size:12px">X</span>
              <el-input type="input" maxlength="8" v-model="attribute.height" placeholder="高mm" @change="scale_input_height"></el-input>
            </div>
            <div class="sel-size">
              <el-radio-group v-model="config.size" @change="size_sel">
                <el-radio :label="60">60mm <span style="margin:0 10px;color:#666666">X</span> 80mm</el-radio>
                <el-radio :label="70">70mm <span style="margin:0 10px;color:#666666">X</span> 80mm</el-radio>
                <el-radio :label="90">90mm <span style="margin:0 10px;color:#666666">X</span> 80mm</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
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
                <el-input type="input" :disabled=true v-model="selected_element.ulX" placeholder="X轴"></el-input> <span style="margin:0 5px;color:#666666;font-size:12px">X</span>
                <el-input type="input" :disabled=true v-model="selected_element.ulY" placeholder="Y轴"></el-input>
              </div>
            </div>
          </div>
          <div class="option-warp">
            <label class="name">字体大小：</label>
            <div class="content">
              <div class="inputFrame">
                <el-select v-model="selected_element.size" placeholder="请选择" @change="fontSize_change">
                  <el-option v-for="item in config.fontSize" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="option-warp">
            <label class="name">字体类型：</label>
            <div class="content">
              <div class="inputFrame">
                <el-select v-model="selected_element.style" placeholder="请选择" @change="fontStyle_change">
                  <el-option v-for="item in config.fontStyle" :key="item.value" :label="item.label" :value="item.value">
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
                <el-select v-model="selected_element.rowCharacter" placeholder="请选择" @change="rowCharacter_chang">
                  <el-option v-for="item in config.stringCount" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="option-warp" v-if="selected_element.itemCode==config.code && selected_element.itemCode">
            <label class="name">内容描述：</label>
            <div class="content">
              <div class="inputFrame nowrap">
                <el-input type="input" v-model="selected_element.description" clearable @change="descriptionChange" maxlength="50"></el-input>
              </div>
            </div>
          </div>
          <ul class="description" v-if="selected_element.itemCode==config.code && selected_element.itemCode">
            <li>注：1.添加制定票版元素,可按需组合成自定义内容</li>
            <!-- <li>请在"{}"符号内，填入元素名称</li>
                    <li>如：动感{放映效果}更吸引</li> -->
            <li>打印:2.使用方法：在"{}"符号内，填入元素名称</li>
          </ul>
        </div>
        <div class="foot-btn">
          <el-button type="primary" @click="saveTicketSample('edit')" v-if="model.isEdit">完成编辑</el-button>
          <el-button type="primary" @click="saveTicketSample('new')" v-else>完成编辑</el-button>
          <el-button @click="abandon" style="margin-left:32px">放弃编辑</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeNames: ['elementLibary', 'elementSelect'],
      //图片
      defualt_background: require('ccmSrc/assets/images/default.jpg'),
      qrcode: require('ccmSrc/assets/images/qrcode.jpg'),
      barcode: require('ccmSrc/assets/images/barcode.jpg'),
      sele_background: null,
      //票版的边界
      boxBoder_x: "",
      boxBoder_y: "",
      zoom: 1,

      //画布的位置
      canvas: {
        x: 0,
        y: 0,
        dis_x: 0,
        dis_y: 0
      },

      //画布对象
      main_canvas: null,//画布对象
      mian_context: "", //画布上下文
      mouse_canvas: null,//画布对象
      mouse_context: "", //画布上下文
      mouseCanv_width: 240,
      mouseCanv_height: 319,
      selected_line_length: 14,
      mmToPixel: 3.99,    //默认1mm=3.99px
      config: {
        //票版元素
        element: [],
        stringCount: [],
        fontSize: [],
        fontStyle: [{
          label: '宋体',
          value: 1
        }
        ],
        scale_length: 46, //尺标刻度尺大小
        fileName: '未选择文件',
        file: '',
        code: 'c048',
        size: 60,
        isZoom: false,
      },
      //编辑属性
      attribute: {
        isDefault: 0,
        name: '',
        width: 60,
        height: 80,
        isPrintTitle: 1,
        printMode: 2,
        //当前选中元素列表
        couponprinitem: [],
      },
      //当前选中下标
      selected_No: {},

      //当前选中的元素的属性项
      selected_element: {
        name: '',
        itemCode: '',
        ulX: '',
        ulY: '',
        size: '',
        showMode: '',
        style: '',
        isPrintTitle: '',
        bold: '',
        rowCharacter: '',
        name: '',
      },
      model: {
        id: '',
        isEdit: false,
      },
      //渠道
      channel_new: [],
      channels: [],
    }
  },
  watch: {},
  methods: {
    //尺寸大小改变
    size_sel (value) {
      this.attribute.width = value
      this.attribute.height = 80
      this.mouseCanv_width = this.attribute.width * this.mmToPixel
      this.mouseCanv_height = this.attribute.height * this.mmToPixel
      this.repaintCanvas();
    },
    scale_input_width (value) {
      this.attribute.width = value = value.replace(/[^\d\.]/ig, "")
      this.size = "";
      this.mouseCanv_width = value * this.mmToPixel;
      this.repaintCanvas();
    },
    scale_input_height (value) {
      this.attribute.height = value = value.replace(/[^\d\.]/ig, "")
      this.size = "";
      this.mouseCanv_height = value * this.mmToPixel;
      this.repaintCanvas();
    },
    fontSize_change (val) {
      if (this.attribute.couponprinitem.length && this.selected_No >= 0) {
        let selected_element = this.selected_element
        selected_element.size = val
        this.mouse_context.font = 'small-caps ' + selected_element.size + "px Courier New"
        selected_element.width = this.mouse_context.measureText(selected_element.description).width //设置元素的宽度
        selected_element.height = val
        this.repaintCanvas()
      }
    },
    //字体
    fontStyle_change (val) {
      if (this.attribute.couponprinitem.length && this.selected_No >= 0) {
        let selected_element = this.selected_element
        this.mouse_context.font = 'small-caps ' + selected_element.size + `"px ${val}"`
        selected_element.width = this.mouse_context.measureText(selected_element.description).width //设置元素的宽度
        selected_element.height = val
        this.repaintCanvas()
      }
    },
    //自定义内容
    descriptionChange (val) {
      if (this.attribute.couponprinitem.length && this.selected_No >= 0) {
        let selected_element = this.selected_element
        this.mouse_context.font = 'small-caps ' + selected_element.size + `"px ${val}"`
        selected_element.width = this.mouse_context.measureText(selected_element.description).width //设置元素的宽度
        selected_element.description = val
        this.repaintCanvas()
      }
    },
    rowCharacter_chang (val) {
      if (this.attribute.couponprinitem.length && this.selected_No >= 0) {
        this.selected_element.rowCharacter = val
        this.repaintCanvas()
      }
    },
    bold_change (val) {
      if (this.attribute.couponprinitem.length && this.selected_No >= 0) {
        this.selected_element.bold = val
        this.repaintCanvas()
      }
    },
    showMode_change (val) {
      if (this.attribute.couponprinitem.length && this.selected_No >= 0) {
        let selected_element = this.selected_element
        selected_element.showMode = val
        this.repaintCanvas()
        setTimeout(this.repaintCanvas, 10)
        return
      }
    },
    isPrintTitle_change (val) {
      if (this.attribute.couponprinitem.length && this.selected_No >= 0) {
        this.selected_element.isPrintTitle = val
      }
    },
    //是否打印标题
    changePrintTitle (val) {
      if (val == 2) {
        console.log(val)
        this.selected_element.isPrintTitle = 0
        this.isPrintTitle_change(0)
      }
    },
    //导入文件
    handerTicketFile () {
      this.$refs.ticketFile.click()
    },
    scale_zoom () {
      this.config.isZoom = !this.config.isZoom
    },

    /**
     * @function drag -拖动元素 事件
     */
    drag (e, item, ind) {
      // var  target= e.target.parentNode;
      var target = e.target
      console.log(target)
      var newEl = target.cloneNode(true)
      newEl.style.position = 'absolute'
      newEl.style.left = e.pageX + 'px'
      newEl.style.top = e.pageY + 'px'
      newEl.style.corson = 'pointer'
      newEl.style.zIndex = 100
      document.documentElement.appendChild(newEl)
      document.onmousemove = (e) => {
        newEl.style.left = e.pageX - 5 + 'px'
        newEl.style.top = e.pageY - 5 + 'px'
      }
      //元素库拖动的边界范围
      this.boxBoder_x = this.mouse_canvas.getBoundingClientRect().left
      this.boxBoder_y = this.mouse_canvas.getBoundingClientRect().top
      // let wrapper = document.querySelector('.content-wrapper')
      // let t = wrapper.scrollTop
      // this.boxBoder_y -= t
      document.onmouseup = (e) => {
        // this.mouseCanv_width * this.zoom ，this.mouseCanv_height * this.zoom
        if (e.clientX > this.boxBoder_x &&
          e.clientX < this.boxBoder_x + 600 &&
          e.clientY > this.boxBoder_y && e.clientY < this.boxBoder_y + 600
        ) {
          document.documentElement.removeChild(newEl) // 移除元素
          let obj = {};
          // obj = item;
          obj = JSON.parse(JSON.stringify(item))
          //元素在画布的坐标
          obj['bold'] = 0 //是否粗体
          obj['delFlag'] = 0  //是否删除
          obj['isPrintTitle'] = 0  //是否打印标题
          obj['showMode'] = obj.code == "k014" ? 1 : 0 //默认文本  如果是电影院信息码则只能为二维码，不能为文本
          obj['size'] = 12;  //设置元素的大小
          obj['rowCharacter'] = 40  //设置元素每行的长度
          obj['style'] = 1,    //设置字体family
            obj['height'] = obj.size //设置高 
          this.mouse_context.font = 'small-caps ' + obj.size + "px Courier New"
          obj['width'] = this.mouse_context.measureText(obj.name).width //设置元素的宽度
          obj['itemCode'] = obj.code
          obj.ulX = (e.clientX - this.mouse_canvas.getBoundingClientRect().left) / this.zoom  //设置元素的位置
          obj.ulY = (e.clientY - this.mouse_canvas.getBoundingClientRect().top) / this.zoom
          // console.log('新增画布元素--------',obj)


          if (obj.code == this.config.code) {   //判断是否为自定义元素
            obj['description'] = '动感{放映效果}更吸引'
          } else {
            this.config.element[ind].isSele = 1;
          }
          this.attribute.couponprinitem.push(obj);

          this.selected_No = this.attribute.couponprinitem.length - 1 //设置当前选中元素的下标
          this.selectedCurrentElement(obj); //设置当前选中的元素

          this.repaintCanvas();  //重绘

        } else {
          this.$message({
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
    selectedCurrentElement (_item) {
      if (_item) {
        this.selected_element = _item
        console.log(_item)
      } else {
        this.selected_element = {
          name: '',
          x: '',
          y: '',
          size: '',
          showMode: '',
          family: '',
          isPrintTitle: '',
          bold: '',
          rowCharacter: '',
          description: '',
        }
        this.selected_No = -1
      }
    },
    /**
     * @function repaintCanvas 画布重绘画事件
     */
    //画布重绘
    repaintCanvas () {
      //鼠标移动每一帧都清除画布内容，然后重新绘画
      this.mouse_context.clearRect(0, 0, 600, 600);
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
        this.mouse_context.drawImage(this.sele_background, canvas_x, canvas_y, this.mouseCanv_width, this.mouseCanv_height);
      }
      else {
        this.mouse_context.restore();
        this.mouse_context.save();
        this.mouse_context.beginPath();
        // console.log(this.defualt_background,'是否有图片')
        this.mouse_context.drawImage(this.defualt_background, canvas_x, canvas_y, this.mouseCanv_width, this.mouseCanv_height);
        this.mouse_context.closePath();
        this.mouse_context.stroke();
      }


      //绘画条形码和二维码
      if (this.attribute.couponprinitem.length) {
        this.attribute.couponprinitem.forEach(item => {
          // console.log('画布的元素：',this.config.)
          if (item.showMode == 1) {      //二维码
            this.drawImage(this.mouse_context, item);
          } else if (item.showMode == 2) { // 条形码
            this.drawImage(this.mouse_context, item);
          } else {                     //文本
            this.drawText(this.mouse_context, item);
          }
          //如果选中
          if (this.selected_No >= 0) {
            this.draw_cross();
          }
        })
      }


    },
    /*
     *@function mouse_canvas -鼠标down事件
    */
    mouseCanves_Mdown (e) {
      var canv = this.mouse_canvas
      var e = e || event
      var x = e.clientX - canv.getBoundingClientRect().left
      var y = e.clientY - canv.getBoundingClientRect().top
      //如果画布有元素 则进行画笔
      if (this.attribute.couponprinitem.length) {
        var flag = true
        this.attribute.couponprinitem.forEach((item, index) => {
          var e_x1 = item.ulX * this.zoom
          var e_x2 = (item.ulX * 1 * this.zoom + item.width)
          var e_y1 = item.ulY * this.zoom
          var e_y2 = (item.ulY * 1 * this.zoom + item.height)

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
            console.log('已选当前元素：', item.description)
            this.selectedCurrentElement(item)
            this.selected_No = index
            // console.log('选中元素：',this.selected_element,'下标：',index)

            this.repaintCanvas()
            // console.log(this.text_dis_x,"鼠标到元素的距离")
          }
        })
        if (flag) {
          this.selectedCurrentElement("")
          this.repaintCanvas() //画布
          console.log(this.selected_element, '没有选中')
        }
      }

    },
    /**
     * 画布移动事件
     */
    mouse_canvasMovie ($event) {
      var canv = this.mouse_canvas
      var e = $event || event

      var cx = e.clientX - canv.getBoundingClientRect().left;
      var cy = e.clientY - canv.getBoundingClientRect().top;
      // console.log('鼠标移动距离',cx,'y轴：',cy)
      if (this.selected_No >= 0) {   //移动选中的元素
        let item = this.selected_element
        //重新给元素定位
        item.ulX = (cx - item.text_dis_x)
        item.ulY = (cy - item.text_dis_y)
      }
      // else{              //移动整个画布
      //     this.attribute.couponprinitem.forEach(item => {
      //         item.ulX = (cx - item.text_dis_x)
      //         item.ulY = (cy - item.text_dis_y)
      //     })
      //     this.canvas.x = (cx - this.canvas.dis_x)
      //     this.canvas.y = (cy - this.canvas.dis_y)

      // }
      // item.ulX = item.ulX <= 0? 0 : item.ulX
      // item.ulX = item.ulX >= this.mouseCanv_width  - item.width*2/3? this.mouseCanv_width-item.width*2/3 : item.ulX
      // item.ulY = item.ulY >= this.mouseCanv_height - item.size ? this.mouseCanv_height - item.size  : item.ulY
      // item.ulY = item.ulY < 0 ? 0 :item.ulY
      // console.log(item.ulX,item.ulY,"------元素此时的位置-------")
      this.repaintCanvas()
    },
    /**
     * @function -注销画布移动事件
     */
    mouseCanves_Mup () {
      var canv = this.mouse_canvas
      canv.onmousemove = null
      canv.onmouseup = null
    },

    //画十字架
    draw_cross () {
      var mouse_context = this.mouse_context
      mouse_context.strokeStyle = '#F00'
      mouse_context.save()
      mouse_context.translate(0.5, 0.5);
      mouse_context.lineWidth = 1
      var lineWidth = this.selected_line_length
      mouse_context.beginPath()
      mouse_context.moveTo(this.selected_element.ulX - lineWidth, this.selected_element.ulY)
      mouse_context.lineTo(this.selected_element.ulX + lineWidth, this.selected_element.ulY)
      mouse_context.stroke()
      mouse_context.closePath()

      mouse_context.beginPath()
      mouse_context.moveTo(this.selected_element.ulX, this.selected_element.ulY - lineWidth);
      mouse_context.lineTo(this.selected_element.ulX, this.selected_element.ulY + lineWidth);
      mouse_context.stroke()
      mouse_context.closePath()
      mouse_context.restore()
    },
    //文本画笔
    drawText (ctx, item) {
      var fontSize = item.size ? item.size : 12;
      var bold = item.bold ? "bold" : '';
      ctx.font = `${bold} ${fontSize}px arial`;
      ctx.fillStyle = '#333333'
      ctx.textBaseline = 'top';
      var wraplen = item.rowCharacter;
      var text = item.description
      if (item.rowCharacter > 0) {
        var len = text.length;
        var arr_val = new Array();
        while (len > 0) {
          if (len < wraplen) {
            arr_val.push(text);
            break;
          } else {
            arr_val.push(text.substring(0, wraplen));
          }
          text = text.substring(wraplen, len);
          len = text.length;
        }
        var size = arr_val.length;
        for (var i = 0; i < size; i++) {
          ctx.fillText(arr_val[i], item.ulX, i * item.size + item.ulY);
        }
        item.width = ctx.measureText(arr_val[0]).width;
      }

    },
    //画二维码和条形码
    drawImage (ctx, item) {
      var img = item.showMode == 1 ? this.qrcode : this.barcode;
      // var width = item.showMode==1? 84 : 164;
      // var height = item.showMode ==1? 76.5 : 33
      var width = item.showMode == 1 ? 100 : 195;
      var height = item.showMode == 1 ? 100 : 30
      item.width = width;
      item.height = height;
      this.mouse_context.drawImage(img, item.ulX, item.ulY, width, height);


    },
    /**
     * @function readTicketFile -读取图片
     */
    readTicketFile ($event) {
      let file = this.$refs.ticketFile.value;
      let oFileReader = new FileReader();
      this.config.fileName = file.substring(file.lastIndexOf('\\') + 1)
      let fileName = file.substring(file.lastIndexOf(".") + 1).toLowerCase();
      // console.log(this.$refs.ticketFile)
      oFileReader.onloadend = (e) => {
        let base64 = e.target.result;
        let img = new Image();
        img.src = base64;
        // console.log(base64)
        this.sele_background = img;
        this.sele_background.onload = _ => {
          this.repaintCanvas()
        }
      };
      if (fileName == "jpg" || fileName == "jpeg" || fileName == "png" || fileName == "bmp") {
        console.log($event.srcElement.files[0].size)
        if (($event.srcElement.files[0].size / 1024 / 1024 / 2) > 1) {
          this.$refs.ticketFile.value = "";
          return this.$message({
            message: '图片不能超过2m！',
            type: 'warning',
            durantion: 1000,
          })
        }
        this.config.file = $event.srcElement.files[0]
        console.log(this.config.file)
        oFileReader.readAsDataURL($event.srcElement.files[0]);
        console.log($event)
      } else {
        this.$refs.ticketFile.value = ""
        this.$message({
          message: '请选择图片格式！',
          type: 'warning',
          duration: 1000,
        })
      }

    },
    /**
     * 清除图片
     */
    clearImg () {
      this.config.fileName = '未选择文件'
      this.config.file = ''
      this.sele_background = ''
      this.$refs.ticketFile.value = ''
      this.repaintCanvas()
    },
    /**
     * @function findcouponPrintModelDef - 查询票版元素定义
     */
    findcouponPrintModelDef () {
      this.$ccmList.findcouponPrintModelDef({}).then(res => {
        this.config.element = res.data
        if (this.model.isEdit) {
          this.searchTemplate(this.model.id)
        }
      }).catch(msg => {
        console.log(`查询票版元素错误：${msg}`);
      });
    },
    judge () {
      let element = this.config.element
      console.log(element)
      for (var i = 0; i < element.length; i++) {
        if (!element[i].isSele && element[i].require == '1') {
          this.$message({
            message: '带*号的元素必须选择',
            type: 'warning',
            duration: 1000
          });
          return false
        }
      }
      return true
    },
    /**
     * @function saveTicketSample  保存修改
     * @param   type     eidt=编辑  new=新建
     * 
    */
    async saveTicketSample (type) {

      let blo = this.judge()
      if (!blo) return

      let params = this.packageData(type)
      //上传图片
      if (this.config.file) {
        let paramsImg = new FormData();
        paramsImg.append('file', this.config.file); //传文件
        let imgData = await this.$ccmList.addBackgroundImg(paramsImg)
        if (imgData.code == 200) {
          params['imageurl'] = imgData.data
        } else {
          this.$message({
            type: 'warning',
            message: imgData.msg ? imgData.msg : '上传图片失败！'
          })
        }
      }
      this.$ccmList.addmodel(params).then(res => {
        let type = 'warning',
          message = res.msg ? res.msg : '修改票版失败！'
        if (res.code == 200) {
          type = 'success',
            message = res.msg ? res.msg : '修改票版成功！'
        }
        this.$message({
          type,
          message
        })
        if (res.code == 200) {
          this.$store.commit("tagNav/removeTagNav", {
            name: this.$route.name,
            path: this.$route.path,
            title: this.$route.meta.title,
            query: this.$route.query
          })
          this.$router.push({
            path: 'templateManagement'
          });
          this.$router.push({
            path: 'templateManagement'
          });
        }
        // console.log(res)
      })

    },
    /**
     * @function packageData  -上报报文组装
     * 1.默认元素传name不传description
     * 2.自定义元素传description不传name
     * 
    */
    packageData () {
      let params = JSON.parse(JSON.stringify(this.attribute))
      params.couponprinitem.forEach(item => {
        //减去画布相对位置
        // item.ulX -= this.canvas.x  
        // item.ulY -= this.canvas.y
        //code = 'c048' 为自定义元素，description。不是自定义元素去掉description属性
        if (item.itemCode == this.config.code) {
          // item.description = `{${item.description}}`
          delete item.name
        } else {
          item.name = `${item.name}:${item.description}`  //后端不返回description 前端拼接
          delete item.description
        }
      })
      params.width = params.width * this.mmToPixel
      params.height = params.height * this.mmToPixel
      //修改需传入id
      if (this.model.isEdit) {
        params['id'] = this.model.id
      }
      params.isDefault = params.isDefault ? 1 : 0
      return params
    },

    searchTemplate (id) {
      this.$ccmList.selectmodelid({ id: id }).then(res => {
        let type = 'warning',
          message = res.msg ? res.msg : '查询票版失败！'
        if (res.code == 200) {
          type = 'success',
            this.unPackageData(res.data)
        } else {
          this.$message({
            type,
            message
          })
        }
      })
    },
    unPackageData (data) {
      let _this = this
      if (data.imageurl) {
        let image = new Image()
        image.src = data.imageurl
        image.onload = _ => {
          this.sele_background = image
          this.repaintCanvas()
        }
      }
      data.couponprinitem.forEach(item => {
        if (item.itemCode == this.config.code) {
          item.name = '自定义内容'
          // item.description = item.description.match(/{(\S*)}/)[1]
        } else {
          let strArr = item.name.split(':')    //后端不返回description 前端拼接
          // console.log(strArr)
          item.name = strArr[0]
          item.description = strArr[1]
          _this.config.element.forEach(_item => {
            if (_item.code == item.itemCode) {
              _item.isSele = 1
            }
          })
        }
        this.mouse_context.font = 'small-caps ' + item.size + "px Courier New";
        item.width = this.mouse_context.measureText(item.description).width //设置元素文字的宽度，用作选中判断
        item.height = item.size; //设置元素文字高，用作选中判断
      })
      data.isDefault = data.isDefault == 1 ? true : false

      this.mouseCanv_width = data.width
      this.mouseCanv_height = data.height
      data.width = this.config.size = Math.ceil(data.width / this.mmToPixel)
      data.height = Math.ceil(data.height / this.mmToPixel)
      _this.attribute = data
      _this.repaintCanvas()
    },
    /**
     * @function abandon  -放弃编辑
     * 
    */
    abandon () {
      this.$confirm('确定放弃编辑？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit("tagNav/removeTagNav", {
          name: this.$route.name,
          path: this.$route.path,
          title: this.$route.meta.title,
          query: this.$route.query
        })
        this.$router.push({
          path: 'templateManagement'
        });
      })
    },
    //键盘在画布移动事件
    keyDownonCanva (event) {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      let selected = this.selected_element
      if (this.attribute.couponprinitem.length && this.selected_No >= 0) {
        switch (e.keyCode) {
          case 38:
            //向上
            selected.ulY--;
            // selected.ulY = selected.ulY < 0 ? 0 :selected.ulY;
            this.repaintCanvas()
            return false  //阻止滚动
          case 39:
            //向右
            selected.ulX++;
            // selected.ulX = selected.ulX >= this.mouseCanv_width  - (selected.width*2/3)? this.mouseCanv_width-(selected.width*2/3) : selected.ulX
            this.repaintCanvas()
            return false
          case 40:
            //向下
            selected.ulY++
            // selected.ulY = selected.ulY >= this.mouseCanv_height - selected.size ? this.mouseCanv_height - selected.size  : selected.ulY;
            this.repaintCanvas()
            return false
          case 37:
            //向左
            selected.ulX--
            // selected.ulX = selected.ulX <= 0? 0 : selected.ulX
            this.repaintCanvas()
            return false
          case 46:
            //删除当前元素
            this.delCureentElement()
            return false
          default:
            this.repaintCanvas()
        }
      }

    },
    //删除当前元素
    delCureentElement () {
      let selected = this.selected_element;
      let _couponprinitem = this.attribute.couponprinitem
      if (_couponprinitem.length && this.selected_No >= 0) {
        console.log("删除当前元素:", selected.name, '序号：', this.selected_No)
        let _itemCode = selected.itemCode;
        _couponprinitem.splice(this.selected_No, 1); //删除当前选中元素
        this.selectedCurrentElement("");
        this.selected_No = -1
        selected = null;
        let flag = _couponprinitem.find((element) => (element.code == _itemCode))
        this.config.element.forEach(item => {
          if (item.code == _itemCode) {
            if (!flag) {
              item.isSele = 0
              return
            }
          }
          this.repaintCanvas();
        })
      }
    },
  },

  async created () {
    if (this.$route.query.isEdit) {
      this.model.isEdit = this.$route.query.isEdit ? true : false
      this.model.id = this.$route.query.id
    }
    /**
     * @param config.stringCount    -字符串大小初始化
     * @param config.fontSize       -字体大小初始化
     */
    for (let i = 1; i <= 40; i++) {
      if (i >= 6 && i < 36) {
        this.config.fontSize.push({ label: `${i}号字体`, value: i })
      }
      this.config.stringCount.push({ label: `${i}`, value: i })
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
    this.barcode = img3;

    /**
     *    -初始化票版元素
     */
    await this.findcouponPrintModelDef()
  },
  mounted () {
    //获取canvas对象
    let main_canvas = this.$refs.main_canvas
    this.main_canvas = main_canvas
    this.mian_context = main_canvas.getContext("2d")

    let mouse_canvas = this.$refs.mouse_canvas
    this.mouse_canvas = mouse_canvas
    this.mouse_context = mouse_canvas.getContext("2d")

    if (!this.model.isEdit) {
      setTimeout(this.repaintCanvas, 500)
    }

    //键盘事件
    window.onkeydown = this.keyDownonCanva;

  },
  destroyed () {
    window.onkeydown = null
    window.onscroll = null
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
.star_required {
  &::before {
    content: "*";
    color: #f56c6c;
    cursor: pointer;
    line-height: 14px;
  }
}
.print-item {
  font-size: 12px;
  color: #666;
  cursor: pointer;
}
.indent {
  text-indent: 5px;
}
.couponFull {
  position: fixed;
  height: 100% !important;
  z-index: 99;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.coupon-template {
  //文字不能被选中
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  box-sizing: border-box;
  background: #f5f5f5;
  padding: 12px;
  @include flex;
  @include flex-no-wrap;
  .aside-left {
    background: #fff;
    width: 260px;
    box-sizing: border-box;
    padding: 20px 10px 10px 10px;
  }
  .element-item-top {
    font-size: 12px;
    max-height: 400px;
    height: 400px;
    overflow: auto;
  }
  .element-item-bottom {
    font-size: 12px;
    max-height: 156px;
    overflow: auto;
  }
  .container {
    flex: 1;
    text-align: center;
    position: relative;
    .iconfont {
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      width: 19px;
      height: 19px;
      cursor: pointer;
      color: #333333;
    }
    .container-title {
      position: relative;
      text-align: center;
    }
    .main_title {
      font-family: MicrosoftYaHei;
      display: inline-block;
      font-size: 14px;
      color: #343434;
      letter-spacing: 0;
      margin: 10px 0;
      font-weight: 550;
    }
    // 票版设计
    .design_box_full {
      width: 650px !important;
      height: 650px !important;
    }
    .design_box {
      width: 550px;
      height: 550px;
      margin: 0 auto;
      overflow: hidden;
      box-sizing: border-box;
      position: relative;
      .scale_X {
        height: 10px;
        position: absolute;
        border-bottom: 1px solid #999;
        ul {
          margin-left: 40px;
          li {
            float: left;
            margin-left: 10px;
            width: 1px;
            height: 10px;
            background: #999;
          }
          li:nth-child(1) {
            margin: 0px;
          }
        }
      }
      .scale_Y {
        width: 10px;
        position: absolute;
        border-right: 1px solid #999;
        ul {
          margin-top: 40px;
          li {
            margin-top: 10px;
            width: 10px;
            height: 1px;
            background: #999;
          }
          li:nth-child(1) {
            margin: 0px;
          }
        }
      }
      .scale_box {
        position: absolute;
        box-sizing: border-box;
        top: 10px;
        left: 10px;
      }
    }
    .del {
      text-align: center;
    }
  }

  .aside-right {
    position: relative;
    background: green;
    width: 316px;
    padding: 20px 10px 10px 10px;
    position: relative;
    box-sizing: border-box;
    background: white;
    .title-tip {
      display: flex;
      justify-content: space-between;
      height: 30px;
    }
    .option-warp {
      display: flex;
      height: 35px;
      line-height: 35px;
      justify-content: flex-end;
      .name {
        margin-right: 8px;
        color: #666;
        font-size: 12px;
      }
      .content {
        width: 180px;
        color: #666 !important;
      }
    }
    .sample-size {
      height: auto;
      .sel-size {
        label {
          margin-top: 9px;
        }
      }
    }
    //编辑属性
    .attribute {
      //饿了么 样式重定
      .file_sele {
        .file-btn {
          background: #ffffff;
          border: 1px solid #bcbcbc;
          display: inline-block;
          text-align: center;
          width: 64px;
          height: 32px;
          line-height: 32px;
          font-size: 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          &:hover {
            border: 1px solid #3b74ff;
            color: #3b74ff;
          }
        }
      }
      .ticketSize {
        .el-input {
          width: 62px;
          input {
            font-size: 12px !important;
            padding: 0 10px !important;
          }
        }
        .el-input__inner {
          width: 62px;
          font-size: 12px !important;
          padding: 0 10px !important;
          text-align: center;
        }
      }
      .qudao {
        white-space: nowrap;
        .el-input {
          width: 150px;
        }
        .el-select__tags {
          max-width: 145px !important;
        }
        span {
          font-size: 12px;
        }
      }
      .inputFrame {
        width: 150px;
        white-space: nowrap;
        color: #333333;
      }
      .curren_eleSel {
        border-top: 1px solid #f5f5f5;
      }
      .description {
        li {
          list-style: none;
          font-size: 12px;
          color: red;
          text-align: center;
          padding: 2px 0;
        }
      }
      .foot-btn {
        padding: 10px 0;
        text-align: center;
        white-space: nowrap;
        .el-button--default {
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
.el-radio__label {
  font-size: 12px;
}
/deep/ .el-collapse {
  border: none;
  padding: 0;
  .el-collapse-item__header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    color: #666666;
    font-size: 12px;
    padding: 0;
    padding-left: 6px;
    height: 32px;
    line-height: 32px;
    .el-collapse-item__arrow {
      position: absolute;
      right: 20px;
      top: 30%;
    }
  }
  .el-collapse-item__header::after {
    background-color: #f5f5f5;
    width: 90%;
  }
  .el-collapse-item__wrap {
    padding-top: 12px;
    .el-collapse-item__content {
      padding-bottom: 0px;
    }
  }
}
/deep/ .el-input input {
  font-size: 12px;
}
/deep/ .el-radio__label {
  font-size: 12px;
}
</style>

