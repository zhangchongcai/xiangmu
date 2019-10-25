<template>
  <div class="details">
    <div class="ticketBox">
      <div class="canva" ref="canvas">
        <canvas width="500px" height="500px" ref="mouse_canvas"></canvas>
      </div>
    </div>
    <div class="content">
      <table>
        <tbody>
          <tr>
            <th>票版名称：</th>
            <td>{{attribute.name}}</td>
          </tr>
          <tr>
            <th>票版宽度：</th>
            <td>{{Math.ceil(attribute.width/3.99)}}毫米</td>
          </tr>
          <tr>
            <th>票版高度：</th>
            <td>{{Math.ceil(attribute.height/3.99)}}毫米</td>
          </tr>
          <tr>
            <th>第三方票类专用：</th>
            <td>{{attribute.isOtherUse?"是":"否"}}</td>
          </tr>
          <tr>
            <th>打印标题：</th>
            <td>{{attribute.isPrinTitle?"是":"否"}}</td>
          </tr>
          <tr>
            <th>打印方向：</th>
            <td>{{attribute.printMode==1?"横向":"纵向"}}</td>
          </tr>
        </tbody>
      </table>
      <div class="btn">
        <!-- <el-button type="primary"  v-print="'#print'">打印票版</el-button> -->
        <el-button type="primary" @click="back">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
// import print from './vue-print'
// Vue.use(print)
import Vue from 'vue'
function convertCanvasToImage (canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}
export default {

  data () {
    return {
      //图片路径
      sele_background: null,
      defualt_background: require('ccmSrc/assets/images/ticketSample/ticket.jpg'),
      qrcode: require('ccmSrc/assets/images/ticketSample/qrcode.jpg'),
      barcode: require('ccmSrc/assets/images/ticketSample/barcode.jpg'),
      //当前属性
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
        code: 'c048'
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
    }
  },
  methods: {
    //画十字架
    draw_cross () {
      var mouse_context = this.mouse_context;
      mouse_context.strokeStyle = '#F00';
      mouse_context.save();
      mouse_context.translate(0.5, 0.5);
      mouse_context.lineWidth = 1;
      var lineWidth = this.selected_line_length;
      mouse_context.beginPath();
      mouse_context.moveTo(this.selected_element.ulX - lineWidth, this.selected_element.ulY);
      mouse_context.lineTo(this.selected_element.ulX + lineWidth, this.selected_element.ulY);
      mouse_context.stroke();
      mouse_context.closePath();

      mouse_context.beginPath();
      mouse_context.moveTo(this.selected_element.ulX, this.selected_element.ulY - lineWidth);
      mouse_context.lineTo(this.selected_element.ulX, this.selected_element.ulY + lineWidth);
      mouse_context.stroke();
      mouse_context.closePath();
      mouse_context.restore();
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
      var width = item.showMode == 1 ? 84 : 164;
      var height = item.showMode == 1 ? 76.5 : 33
      item.width = width;
      item.height = height;
      this.mouse_context.drawImage(img, item.ulX, item.ulY, width, height);


    },
    //画布重绘
    repaintCanvas () {
      //鼠标移动每一帧都清除画布内容，然后重新绘画
      this.mouse_context.clearRect(0, 0, 600, 600);
      //画背景
      this.mouse_context.strokeStyle = '#343434';
      this.mouse_context.save();
      this.mouse_context.beginPath();
      this.mouse_context.strokeRect(0, 0, this.mouseCanv_width, this.mouseCanv_height);
      this.mouse_context.closePath();
      if (this.sele_background) {
        console.log('图片')
        this.mouse_context.drawImage(this.sele_background, 1, 1, this.mouseCanv_width - 1, this.mouseCanv_height - 1);
      }
      else {
        console.log('默认票版')
        this.mouse_context.restore();
        this.mouse_context.save();
        this.mouse_context.beginPath();
        this.mouse_context.drawImage(this.defualt_background, 1, 1, this.mouseCanv_width - 1, this.mouseCanv_height - 1);
        this.mouse_context.closePath();
        this.mouse_context.stroke();
      }


      //绘画条形码和二维码
      if (this.attribute.couponprinitem) {
        console.log(this.attribute.element)                    //文本
        this.attribute.couponprinitem.forEach(item => {
          if (item.showMode == 1) {      //二维码
            this.drawImage(this.mouse_context, item);
          } else if (item.showMode == 2) { // 条形码
            this.drawImage(this.mouse_context, item);

          } else {
            this.drawText(this.mouse_context, item);
          }
        })
      }
      //如果选中
      if (this.selected_element) {
        this.draw_cross();
      }

    },
    //获取信息
    getDetail (id) {
      this.$ccmList.selectmodelid({ id: id }).then(res => {
        if (res && res.code == 200) {
          this.unPackageData(res.data)
          // this.mouse_context.scale(1.4,1.4)          图像放大
          // let iamge = convertCanvasToImage(this.$refs.canva)
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
        }
        this.mouse_context.font = 'small-caps ' + item.size + "px Courier New";
        item.width = this.mouse_context.measureText(item.description).width //设置元素文字的宽度，用作选中判断
        item.height = item.size; //设置元素文字高，用作选中判断
      })
      data.isDefault = data.isDefault == 1 ? true : false
      this.mouseCanv_width = data.width
      this.mouseCanv_height = data.height
      _this.attribute = data
      _this.repaintCanvas()
    },
    back () {
      this.$store.commit("tagNav/removeTagNav", {
        name: this.$route.name,
        path: this.$route.path,
        title: this.$route.meta.title,
        query: this.$route.query
      })
      this.$router.push({ path: 'templateManagement' })
    },
    printTicket () {
      let ticket = this.data
      let ele_array = []
      ticket.ciTicketsampleitemList.forEach(item => {
        let data = {
          "movieTicketUid": item.uid,
          "x": item.ulX,
          "y": item.ulY,
          "elementValue": item.itemDefaultValue,
          "font_size": item.size,
          "font_black": item.bold,
          "show_modle": item.showMode,
        }
        ele_array.push(data)
      })
      let data = {
        "width": ticket.width,
        "height": ticket.height,
        "print_method": ticket.printMode,
        ticket_element: ele_array
      }
      console.log(JSON.stringify(data))
      util.readTerminalParameter(config => {
        util.printTicket('film_print', data, config, args => {
          console.log('成功回调', args)
        })
      })
    },
  },
  created () {
    let img = new Image();
    img.src = this.defualt_background;
    this.defualt_background = img;

    let img2 = new Image();
    img2.src = this.qrcode;
    this.qrcode = img2;

    let img3 = new Image();
    img3.src = this.barcode;
    this.barcode = img3;

    var id = this.$route.query.id;
    this.getDetail(id);

  },
  mounted () {
    this.mouse_canv = this.$refs.mouse_canvas
    this.mouse_context = this.mouse_canv.getContext('2d')
  }
}
</script>
<style lang="scss">
.details {
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  height: 100%;
  background: #f5f5f5;
  .ticketBox {
    height: 500px;
    flex: 1;
    .canva {
      width: 460px;
      height: 460px;
      margin: 20px auto;
    }
  }
  .content {
    padding: 10px;
    width: 300px;
    background: white;
    margin: 20px 0;
    th {
      text-align: right;
      padding: 5px;
    }
    table {
      font-size: 12px;
    }
    .btn {
      text-align: center;
      margin-top: 20px;
    }
  }
  table {
    th {
      color: #333;
    }
    td {
      color: #666;
    }
  }
}
</style>


