<template>
  <section class="audit">
    <component :is="currentComponent" @updateCurrentComponent="updateCurrentComponent" @updateCurrentData="updateCurrentData" @updateShowType="updateShowType" @updateIsView="updateIsView" :currentData="currentData" :showType="showType" :isView="isView"></component>
  </section>
</template>

<script>
import auditContent from 'ctmSrc/views/moviePlan/planApprove/AuditContent';
import auditOverview from 'ctmSrc/views/moviePlan/planApprove/AuditOverview';
export default {
  name: 'Audit',
  components: {
    auditContent,
    auditOverview
  },
  data () {
    return {
      currentComponent: 'auditOverview',
      currentData: {},
      showType: 'moviePlan',
      isView: true

    };
  },
  methods: {
    updateCurrentComponent (val) {
      this.currentComponent = val;
    },
    updateCurrentData (val) {
      this.currentData = val;
    },
    updateShowType (val) {
      this.showType = val;
    },
    updateIsView (val) {
      this.isView = val;
    }
  }

};
</script>

<style lang="scss">
.audit {
  /*height: 100%;*/
}
</style>