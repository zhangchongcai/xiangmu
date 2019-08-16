<template>
  <div class="cinema-center">
    <div class="cinema-center-item" v-for="(item, index) of cinameCenterData" :key="index">
      <a :href="item.oldCinemaUrl" target="_blank">{{item.cinemaName}}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cinameCenterData: Array
  }
};
</script>

<style lang="scss" scoped>
.cinema-center {
  display: flex;
  justify-content: flex-start;
  .cinema-center-item {
    margin: 10px;
    padding: 5px 10px;
    max-width: 300px;
    height: 30px;
    line-height: 20px;
    text-align: center;
    border: 1px solid #bcbcbc;
    border-radius: 4px;
    box-sizing: border-box;
    a {
      text-decoration: none;
      font-size: 12px;
      color: #666666;
    }
    &:hover {
      a {
        color: #3b74ff;
      }
      border: 1px solid #3b74ff;
      cursor: pointer;
    }
  }
}
</style>


