<template>
  <transition name="slide-fade">
  <div class="keyboardLayer" v-if="showState">
     <div class="keyboardInputBar">
        <div class="inputLayer">
          <input ref="allKey" class="input" :type="type" :rows="2" :placeholder="placeholder" :value="value" @input="$emit('input', $event.target.value)" />
          <i v-if="this.value" @click="$emit('input', '');" class="iconfont iconguanbi"></i>
        </div>
        <div class="dowmkey" @click="close">
          <i class="iconfont iconjianpanjiantou"></i>
        </div>
     </div>
     <ul class="keyboardBody" v-for="(item,index) in data" :key="index">
       <li 
      v-for="(subItem,subIndex) in item" :key="subIndex" 
      :style="subItem.style" 
      @click="onKey(subItem.key)"
      :class="subItem.key == '大写' && keyType ? 'on' : ''">{{subItem.key}}</li>
     </ul>
  </div>
  </transition>
</template>
<script>
export default {
  model:{
    prop:'value',
    event:'input',
  },
  props:{
    placeholder:{
      type:String,
      default:'',
    },
    type:{
      type:String,
      default:'text'
    },
    value:{
      type:String,
    }
  },
  data(){
    return{
      data:[
        [
          {key:'1'},{key:'2'},{key:'3'},{key:'4'},{key:'5'},{key:'6'},{key:'7'},{key:'8'},{key:'9'},{key:'0'},
        ],
        [
          {key:'q'},{key:'w'},{key:'e'},{key:'r'},{key:'t'},{key:'y'},{key:'u'},{key:'i'},{key:'o'},{key:'p'},
        ],
        [
          {key:'a'},{key:'s'},{key:'d'},{key:'f'},{key:'g'},{key:'h'},{key:'j'},{key:'k'},{key:'l'},{key:'删除',style:{fontSize:'1.4vw'}},
        ],
        [
          {key:'z'},{key:'x'},{key:'c'},{key:'v'},{key:'b'},{key:'n'},{key:'m'},{key:'.'},{key:'大写',style:{fontSize:'1.4vw'}},{key:'确定',style:{fontSize:'1.4vw'}},
        ],
      ],
      keyType:false,
      showState:0,
    }
  },
  mounted(){
    console.log(this);
  },
  methods:{
    onKey(key){
      switch(key){
        case '大写' : 
          this.data.map( item => {
            item.map( data => {
              let re =  /[a-zA-Z]/; 
              if(re.test(data.key)){
                if(this.keyType){
                  data.key = data.key.toLowerCase()
                }else{
                  data.key = data.key.toUpperCase()
                }
              }
            })
          })
          this.keyType = !this.keyType;
          break;
        case '确定' : 
          this.confirm();
          break;
        case '删除' :
          this.handleInput(this.value.substring(0,this.value.length-1))
          break;
        default :
          this.handleInput(this.value + key )
          break;

      }
    },
    handleInput(value){
      this.$emit('input', value);
    },
    show(){
      this.showState = 1;
    },
    close(){
      this.showState = 0;
    },
    confirm(){
      this.$emit('confirm',this.value)
      this.showState = 0;
    }
  }
}
</script>
<style lang="scss" scoped>
.keyboardLayer{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 2.1vh 4.5vw;
  z-index: 100;
  .keyboardInputBar{
    display: flex;
    justify-content: space-between;
  }
  .inputLayer{
    position: relative;
    width: 81.8vw;
    .input{
      display: inline-block;
      padding: 1.5vh 1.5vw;
      border:1px solid #BCBCBC;
      border-radius: 4px;
      width: 100%;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      box-sizing: border-box;
      font-size: 1.6vw;
      &:focus{
        border-color:#3B74FF;
      }
    }
    .iconfont{
      position: absolute;
      right: 0.5vw;
      top: 1.1vh;
      font-size: 2.4vw;
      color: #999;
      cursor: pointer;
    }
  }
  .dowmkey {
    width: 7.6vw;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #D9E4FF;
    border-radius: 4px;
    box-sizing: border-box;
    @include bg_color($font-color-blue);
    color:#fff;
    border-color:$font-color-blue;
    cursor: pointer;
    .iconfont{
      font-size: 2.4vw;
      color:#fff;
    }
  }
  .keyboardBody{
    display: flex;
    justify-content: space-between;
    margin-top: 2.1vh;
    &:last-child{
      li{
        &:last-child{
          @include bg_color($font-color-blue);
          color:#fff;
          border-color:$font-color-blue;
        }
      }
    }
    li{
      text-align: center;
      width: 7.6vw;
      font-size: 2.4vw;
      padding: 1.05vh 0;
      box-sizing: border-box;
      border: 1px solid #D9E4FF;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.25s;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
      &:active{
        @include bg_color($font-color-blue);
        color:#fff;
        border-color:$font-color-blue;
      }
    }
    .on{
      @include bg_color($font-color-blue);
      color:#fff;
      border-color:$font-color-blue;
    }
  }
}
.slide-fade-enter-active ,.slide-fade-leave-active{
  transition: all .3s ease-in-out;
}
// .slide-fade-leave-active {
//   transition: all .3s ;
// }
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(100px);
}
</style>


