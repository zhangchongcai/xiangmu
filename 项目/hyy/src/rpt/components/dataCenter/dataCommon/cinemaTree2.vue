<template>
  <div>
    <treeselect 
      v-model="value" 
      :multiple="true" 
      :options="options" 
      :sort-value-by="sortValueBy"
    />
  </div>
</template>

<script>
  // import the component
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'


var generateOptions =[
{
  id: '1',
  label: '1',
  children: [
    {
      id: '11',
      label: '11',
      children:[
        {
          id:'111',
          label:'111'
        },{
          id:'112',
          label:'112'
        },{
          id:'113',
          label:'113'
        },
      ]
    },{
      id: '22',
      label: '22',
      children:[
        {
          id:'221',
          label:'221'
        },{
          id:'222',
          label:'222'
        },{
          id:'223',
          label:'223'
        },
      ]
    },{
      id: '33',
      label: '33',
      children:[
        {
          id:'331',
          label:'331'
        },{
          id:'332',
          label:'332'
        },{
          id:'333',
          label:'333'
        },
      ]
    },
  ],
}]
  export default {
    // register the component
    components: { Treeselect },
    data() {
      return {
        value: [],
        options:generateOptions,
        sortValueBy: 'ORDER_SELECTED'
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
