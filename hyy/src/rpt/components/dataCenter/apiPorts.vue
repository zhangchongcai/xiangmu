<template>
  <el-row>
    <el-button type="primary" @click="pagesExport">导出</el-button>
    <el-button type="primary" @click="treeExport">电影名称树接口</el-button>
    <el-button type="primary" @click="mobanExport">保存模板接口</el-button>
    <!-- <el-button type="primary" @click="pagesExport">主要按钮</el-button> -->
  </el-row>
</template>

<script>
        function openPostWindow(url,data1){

            var tempForm = document.createElement("form");
            tempForm.id = "tempForm1";
            tempForm.method = "post";
            tempForm.action = url;
            tempForm.target="_blank"; //打开新页面
            var hideInput1 = document.createElement("input");
            hideInput1.type = "hidden";
            hideInput1.name="cinemaName"; //后台要接受这个参数来取值
            hideInput1.value = data1; //后台实际取到的值
            
            /*var hideInput2 = document.createElement("input");
            hideInput2.type = "hidden";
            hideInput2.name="xtmc";
            hideInput2.value = data2;*/  //这里就是如果需要第二个参数的时候可以自己再设置

            tempForm.appendChild(hideInput1);
            //tempForm.appendChild(hideInput2);
            if(document.all){
                tempForm.attachEvent("onsubmit",function(){});        //IE
            }else{
                var subObj = tempForm.addEventListener("submit",function(){},false);    //firefox
            }
            document.body.appendChild(tempForm);
            if(document.all){
                tempForm.fireEvent("onsubmit");
            }else{
                tempForm.dispatchEvent(new Event("submit"));
            }
            tempForm.submit();
            document.body.removeChild(tempForm);
        }
  export default {
    props:{

    },
    data () {
      return {
         colArr:Array

      }
  },
    methods: {
        pagesExport:function(){
            openPostWindow("http://192.168.100.126:8088/export/exportExcel","大神影院")
        }, 
        mobanExport:function(){
              axios.post('/report/saveUserStyle', {
                   "uid":"",
                    "tenantId": "test-2",
                    "userUid": "test-2",
                    "reportCode": "R01",
                    "styleName": "测试样式",
                    "isDef": 0,
                    "styleColArr": [{
                      "prop": "CINEMA_NAME",
                      "seq": 2
                    }, {
                      "prop": "PAY_TYPE_NAME",
                      "seq": 1
                    }],
                    "styleExtQueryArr": [{
                      "queryControlKey": "TRANSACTION_DATE",
                      "seq": 2
                    }],
                    "styleGroupArr": [{
                      "groupColKey": "CINEMA_NAME",
                      "seq": 1
                    }]                  
               }).then(function(response){
                  const tableData = JSON.parse(response.data);
                   datacenterBus.$emit('tableDataArrEvent',tableData)
                   console.log(tableData);
               }).catch(function (error) {
                console.log(error);
            })
        },
        treeExport:function(){
              axios.get("/report/condition/getCinemaByParam")

        .then(this.getDatacenterSucc)
    },
    getDatacenterSucc(res){
      console.log(res)
      // const data = res.data.reportTableInfo

    }
    }
 
  }
</script>
<style Scoped>

</style>