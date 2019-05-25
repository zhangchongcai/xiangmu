<template>
    <div class="detail">
        <div class="ticketBox">
            <div class="canva">
                <canvas width="460px" height="460px" ref="canva" ></canvas>
            </div>
        </div>
        <div class="content">
            <table>
                <tbody>
                    <tr><th>票版名称：</th><td>{{data.name}}</td></tr>
                    <tr><th>票版宽度：</th><td>{{data.width}}</td></tr>
                    <tr><th>票版高度：</th><td>{{data.height}}</td></tr>
                    <tr><th>第三方票类专用：</th><td>{{data.isOtherUse?"是":"否"}}</td></tr>
                    <tr><th>打印标题：</th><td>{{data.isPrinTitle?"是":"否"}}</td></tr>
                    <tr><th>打印方向：</th><td>{{data.printMode==1?"横向":"纵向"}}</td></tr>
                    <tr><th>渠道：</th><td>{{data.ticketsampleChannelNames}}</td></tr>
                </tbody>
            </table>
            <div class="btn"><el-button type="primary" @click="back">返回</el-button></div>    
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //图片路径
            sele_background:null,
            defualt_background:require('../../../assets/ticketImg/images/ticket.jpg'),
            qrcode:require('../../../assets/ticketImg/images/qrcode.jpg'),
            barcode:require('../../../assets/ticketImg/images/barcode.jpg'),
            //当前属性
            data:'',
            mmToPixel: 3.99,    //默认1mm=3.99px
            //图片路径
            // defualt_background:require('../../../assets/ticketImg/images/ticket_back.jpg'),
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
        }
    },
    methods:{
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
                console.log('图片')		
                this.mouse_context.drawImage(this.sele_background,1,1,this.mouseCanv_width-1,this.mouseCanv_height-1);
            }
            else{
                console.log('默认票版')
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
        //获取信息
        getDetail(uid){
            console.log(uid,"票版uid")
            this.$api.ticketsampleQuery(uid)
            .then(data => {
                if(data && data.code==200){
                    data = data.data;
                    this.ticket_data = data.ciTicketsampleitemList;
                    this.mouseCanv_width = data.width * this.mmToPixel ;
                    this.mouseCanv_height = data.height * this.mmToPixel ;
                    data.ticketsampleChannelNames = data.ticketsampleChannelNames[0];
                    //获取图片base64
                    if(data.picUrl){
                        let url = data.sele_background ? data.sele_background: null;
                        let image = new Image();
                        image.src = url ;
                        this.sele_background = image; 
                    }
                    this.ticket_data.forEach(item => {
                        item.isSele = 1;
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
                    this.data = data ;
                    this.mouse_context.scale(1.4,1.4)

                    this.repaintCanvas();
                    
                }
            })
        },
        back(){
            this.$router.push('/CTM/ticketSampleManage')
        }
    },
    created(){
        let img = new Image();
        img.src = this.defualt_background;
        this.defualt_background = img;

        let img2 = new Image();
        img2.src = this.qrcode;
        this.qrcode = img2;

        let img3 = new Image();
        img3.src = this.barcode;
        this.barcode =  img3 ;

        var uid = this.$route.query.uid;
        this.getDetail(uid);
        console.log(uid)

    },
    mounted(){
        this.mouse_canv = this.$refs.canva;
        this.mouse_context = this.mouse_canv.getContext('2d')
        // this.repaintCanvas();

    }
}
</script>
<style lang="scss">
    .detail{
        min-width: 800px;
        display:flex;
        .ticketBox{
            flex: 1;
            height: 500px;
            background: gray;
            .canva{
                width: 460px;
                height: 460px;
                margin: 20px auto;
                }
        }
        .content{
            // border: 1px solid gray;
            padding: 10px;
            width: 300px;
            th{text-align: right;padding: 5px;}
            .btn{text-align: center}
        }
    }
</style>


