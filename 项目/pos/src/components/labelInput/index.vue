<template>
  <div class="layer">
    <div class="itemLayer">
      <div class="label" :style="{width:labelW}">{{label}}</div>
      <div class="inputLayer" :style="{width:inputW ? inputW : ''}"><el-input  :type="type ? type :'text'" :value="value" @input="handleInput" :placeholder="placeholder" size="medium"></el-input></div>
      <div v-if="unit" class="unit">{{unit}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props:['label','value','type','placeholder','unit','labelW','inputW'],
  data(){
    return{

    }
  },
  methods:{
    handleInput(value){
      this.$emit('input', value);
    }
  }
}
</script>
<style lang="scss" scoped>
.layer{
  display: inline-block;
  .itemLayer{
    display: flex;
    align-items: center;
    .label{
      font-size: 13px;
      color:$font-color6;
      text-align: right;
    }
    .inputLayer{
      margin-left: 0.5vw;
    }
    .unit{
      font-size: 13px;
      color:$font-color3;
      margin-left: 1vw;
    }
  }
}

</style>

