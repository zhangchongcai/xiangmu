webpackJsonpctm([34],{208:function(e,t,n){"use strict";function i(e){n(664),n(666)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(399),o=n(668),l=n(3),s=i,c=l(a.a,o.a,!1,s,"data-v-0bcd9bbd",null);t.default=c.exports},399:function(e,t,n){"use strict";var i=n(72);n.n(i);t.a={components:{frameSinglecinema:i.singleCinema},mixins:[i.singleCinema.cacheMixin],data:function(){return{cacheField:["cinemaName","cinemaUid","dataList","pageIndex","pageSize","total"],subComName:"ticketSample",innerData:{},excelUrl:"",dataForm:{},dataList:[],pageIndex:1,pageSize:10,total:10,uid:null,cinemaUid:"",cinemaName:"",singleCinemaVisible:!1,cinematype:"2"}},created:function(){this.getDataList()},methods:{getDataList:function(e){var t=this,n={page:this.pageIndex,pageSize:this.pageSize},i={cinemaUid:e||""};this.$ctmList.ticketList(n,i).then(function(e){e&&200===e.code?(e=e.data,t.total=e.total,console.log(e),e.list.map(function(e){e.createTime=e.createTime}),t.dataList=e.list):(t.dataList=[],t.totalPage=0)}).catch(function(e){console.log(e)})},sizeChangeHandle:function(e){this.pageSize=e,this.pageIndex=1,this.getDataList(),console.log(e)},currentChangeHandle:function(e){this.pageIndex=e,this.getDataList()},widthFormat:function(e,t){return Math.ceil(e.width/3.99)},heightFormat:function(e,t){return Math.ceil(e.height/3.99)},searchDetail:function(e){this.$router.push({path:"ticketdetail",query:{uid:e}})},ediHandle:function(e){this.$router.push({path:"ticketdesign",query:{uid:e,isEdit:!!e}})},deleteHandle:function(e){var t=this;if(1==e.isDefault)return this.$message({message:"默认票版不允许删除",type:"warning",duration:1500});this.$confirm("确定进行删除操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$ctmList.ticketsampleDel(e.uid).then(function(e){console.log(e),e&&200===e.code?t.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){t.getDataList()}}):t.$message.error(e.msg)}).catch(function(e){console.log(e)})}).catch(function(){})},selExcelFile:function(e,t){var n=this,i=e.target.files,a=i[0],o=a.name;console.log(i);var l=o.substring(o.lastIndexOf(".")+1).toLowerCase();if(void 0===a||a.size<=0)return this.$message({type:"error",message:"请选择文件"}),void(this.$refs.importExecl.value="");if("ots"!=l)return this.$message({type:"error",message:"请选择ots的文件"}),void(this.$refs.importExecl.value="");var s=new FileReader;s.readAsDataURL(a),s.onloadend=function(e){console.log(e.target);var t={dataInfo:e.target.result,name:o.slice(0,o.lastIndexOf(".")),uid:n.uid};n.$ctmList.importTicketFile(t).then(function(e){console.log(e),n.$refs.importExecl.value="",e&&200===e.code?n.$message({message:"导入成功",type:"success",duration:1500,onClose:function(){n.getDataList()}}):n.$message.error(e.msg)}).catch(function(e){console.log(e)})}},importHandle:function(e){this.uid=e,console.log(e),this.$refs.importExecl.click()},exportHandle:function(e){console.log(e),this.$ctmList.exportTicketFile(e).then(function(e){if(e&&200===e.code){e=e.data,console.log(e);var t="data:application/vnd.ms-excel;base64,"+e.dataInfo,n=e.name+".ots";if("download"in document.createElement("a")){var i=document.createElement("a");i.download=n,i.style.display="none",i.href=t,document.body.appendChild(i),i.click(),URL.revokeObjectURL(i.href),document.body.removeChild(i)}else{console.log("ie");var a=document.createElement("iframe");a.src=t,a.style.display="none",document.body.appendChild(a)}}})},searchCinema:function(){this.getDataList(this.cinemaUid)},confirmCinemaSingleDialog:function(e){console.log("回调",e)},cinemaDialogShow:function(){this.singleCinemaVisible=!0},cinemaCallback:function(e){console.log("这里返回数据",e),this.innerData.id=this.cinemaUid=e.data.id,this.cinemaName=e.data.name,e.isCloseWindow&&(this.singleCinemaVisible=!1)},clearInputValue:function(){this.cinemaUid="",this.cinemaName="",this.innerData.id=""}}}},664:function(e,t,n){var i=n(665);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);n(157)("88726a0c",i,!0,{})},665:function(e,t,n){t=e.exports=n(156)(!0),t.push([e.i,"\n.hidden {\n  display: none;\n}\n.ticketSample {\n  padding: 0 14px;\n}\n.ticketSample .demo-ruleForm {\n    background: #f5f5f5;\n    width: 100%;\n    padding: 18px 24px;\n}\n.ticketSample .demo-ruleForm .item-warp {\n      display: inline-block;\n}\n.ticketSample .demo-ruleForm .item-warp .title {\n        display: inline-block;\n        width: 70px;\n        color: #666666;\n        font-size: 12px;\n}\n.ticketSample .demo-ruleForm .item-warp .el-input__inner {\n        background: #f5f5f5;\n}\n.ticketSample .demo-ruleForm .search-Btn {\n      margin-left: 24px;\n}\n.ticketSample .demo-ruleForm .el-button {\n      width: 80px;\n      height: 32px;\n      font-size: 12px;\n}\n.ticketSample .demo-ruleForm .el-button span {\n        font-size: 12px;\n}\n.ticketSample .el-button {\n    font-size: 12px;\n}\n.ticketSample .el-pagination {\n    padding-top: 15px;\n}\n.ticketSample .el-table .el-button {\n    margin-left: 0;\n    font-size: 12px;\n}\n.ticketSample .el-pagination {\n    height: 24px;\n    line-height: 24px;\n    padding: 0px 5px;\n}\n.ticketSample .el-pagination ul {\n      height: 24px;\n}\n.ticketSample .el-pagination ul li {\n        height: 24px;\n}\n.ticketSample .el-pagination button {\n      height: 24px;\n}\n","",{version:3,sources:["G:/Workspaces/work/chenxin/module-hyy/ctm/src/views/ticketSample/ticketSample.vue"],names:[],mappings:";AACA;EACE,cAAc;CACf;AACD;EACE,gBAAgB;CACjB;AACD;IACI,oBAAoB;IACpB,YAAY;IACZ,mBAAmB;CACtB;AACD;MACM,sBAAsB;CAC3B;AACD;QACQ,sBAAsB;QACtB,YAAY;QACZ,eAAe;QACf,gBAAgB;CACvB;AACD;QACQ,oBAAoB;CAC3B;AACD;MACM,kBAAkB;CACvB;AACD;MACM,YAAY;MACZ,aAAa;MACb,gBAAgB;CACrB;AACD;QACQ,gBAAgB;CACvB;AACD;IACI,gBAAgB;CACnB;AACD;IACI,kBAAkB;CACrB;AACD;IACI,eAAe;IACf,gBAAgB;CACnB;AACD;IACI,aAAa;IACb,kBAAkB;IAClB,iBAAiB;CACpB;AACD;MACM,aAAa;CAClB;AACD;QACQ,aAAa;CACpB;AACD;MACM,aAAa;CAClB",file:"ticketSample.vue",sourcesContent:["\n.hidden {\n  display: none;\n}\n.ticketSample {\n  padding: 0 14px;\n}\n.ticketSample .demo-ruleForm {\n    background: #f5f5f5;\n    width: 100%;\n    padding: 18px 24px;\n}\n.ticketSample .demo-ruleForm .item-warp {\n      display: inline-block;\n}\n.ticketSample .demo-ruleForm .item-warp .title {\n        display: inline-block;\n        width: 70px;\n        color: #666666;\n        font-size: 12px;\n}\n.ticketSample .demo-ruleForm .item-warp .el-input__inner {\n        background: #f5f5f5;\n}\n.ticketSample .demo-ruleForm .search-Btn {\n      margin-left: 24px;\n}\n.ticketSample .demo-ruleForm .el-button {\n      width: 80px;\n      height: 32px;\n      font-size: 12px;\n}\n.ticketSample .demo-ruleForm .el-button span {\n        font-size: 12px;\n}\n.ticketSample .el-button {\n    font-size: 12px;\n}\n.ticketSample .el-pagination {\n    padding-top: 15px;\n}\n.ticketSample .el-table .el-button {\n    margin-left: 0;\n    font-size: 12px;\n}\n.ticketSample .el-pagination {\n    height: 24px;\n    line-height: 24px;\n    padding: 0px 5px;\n}\n.ticketSample .el-pagination ul {\n      height: 24px;\n}\n.ticketSample .el-pagination ul li {\n        height: 24px;\n}\n.ticketSample .el-pagination button {\n      height: 24px;\n}\n"],sourceRoot:""}])},666:function(e,t,n){var i=n(667);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);n(157)("0eedbf54",i,!0,{})},667:function(e,t,n){t=e.exports=n(156)(!0),t.push([e.i,"\n[data-v-0bcd9bbd] .popup-input {\n  width: 200px;\n}\n[data-v-0bcd9bbd] .popup-input input {\n    text-overflow: ellipsis;\n    background: #f5f5f5;\n    border: 1px solid #bcbcbc !important;\n}\n.popup-input:hover .popup-close[data-v-0bcd9bbd] {\n  display: inline-block;\n}\n[data-v-0bcd9bbd] .popup-close {\n  cursor: pointer;\n  color: #3b74ff;\n  font-size: 16px;\n  font-weight: 500;\n  font-weight: 700;\n  margin-top: 9px;\n  display: none;\n}\n.btn-80-32[data-v-0bcd9bbd] {\n  width: 80px;\n  height: 32px;\n}\n","",{version:3,sources:["G:/Workspaces/work/chenxin/module-hyy/ctm/src/views/ticketSample/ticketSample.vue"],names:[],mappings:";AACA;EACE,aAAa;CACd;AACD;IACI,wBAAwB;IACxB,oBAAoB;IACpB,qCAAqC;CACxC;AACD;EACE,sBAAsB;CACvB;AACD;EACE,gBAAgB;EAChB,eAAe;EACf,gBAAgB;EAChB,iBAAiB;EACjB,iBAAiB;EACjB,gBAAgB;EAChB,cAAc;CACf;AACD;EACE,YAAY;EACZ,aAAa;CACd",file:"ticketSample.vue",sourcesContent:["\n[data-v-0bcd9bbd] .popup-input {\n  width: 200px;\n}\n[data-v-0bcd9bbd] .popup-input input {\n    text-overflow: ellipsis;\n    background: #f5f5f5;\n    border: 1px solid #bcbcbc !important;\n}\n.popup-input:hover .popup-close[data-v-0bcd9bbd] {\n  display: inline-block;\n}\n[data-v-0bcd9bbd] .popup-close {\n  cursor: pointer;\n  color: #3b74ff;\n  font-size: 16px;\n  font-weight: 500;\n  font-weight: 700;\n  margin-top: 9px;\n  display: none;\n}\n.btn-80-32[data-v-0bcd9bbd] {\n  width: 80px;\n  height: 32px;\n}\n"],sourceRoot:""}])},668:function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"ticketSample"},[n("div",{staticClass:"demo-ruleForm"},[n("div",{staticClass:"item-warp"},[n("span",{staticClass:"title"},[e._v("影院名称:")]),e._v(" "),n("el-input",{staticClass:"popup-input",attrs:{readonly:!0},on:{focus:e.cinemaDialogShow},model:{value:e.cinemaName,callback:function(t){e.cinemaName=t},expression:"cinemaName"}},[e.cinemaName?n("i",{staticClass:"el-icon-close popup-close",attrs:{slot:"suffix"},on:{click:function(t){return e.clearInputValue()}},slot:"suffix"}):e._e()])],1),e._v(" "),n("div",{staticStyle:{display:"inline-block","margin-left":"12px"}},[n("el-button",{attrs:{type:"primary"},on:{click:e.searchCinema}},[e._v("查询")])],1)]),e._v(" "),n("div",{staticStyle:{"text-align":"right",padding:"12px 0"}},[n("el-button",{staticClass:"btn-80-32",attrs:{type:"primary",plain:""},on:{click:function(t){return e.ediHandle(!1)}}},[e._v("新建")])],1),e._v(" "),n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.dataList,stripe:""}},[n("el-table-column",{attrs:{type:"index",label:"序号","header-align":"center",align:"center",width:"50"}}),e._v(" "),n("el-table-column",{attrs:{prop:"cinemaName",label:"适用影院","header-align":"center",align:"center",width:""},scopedSlots:e._u([{key:"default",fn:function(t){return[1==t.row.isDefault?n("span",[e._v("全部影院")]):e._e(),e._v(" "),t.row.cinemaNames?n("span",[e._v(e._s(t.row.cinemaNames.join(",")))]):e._e()]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"name",label:"票版名称"}}),e._v(" "),n("el-table-column",{attrs:{prop:"width",label:"票版宽度",formatter:e.widthFormat,width:"80"}}),e._v(" "),n("el-table-column",{attrs:{prop:"height",label:"票版高度",formatter:e.heightFormat,width:"80"}}),e._v(" "),n("el-table-column",{attrs:{prop:"ticketsampleChannelNames",label:"适用渠道"},scopedSlots:e._u([{key:"default",fn:function(t){return[1==t.row.isDefault?n("div",[e._v("\n          全部渠道\n        ")]):t.row.ticketsampleChannelNames?n("div",[e._v("\n          "+e._s(t.row.ticketsampleChannelNames[0])+"\n        ")]):e._e()]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"isDefault",label:"默认票版",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("div",[e._v("\n          "+e._s(1==t.row.isDefault?"是":"否")+"\n        ")])]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"createTime",label:"制作时间"}}),e._v(" "),n("el-table-column",{attrs:{prop:"createUser",label:"制作人"},scopedSlots:e._u([{key:"default",fn:function(t){return[1==t.row.isDefault?n("div",[e._v("\n          系统管理员\n        ")]):n("div",[e._v("\n          "+e._s(t.row.createUser)+"\n        ")])]}}])}),e._v(" "),n("el-table-column",{attrs:{fixed:"right",width:"230",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(n){return e.searchDetail(t.row.uid)}}},[e._v("查看")]),e._v(" "),n("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(n){return e.ediHandle(t.row.uid)}}},[e._v("编辑")]),e._v(" "),0==t.row.isDefault?n("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(n){return e.deleteHandle(t.row)}}},[e._v("删除")]):e._e(),e._v(" "),n("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(n){return e.importHandle(t.row.uid)}}},[e._v("导入")]),e._v(" "),n("input",{ref:"importExecl",staticClass:"hidden",attrs:{type:"file"},on:{change:function(t){return e.selExcelFile(t)}}}),e._v(" "),n("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(n){return e.exportHandle(t.row.uid)}}},[e._v("导出")])]}}])})],1),e._v(" "),n("div",{staticClass:"page-wrap"},[e.total<10&&e.dataList.length?n("span",{staticStyle:{color:"#666","font-size":"14px"}},[e._v("共"+e._s(e.dataList.length)+"条")]):e._e(),e._v(" "),e.total>10?n("el-pagination",{staticStyle:{"text-align":"center"},attrs:{background:"","current-page":e.pageIndex,"page-sizes":[10,15,20,25,30],"page-size":e.pageSize,total:e.total,small:!1,layout:"total, sizes, prev, pager, next, jumper"},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}}):e._e()],1),e._v(" "),n("frameSinglecinema",{ref:"frameSingleCinema",attrs:{type:2,framedialogVisible:e.singleCinemaVisible,innerData:e.innerData},on:{callBackSingle:e.cinemaCallback}},[n("div",{attrs:{slot:"footerId"},slot:"footerId"},[n("el-button",{attrs:{type:"primary"},on:{click:function(t){e.$refs.frameSingleCinema.confirmData(),e.singleCinemaVisible=!1}}},[e._v("确定")]),e._v(" "),n("el-button",{on:{click:function(t){e.singleCinemaVisible=!1}}},[e._v("取消")])],1)])],1)},a=[],o={render:i,staticRenderFns:a};t.a=o}});