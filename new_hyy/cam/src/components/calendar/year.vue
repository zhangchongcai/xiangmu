<template>
  <section class="calendarWarpSection">
    <div class="calendarGlobalControls">
      <span class="controlLeft">
        <i class="el-icon-d-arrow-left" @click.prevent.stop="coutDownYears"></i>
      </span>
      <em>
        {{startYear}}年 - {{endYear}}年
      </em>
      <span class="controlRight">
        <i class="el-icon-d-arrow-right" @click.prevent.stop="addUpYears"></i>
      </span>
    </div>
    <div class="calendarlistWarp">
      <div class="monthLists">
        <template v-for="(item , index) in yearsList">
          <div :key="index">
            <a :class="{'current':item.current ,'enableChoise': item.enableChoise , 'noEnableChoise': (!item.enableChoise) , 'isActive':(selectedIndex == item.label)}" @click="choiseMonth(item , index)">{{item.label}}年</a>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    value: {
      default: new Date(),
      required: true
    }
  },
  data () {
    return {
      startYear: null,
      endYear: null,
      yearsList: [],
      selectedIndex: null
    };
  },
  created () {
    this.initData();
  },
  watch: {
    value () {
      this.initData();
    }
  },
  methods: {
    initData () {
      if (this.value instanceof Array) {
        let year = new Date().getFullYear();
        this.selectedIndex = new Date(this.value[0]).getFullYear(); ;
        this.startYear = (Math.floor(year / 10)) * 10;
      } else {
        // day --->year
        let year = new Date().getFullYear();
        this.selectedIndex = new Date(this.value).getFullYear();
        this.startYear = (Math.floor(year / 10)) * 10;
        // this.selectedIndex = -1;
      }
      this.setYearsList();
    },
    coutDownYears () {
      this.startYear -= 10;
      this.setYearsList();
    },
    addUpYears () {
      this.startYear = this.endYear + 1;
      this.setYearsList();
    },
    setYearsList (year) {
      this.yearsList = [];
      let currentYear = new Date().getFullYear();
      let selectedYear = new Date().getFullYear();
      //
      if (this.value instanceof Array) {
        selectedYear = new Date().getFullYear();
      } else {
        selectedYear = new Date().getFullYear();
      }
      //
      this.endYear = this.startYear + 9;
      for (let i = this.startYear; i <= this.endYear; i++) {
        let label = i;
        let enableChoise = (i <= currentYear);
        let current = i == currentYear;
        this.yearsList.push({
          label,
          enableChoise,
          current
        });
      }
      // console.log(this.yearsList,'year list')
    },
    choiseMonth (item, index) {
      if (!item.enableChoise) {
        return false;
      }
      let year = item.label;
      let startDate = new Date(year, 0, 1),
        endDate = new Date(year, 11, 31);
      // this.selectedIndex = index;
      this.$emit('valueChange', [
        startDate,
        endDate
      ], index);
    }
  }
};
</script>

