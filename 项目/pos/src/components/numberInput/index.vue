<template>
  <div class="numberInputLayer">
    <div class="inputLayer">
      <button  :disabled="this.value == this.min"  @click="minus" class="el-icon-minus minus"
      :class="this.value == this.min ? 'disabled' : ''"></button>
      <input type="number" 
      :min="min" 
      :max="max"
      :value="value"
      @change="change"
      @focus="focus"
      @input="$emit('input', $event.target.value)"/>
      <button :disabled="this.value == this.max" @click="plus" class="el-icon-plus plus"
       :class="this.value == this.max ? 'disabled' : ''"></button>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    value:{
      type:Number
    },
    min:{
      type:Number,
      default:-Infinity
    },
    max:{
      type:Number,
      default:Infinity,
    }
  },
  data(){
    return{

    }
  },
 
  methods:{
    change(){
      this.$emit('change',this.value)
    },
    focus(){
      this.$emit('focus')
    },
    minus(){
      let val = this.value
      let newVal = --val
      this.$emit('input',newVal)
      this.$emit('change',newVal)
    },
    plus(){
      let val = this.value
      let newVal = ++val
      this.$emit('input',newVal)
      this.$emit('change',newVal)
    },
  }
}
</script>
<style lang="scss" scoped>
  .numberInputLayer{
    display: inline-block;
    .inputLayer{
      display: flex;
      button{
        font-size: $font-size12;
        color:#3B74FF;
        border:1px solid;
        background: #fff;
      }
      .minus{
        border-right: none;
      }
      .plus{
        border-left: none;
      }
      .disabled{
        color:#BCBCBC;
        cursor: not-allowed;
      }
      input{
        font-size: $font-size12;
        display: inline-block;
        width: 3.3vw;
        text-align: center;
        padding-top: 0.3vw;
        padding-bottom: 0.3vw;
        border:1px solid #3B74FF;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
          -webkit-appearance: none;
      }
      input[type="number"]{
          -moz-appearance: textfield;
      }

    }
    
  }
</style>



