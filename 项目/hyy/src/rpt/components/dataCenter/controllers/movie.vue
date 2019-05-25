<template>
  <div>
    <el-input v-model="filmValue" v-on:click.native="openMultiMovieDialog"></el-input>
    <multi-movie
      :title="title"
      :dialogTableVisible.sync="dialogTableVisible"
      :gridData="gridData"
      :pageData="pageData"
      @changeDialogTableVisible="changeDialogTableVisible"
      @changeCurrentPage="changeCurrentPage"
      @searchUser="searchUser"
      @chooseUser="chooseUser"
    ></multi-movie>
  </div>
</template>


<script>
import MultiMovie from "./components/movieView";
export default {
  components: {
    MultiMovie
  },
  data() {
    return {
      title: "",
      workName: "",
      page: 1,
      pageSize: 10,
      pageData: {},
      dialogTableVisible: false,
      gridData: [],
      filmValue: ""
    };
  },
  methods: {
    openMultiMovieDialog() {
      this.dialogTableVisible = true;
      this.title = "影片选择";
      this.getData(1, 10, "", "");
    },
    getData(pageNum, pageSize, filmName, filmCode) {
      this.$rptList
        .getFilmData(pageNum, pageSize, filmName, filmCode)
        .then(res => {
          console.log(res, 1);
          this.gridData = JSON.parse(JSON.stringify(res.rows));
          this.pageData = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeDialogTableVisible(val) {
      this.dialogTableVisible = val;
    },
    changeCurrentPage(val) {
      this.getData(val);
    },
    searchUser(data) {
      this.getData(0, 10, data.filmName, data.filmId);
    },
    chooseUser(arr) {
      let filmNameArr = [];
      arr.forEach(element => {
        filmNameArr.push(element.filmName);
      });
      console.log(filmNameArr)
      this.filmValue = filmNameArr.join(",");
      this.$emit("selectFilmData", this.filmValue);
    }
  }
};
</script>

<style lang="sass" scoped>

</style>
