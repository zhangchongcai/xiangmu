<template>
    <div class="keyBoardLayer">
        <div  href="jacascript::void(0)" v-for="(item,index) in keyBoardArr" :key="index" class="keyItem" @click="onKey(item)">{{item.text}}</div>
        <!-- <input type="text" :value="value" @input="$emit('input',value)"> -->
    </div>
</template>
<script>
export default {
    // model:{
    // prop:'value',
    // event:'input',
    // },
    props: {
        showPointer: {
            type: Boolean,
            default: false
        },
        value:{
            type:[Number,String]
        }
    },
    data(){
        return{
            tempkeyBoardArr:[
                {type:'num', text:'7'},
                {type:'num', text:'8'},
                {type:'num', text:'9'},
                {type:'num', text:'4'},
                {type:'num', text:'5'},
                {type:'num', text:'6'},
                {type:'num', text:'1'},
                {type:'num', text:'2'},
                {type:'num', text:'3'},
                {type:'num', text:'0'},
                {type:'del', text:'删除'},
                {type:'remove', text:'清空'},
            ],
            keyValue:'',
        }
    },
    computed: {
       keyBoardArr() {
           if(this.showPointer) {
               this.tempkeyBoardArr.splice(11, 1, {type: 'pointer', text: '.'})
           }
           return this.tempkeyBoardArr;
       }
    },

    mounted() {
      let that = this;
      if(this.value){
          this.keyValue = this.value;
      }
    //   window.addEventListener("keyup", function(event) {
    //       if(event.keyCode == '8') {
    //           that.keyValue = that.keyValue.substring(0,that.keyValue.length-1);
    //           that.$emit('keynumber', that.keyValue)
    //       }
    //   })
    },

    destroyed() {
    //   window.removeEventListener('keyup', function(event) {
    //       if(event.keyCode == '8') {
    //           that.keyValue = that.keyValue.substring(0,that.keyValue.length-1);
    //           that.$emit('keynumber', that.keyValue)
    //       }
    //   })
    },

    methods:{
        onKey(item){ //键盘点击事件：通过事件keynumber传递值
        this.keyValue = this.value +''
        // this.value = this.value + '';
            switch(item.type){
                case 'del':
                if(this.keyValue == '') return;
                this.keyValue = this.keyValue.substring(0,this.keyValue.length-1);
                break;
                case 'remove':
                if(this.keyValue == '') return;
                this.keyValue = '';
                break;
                default:
                if(item.text == '.'){
                    if(this.keyValue.length == 0){
                        this.keyValue = '0'+item.text
                        this.$emit('input',this.keyValue)
                        return this.$emit('keynumber',this.keyValue)
                    }
                    if(this.keyValue.indexOf('.')>-1){
                        this.$emit('input',this.keyValue)
                        return this.$emit('keynumber',this.keyValue)
                    }
                }
                this.keyValue += item.text;
                break;
            }
            this.$emit('input',this.keyValue)
            //  this.$emit('keynumber',this.value)
        }
    }
}
</script>
<style lang="scss" scoped>
.keyBoardLayer{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .keyItem{
        display: block;
        width: 30%;
        font-size: 1.4vw;
        text-align: center;
        padding: 1.18vw 0;
        border:1px solid #A7B8E4;
        border-radius: 4px;
        transition: all 0.2s;
        color:$font-color3;
        user-select: none;
        &:active{
            @include bg_color($background-color-theme);
            color:$font-color-theme1
        }
        &:nth-child(-n+9){
            margin-bottom: 1.4vh;
        }
    }
    
}
</style>



