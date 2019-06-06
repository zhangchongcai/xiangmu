<template>
    <div :class="['hall-order-container', currentHallId == filmInfo.hall_id ? 'active' : '']" @click="changeHallId(filmInfo.hall_id)">
      {{filmInfo.hall_name}}
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {SET_HALL_ID, SET_HALL_CONTENTS} from 'types'
export default {
    props: {
        filmInfo: {
            type: Object
        }
    },
    data() {
        return {
   
        }
    },
    computed: {
        ...mapGetters([
            'currentHallId'
        ])
    },

    methods: {
        ...mapMutations([
            SET_HALL_ID,
            SET_HALL_CONTENTS
        ]),

        changeHallId(id) {
            this.SET_HALL_ID(id)
            this.SET_HALL_CONTENTS()
        }
    }
}
</script>

<style lang="scss" scoped>
  .hall-order-container {
      display: flex;
      width: 9.5vw;
      height: 100%;
      border-bottom: 1px solid $bg-searchPaydetalTabColor;
      border-right: 1px solid $bg-searchPaydetalTabColor;
      box-sizing: border-box;
      background: rgba(51, 51, 51, 0.2);
      justify-content: center;
      align-items: center;
      font-size: $font-size16;
      font-weight: bold;
      user-select: none;
      cursor: pointer;

      &.active {
          background: #ffffff;
          color: $font-color-blue;
      }

      &:hover {
          background: #ffffff;
          color: $font-color-blue;
      }
  }
</style>


