webpackJsonpcsm([28],{200:function(e,t,a){"use strict";t.a={name:"Headquarters",data:function(){return{detailForm:{},detailDialogVisible:!1,cinemaUid:"",outerVisible:!1,innerVisible:!1,multipleSelection:[],gridData:[],searchForm:{type:"",name:"",code:""},formLabelWidth:"60px",dialogVisible:!1,tableData:[],dialogChannelNatureOptions:[{keyCode:2,keyName:"第三方渠道"},{keyCode:1,keyName:"自营渠道"}],channelNatureOptions:[{keyCode:2,keyName:"第三方渠道"},{keyCode:1,keyName:"自营渠道"}],statusOptions:[{keyCode:0,keyName:"启用"},{keyCode:1,keyName:"停用"}],total:0,formData:{channelNature:"",name:"",status:"",pageSize:20,page:1},authorizedCinemaData:{channelUid:"",cinemaUids:[],useRange:1},selectedCinema:"",treeData:[],defaultProps:{children:"children",label:"name"},filterText:""}},methods:{updateCurrentStatus:function(){var e=this;this.updateStatus(0===this.detailForm.status?1:0,this.detailForm.uid,function(t){e.detailDialogVisible=!1})},setCurrentChannelCinema:function(){this.detailDialogVisible=!1,this.setAuthorizedCinema(this.detailForm.uid)},selectable:function(e){return 0===e.isAdded},addChannel:function(){this.dialogVisible=!0,this.getChannelOtherList()},clearSelectedCinema:function(){this.authorizedCinemaData.cinemaUids=[],this.$refs.cinemaTree.setCheckedKeys([])},useRangeChange:function(e){1===e&&(this.authorizedCinemaData.cinemaUids=[],this.selectedCinema="",this.$refs.cinemaTree&&this.$refs.cinemaTree.setCheckedKeys([]))},confirmSelectCinema:function(){var e=this.$refs.cinemaTree.getCheckedNodes(),t=[],a=[];e.forEach(function(e){e.cinema&&(t.push(e.name),a.push(e.uid))}),console.log(t,a),this.selectedCinema=t.join("，"),this.authorizedCinemaData.cinemaUids=a,this.innerVisible=!1},searchCinema:function(){this.$refs.cinemaTree.filter(this.filterText)},filterNode:function(e,t){return!e||-1!==t.name.indexOf(e)},setAuthorizedCinema:function(e){this.authorizedCinemaData.channelUid=e,this.outerVisible=!0},addHeaderChannel:function(){var e=this,t=this.multipleSelection.map(function(e){return{channelNature:e.type,name:e.name,company:e.company,code:e.code,uid:e.uid,buttUser:e.buttUser,buttPass:e.buttPass}});console.log(t),this.$csmList.addHeaderChannel(t).then(function(t){console.log(t),200===t.code?(e.$refs.multipleTable.clearSelection(),e.dialogVisible=!1,e.success(t.msg),e.search()):e.error(t.msg)})},emptyData:function(){var e=this;this.multipleSelection.forEach(function(t){e.$refs.multipleTable.toggleRowSelection(t)}),this.multipleSelection=[]},deleteCurrent:function(e){console.log(e);var t=this.multipleSelection.find(function(t){return t.code===e});this.$refs.multipleTable.toggleRowSelection(t)},handleSelectionChange:function(e){this.multipleSelection=e.filter(function(e){return 0===e.isAdded})},showChannelDetail:function(e){this.detailForm=e,this.detailDialogVisible=!0},setChannelCinema:function(){var e=this;this.$csmList.setChannelCinema(this.authorizedCinemaData).then(function(t){console.log(t),200===t.code?(e.outerVisible=!1,e.success("设置成功！"),e.search(),e.useRangeChange(1)):e.error(t.msg)})},getCinemaTree:function(){var e=this;this.$csmList.getCtmCinemaTree().then(function(t){console.log(t),200===t.code?e.treeData=[t.data]:e.error(t.msg)})},getChannelOtherList:function(){var e=this;this.$csmList.getChannelOtherList(this.searchForm).then(function(t){console.log(t),200===t.code?(e.gridData=t.data,e.$nextTick(function(t){e.gridData.forEach(function(t){1===t.isAdded&&e.$refs.multipleTable.toggleRowSelection(t)})})):e.error(t.msg)})},findPayTypeByCode:function(e){var t=this;this.$csmList.findPayTypeByCode({code:e}).then(function(e){console.log(e),200===e.code?(t.addForm.payTypeCode=e.data.payTypeCode,t.addForm.payTypeName=e.data.payTypeName,t.addForm.status=e.data.status,t.dialogVisible=!0):t.error(e.msg)})},updateStatus:function(e,t,a){var n=this;this.$csmList.setChannelStatus({channelUid:t,status:e}).then(function(e){console.log(e),200===e.code?(n.success(e.msg),n.search(),a&&a()):n.error(e.msg)})},search:function(){var e=this;this.$csmList.getChannelList(this.formData).then(function(t){console.log(t),200===t.code?(e.tableData=t.data.list,e.total=t.data.total):e.error(t.msg)})},getUserInfo:function(){var e=this;this.$csmList.getCtmUserInfo().then(function(t){console.log(t),200===t.code?e.cinemaUid=t.data.cinemaUid:e.error(t.msg)})},handleSizeChange:function(e){console.log("每页 "+e+" 条"),this.formData.pageSize=e,this.search()},handleCurrentChange:function(e){console.log("当前页: "+e),this.formData.page=e,this.search()}},mounted:function(){this.getUserInfo(),this.search(),this.getCinemaTree()}}},320:function(e,t,a){var n=a(321);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);a(52)("21b45284",n,!0,{})},321:function(e,t,a){t=e.exports=a(51)(!0),t.push([e.i,"\n.el-tooltip__popper {\n  max-width: 666px;\n}\n.headquarters .normal-btn {\n  min-width: 80px;\n  height: 32px;\n  border: 1px solid #3b74ff;\n  border-radius: 4px;\n  padding: 8px 16px;\n  background: #fff;\n}\n.headquarters .normal-btn span {\n    font-size: 12px;\n    color: #3b74ff;\n}\n.headquarters .el-dialog__header {\n  padding: 16px 0 8px;\n  margin: 0 20px;\n  border-bottom: 1px solid #e5e5e5;\n}\n.headquarters .el-dialog__header .el-dialog__title {\n    color: #333;\n    font-weight: normal;\n}\n.headquarters .el-dialog__body {\n  padding: 12px 20px;\n}\n.headquarters .el-dialog__body .box-card {\n    width: 30%;\n}\n.headquarters .el-dialog__body .box-card .el-card__header {\n      padding: 8px 20px;\n}\n.headquarters .el-dialog__body .box-card .el-card__body {\n      max-height: 340px;\n      overflow-y: auto;\n}\n.headquarters .el-dialog__body .box-card .text {\n      font-size: 12px;\n}\n.headquarters .el-dialog__body .box-card .item {\n      margin-bottom: 8px;\n}\n.headquarters .el-dialog__body .detail-title {\n    font-weight: bold;\n}\n.headquarters .el-dialog__body .el-form-item {\n    margin-bottom: 12px;\n}\n.headquarters .el-dialog__body .el-form-item .el-form-item__label,\n    .headquarters .el-dialog__body .el-form-item .el-range-input {\n      color: #666;\n      font-size: 12px;\n}\n.headquarters .el-dialog__body .el-form-item .el-icon-date,\n    .headquarters .el-dialog__body .el-form-item .el-range__close-icon {\n      display: none;\n}\n.headquarters .el-dialog__body .el-form-item .el-checkbox-group .el-checkbox {\n      width: 33%;\n      margin-right: 0;\n}\n.headquarters .el-dialog__footer {\n  padding: 0 20px 12px;\n}\n.headquarters .el-dialog__footer .el-button {\n    padding: 8px 16px;\n    min-width: 80px;\n    height: 32px;\n}\n.headquarters .el-dialog__footer .el-button + .el-button {\n    margin-left: 30px;\n}\n.headquarters .search-form {\n  background: #f5f5f5;\n  padding: 24px 24px 6px 24px;\n}\n.headquarters .search-form .el-form-item {\n    margin-right: 32px;\n}\n.headquarters .search-form .el-form-item .el-form-item__label,\n    .headquarters .search-form .el-form-item .el-input {\n      font-size: 12px;\n      color: #666;\n}\n.headquarters .search-form .el-form-item .el-button + .el-button {\n      margin-left: 8px;\n}\n.headquarters .search-form .el-icon-arrow-left,\n  .headquarters .search-form .el-icon-arrow-right {\n    cursor: pointer;\n}\n.headquarters .search-form .el-icon-date,\n  .headquarters .search-form .el-range__close-icon {\n    display: none;\n}\n.headquarters .search-form .month {\n    width: 140px;\n}\n.headquarters .search-form .month .el-input__inner {\n      text-align: center;\n}\n.headquarters .search-form .month .el-input__prefix {\n      display: none;\n}\n.headquarters .el-table .el-button {\n  padding: 0;\n}\n.headquarters .el-table .el-button span {\n    font-size: 12px;\n}\n.headquarters .el-table .el-button + .el-button {\n  margin-left: 0;\n}\n.headquarters .el-row-btns {\n  padding: 8px 0;\n}\n","",{version:3,sources:["G:/Workspaces/work/chenxin/module-hyy/csm/src/views/channelManage/Headquarters.vue"],names:[],mappings:";AACA;EACE,iBAAiB;CAClB;AACD;EACE,gBAAgB;EAChB,aAAa;EACb,0BAA0B;EAC1B,mBAAmB;EACnB,kBAAkB;EAClB,iBAAiB;CAClB;AACD;IACI,gBAAgB;IAChB,eAAe;CAClB;AACD;EACE,oBAAoB;EACpB,eAAe;EACf,iCAAiC;CAClC;AACD;IACI,YAAY;IACZ,oBAAoB;CACvB;AACD;EACE,mBAAmB;CACpB;AACD;IACI,WAAW;CACd;AACD;MACM,kBAAkB;CACvB;AACD;MACM,kBAAkB;MAClB,iBAAiB;CACtB;AACD;MACM,gBAAgB;CACrB;AACD;MACM,mBAAmB;CACxB;AACD;IACI,kBAAkB;CACrB;AACD;IACI,oBAAoB;CACvB;AACD;;MAEM,YAAY;MACZ,gBAAgB;CACrB;AACD;;MAEM,cAAc;CACnB;AACD;MACM,WAAW;MACX,gBAAgB;CACrB;AACD;EACE,qBAAqB;CACtB;AACD;IACI,kBAAkB;IAClB,gBAAgB;IAChB,aAAa;CAChB;AACD;IACI,kBAAkB;CACrB;AACD;EACE,oBAAoB;EACpB,4BAA4B;CAC7B;AACD;IACI,mBAAmB;CACtB;AACD;;MAEM,gBAAgB;MAChB,YAAY;CACjB;AACD;MACM,iBAAiB;CACtB;AACD;;IAEI,gBAAgB;CACnB;AACD;;IAEI,cAAc;CACjB;AACD;IACI,aAAa;CAChB;AACD;MACM,mBAAmB;CACxB;AACD;MACM,cAAc;CACnB;AACD;EACE,WAAW;CACZ;AACD;IACI,gBAAgB;CACnB;AACD;EACE,eAAe;CAChB;AACD;EACE,eAAe;CAChB",file:"Headquarters.vue",sourcesContent:["\n.el-tooltip__popper {\n  max-width: 666px;\n}\n.headquarters .normal-btn {\n  min-width: 80px;\n  height: 32px;\n  border: 1px solid #3b74ff;\n  border-radius: 4px;\n  padding: 8px 16px;\n  background: #fff;\n}\n.headquarters .normal-btn span {\n    font-size: 12px;\n    color: #3b74ff;\n}\n.headquarters .el-dialog__header {\n  padding: 16px 0 8px;\n  margin: 0 20px;\n  border-bottom: 1px solid #e5e5e5;\n}\n.headquarters .el-dialog__header .el-dialog__title {\n    color: #333;\n    font-weight: normal;\n}\n.headquarters .el-dialog__body {\n  padding: 12px 20px;\n}\n.headquarters .el-dialog__body .box-card {\n    width: 30%;\n}\n.headquarters .el-dialog__body .box-card .el-card__header {\n      padding: 8px 20px;\n}\n.headquarters .el-dialog__body .box-card .el-card__body {\n      max-height: 340px;\n      overflow-y: auto;\n}\n.headquarters .el-dialog__body .box-card .text {\n      font-size: 12px;\n}\n.headquarters .el-dialog__body .box-card .item {\n      margin-bottom: 8px;\n}\n.headquarters .el-dialog__body .detail-title {\n    font-weight: bold;\n}\n.headquarters .el-dialog__body .el-form-item {\n    margin-bottom: 12px;\n}\n.headquarters .el-dialog__body .el-form-item .el-form-item__label,\n    .headquarters .el-dialog__body .el-form-item .el-range-input {\n      color: #666;\n      font-size: 12px;\n}\n.headquarters .el-dialog__body .el-form-item .el-icon-date,\n    .headquarters .el-dialog__body .el-form-item .el-range__close-icon {\n      display: none;\n}\n.headquarters .el-dialog__body .el-form-item .el-checkbox-group .el-checkbox {\n      width: 33%;\n      margin-right: 0;\n}\n.headquarters .el-dialog__footer {\n  padding: 0 20px 12px;\n}\n.headquarters .el-dialog__footer .el-button {\n    padding: 8px 16px;\n    min-width: 80px;\n    height: 32px;\n}\n.headquarters .el-dialog__footer .el-button + .el-button {\n    margin-left: 30px;\n}\n.headquarters .search-form {\n  background: #f5f5f5;\n  padding: 24px 24px 6px 24px;\n}\n.headquarters .search-form .el-form-item {\n    margin-right: 32px;\n}\n.headquarters .search-form .el-form-item .el-form-item__label,\n    .headquarters .search-form .el-form-item .el-input {\n      font-size: 12px;\n      color: #666;\n}\n.headquarters .search-form .el-form-item .el-button + .el-button {\n      margin-left: 8px;\n}\n.headquarters .search-form .el-icon-arrow-left,\n  .headquarters .search-form .el-icon-arrow-right {\n    cursor: pointer;\n}\n.headquarters .search-form .el-icon-date,\n  .headquarters .search-form .el-range__close-icon {\n    display: none;\n}\n.headquarters .search-form .month {\n    width: 140px;\n}\n.headquarters .search-form .month .el-input__inner {\n      text-align: center;\n}\n.headquarters .search-form .month .el-input__prefix {\n      display: none;\n}\n.headquarters .el-table .el-button {\n  padding: 0;\n}\n.headquarters .el-table .el-button span {\n    font-size: 12px;\n}\n.headquarters .el-table .el-button + .el-button {\n  margin-left: 0;\n}\n.headquarters .el-row-btns {\n  padding: 8px 0;\n}\n"],sourceRoot:""}])},322:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",{staticClass:"headquarters"},[a("el-dialog",{attrs:{title:"院线渠道详情",visible:e.detailDialogVisible},on:{"update:visible":function(t){e.detailDialogVisible=t}}},[a("el-form",{attrs:{model:e.detailForm,"label-width":"120px"}},[a("el-form-item",{staticClass:"detail-title",attrs:{label:"基础信息","label-width":"80px"}}),e._v(" "),a("el-form-item",{attrs:{label:"渠道编码："}},[a("span",[e._v(e._s(e.detailForm.code))])]),e._v(" "),a("el-form-item",{attrs:{label:"渠道名称："}},[a("span",[e._v(e._s(e.detailForm.name))])]),e._v(" "),a("el-form-item",{attrs:{label:"渠道类型："}},[1===e.detailForm.channelNature||0===e.detailForm.channelNature?a("span",[e._v("自营渠道")]):2===e.detailForm.channelNature?a("span",[e._v("第三方渠道")]):e._e()]),e._v(" "),a("el-form-item",{staticClass:"detail-title",attrs:{label:"授权影院","label-width":"80px"}}),e._v(" "),a("el-form-item",{attrs:{label:"授权影院："}},[e.detailForm.cinemaNames&&e.detailForm.cinemaNames.length>0?a("span",[e._v(e._s(e.detailForm.cinemaNames.join("，")))]):e._e()])],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.setCurrentChannelCinema}},[e._v("设置授权影院")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.updateCurrentStatus}},[e._v(e._s(e.detailForm.status?"启用":"停用"))])],1)],1),e._v(" "),a("el-dialog",{attrs:{title:"设置授权影院",visible:e.outerVisible},on:{"update:visible":function(t){e.outerVisible=t}}},[a("el-dialog",{attrs:{title:"选择影院",visible:e.innerVisible,"append-to-body":""},on:{"update:visible":function(t){e.innerVisible=t}}},[a("el-form",{attrs:{size:"small"}},[a("el-form-item",{attrs:{label:"影院名称"}},[a("el-input",{staticStyle:{width:"200px"},attrs:{placeholder:"请输入内容"},model:{value:e.filterText,callback:function(t){e.filterText=t},expression:"filterText"}}),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.searchCinema}},[e._v("搜索")])],1),e._v(" "),a("el-form-item",[a("el-tree",{ref:"cinemaTree",staticClass:"filter-tree",attrs:{data:e.treeData,props:e.defaultProps,"node-key":"name","show-checkbox":"","default-expand-all":"","filter-node-method":e.filterNode}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.confirmSelectCinema}},[e._v("确定")]),e._v(" "),a("el-button",{on:{click:function(t){e.innerVisible=!1}}},[e._v("取消")])],1)],1),e._v(" "),a("div",[a("div",[a("el-radio",{attrs:{label:1},on:{change:e.useRangeChange},model:{value:e.authorizedCinemaData.useRange,callback:function(t){e.$set(e.authorizedCinemaData,"useRange",t)},expression:"authorizedCinemaData.useRange"}},[e._v("全部影院")])],1),e._v(" "),a("div",{staticStyle:{"margin-top":"20px"}},[a("el-radio",{attrs:{label:2},on:{change:e.useRangeChange},model:{value:e.authorizedCinemaData.useRange,callback:function(t){e.$set(e.authorizedCinemaData,"useRange",t)},expression:"authorizedCinemaData.useRange"}},[e._v("指定影院")]),e._v(" "),a("el-input",{staticStyle:{width:"200px"},attrs:{clearable:"",readonly:""},on:{clear:e.clearSelectedCinema},model:{value:e.selectedCinema,callback:function(t){e.selectedCinema=t},expression:"selectedCinema"}}),e._v(" "),a("i",{staticClass:"el-icon-more",staticStyle:{background:"#3B74FF",color:"#fff","border-radius":"2px",cursor:"pointer"},on:{click:function(t){e.innerVisible=2===e.authorizedCinemaData.useRange}}})],1)]),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.setChannelCinema}},[e._v("确定")]),e._v(" "),a("el-button",{on:{click:function(t){e.outerVisible=!1}}},[e._v("取消")])],1)],1),e._v(" "),a("el-dialog",{attrs:{title:"选择渠道",visible:e.dialogVisible,width:"892px"},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("el-form",{attrs:{inline:!0,model:e.searchForm,"label-width":e.formLabelWidth,size:"small"}},[a("el-form-item",{attrs:{label:"渠道类型"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.searchForm.type,callback:function(t){e.$set(e.searchForm,"type",t)},expression:"searchForm.type"}},[a("el-option",{attrs:{label:"全部",value:""}}),e._v(" "),e._l(e.dialogChannelNatureOptions,function(e){return a("el-option",{key:e.keyCode,attrs:{label:e.keyName,value:e.keyCode}})})],2)],1),e._v(" "),a("el-form-item",{attrs:{label:"渠道编码"}},[a("el-input",{attrs:{placeholder:"请输入渠道编码"},model:{value:e.searchForm.code,callback:function(t){e.$set(e.searchForm,"code",t)},expression:"searchForm.code"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"渠道名称"}},[a("el-input",{attrs:{placeholder:"请输入渠道名称"},model:{value:e.searchForm.name,callback:function(t){e.$set(e.searchForm,"name",t)},expression:"searchForm.name"}})],1),e._v(" "),a("el-form-item",{staticStyle:{float:"right","margin-right":"0"}},[a("el-button",{staticStyle:{width:"80px",height:"32px"},attrs:{type:"primary"},on:{click:e.getChannelOtherList}},[e._v("查询")])],1)],1),e._v(" "),a("div",{staticStyle:{display:"flex"}},[a("el-table",{ref:"multipleTable",staticStyle:{width:"70%"},attrs:{data:e.gridData,height:"420"},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55",selectable:e.selectable}}),e._v(" "),a("el-table-column",{attrs:{property:"code",label:"渠道编码",width:"150"}}),e._v(" "),a("el-table-column",{attrs:{property:"name",label:"渠道名称"}}),e._v(" "),a("el-table-column",{attrs:{label:"渠道类型","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[1===t.row.type||0===t.row.type?a("span",[e._v("自营渠道")]):2===t.row.type?a("span",[e._v("第三方渠道")]):e._e()]}}])})],1),e._v(" "),a("el-card",{staticClass:"box-card",attrs:{shadow:"never"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",{staticStyle:{display:"inline-block",height:"22px","line-height":"22px"}},[e._v("已选内容：")]),e._v(" "),a("el-button",{staticStyle:{float:"right",padding:"3px 0"},attrs:{type:"text"},on:{click:e.emptyData}},[e._v("清空")])],1),e._v(" "),e._l(e.multipleSelection,function(t){return a("div",{key:t.code,staticClass:"text item"},[a("span",{staticStyle:{display:"inline-block",width:"80%","white-space":"nowrap","text-overflow":"ellipsis",overflow:"hidden"},attrs:{title:t.name}},[e._v(e._s(t.name))]),e._v(" "),a("i",{staticClass:"el-icon-close",staticStyle:{float:"right",padding:"3px 0",cursor:"pointer"},on:{click:function(a){return e.deleteCurrent(t.code)}}})])})],2)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{disabled:!e.multipleSelection.length,type:"primary"},on:{click:e.addHeaderChannel}},[e._v("保存")]),e._v(" "),a("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取消")])],1)],1),e._v(" "),a("el-form",{staticClass:"demo-form-inline search-form",attrs:{inline:!0,model:e.formData,size:"small"}},[a("el-form-item",{attrs:{label:"渠道类型："}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.formData.channelNature,callback:function(t){e.$set(e.formData,"channelNature",t)},expression:"formData.channelNature"}},[a("el-option",{attrs:{label:"全部",value:""}}),e._v(" "),e._l(e.channelNatureOptions,function(e){return a("el-option",{key:e.keyCode,attrs:{label:e.keyName,value:e.keyCode}})})],2)],1),e._v(" "),a("el-form-item",{attrs:{label:"状态："}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.formData.status,callback:function(t){e.$set(e.formData,"status",t)},expression:"formData.status"}},[a("el-option",{attrs:{label:"全部",value:""}}),e._v(" "),e._l(e.statusOptions,function(e){return a("el-option",{key:e.keyCode,attrs:{label:e.keyName,value:e.keyCode}})})],2)],1),e._v(" "),a("el-form-item",{attrs:{label:"渠道名称："}},[a("el-input",{attrs:{placeholder:"请输入渠道名称",clearable:""},model:{value:e.formData.name,callback:function(t){e.$set(e.formData,"name",t)},expression:"formData.name"}})],1),e._v(" "),a("el-form-item",[a("el-button",{staticStyle:{width:"80px",height:"32px"},attrs:{type:"primary"},on:{click:e.search}},[e._v("查询")])],1)],1),e._v(" "),a("div",{staticClass:"el-row-btns clearfix"},[a("el-button",{staticClass:"normal-btn",staticStyle:{float:"right"},attrs:{size:"small"},on:{click:e.addChannel}},[e._v("添加渠道")])],1),e._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData}},[a("el-table-column",{attrs:{label:"序号",type:"index",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"code",label:"渠道编码","show-overflow-tooltip":""}}),e._v(" "),a("el-table-column",{attrs:{prop:"name",label:"渠道名称","show-overflow-tooltip":""}}),e._v(" "),a("el-table-column",{attrs:{prop:"channelNature",label:"渠道类型","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[1===t.row.channelNature||0===t.row.channelNature?a("span",[e._v("自营渠道")]):2===t.row.channelNature?a("span",[e._v("第三方渠道")]):e._e()]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"cinemaNames",label:"授权影院数",width:"240","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.cinemaNames&&t.row.cinemaNames.length>0?a("span",[e._v(e._s(t.row.cinemaNames.join("，")))]):e._e()]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"status",label:"状态",width:"120","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[0===t.row.status?a("span",[e._v("启用")]):a("span",[e._v("停用")])]}}])}),e._v(" "),a("el-table-column",{attrs:{width:"260",fixed:"right",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{staticStyle:{padding:"0"},attrs:{type:"text",size:"small"},on:{click:function(a){return e.updateStatus(0===t.row.status?1:0,t.row.uid)}}},[e._v(e._s(t.row.status?"启用":"停用"))]),e._v(" "),a("el-button",{staticStyle:{padding:"0"},attrs:{type:"text",size:"small"},on:{click:function(a){return e.setAuthorizedCinema(t.row.uid)}}},[e._v("设置授权影院")]),e._v(" "),a("el-button",{staticStyle:{padding:"0"},attrs:{type:"text",size:"small"},on:{click:function(a){return e.showChannelDetail(t.row)}}},[e._v("查看详情")])]}}])})],1),e._v(" "),a("div",{staticClass:"page-wrap"},[a("el-pagination",{attrs:{background:"","current-page":e.formData.page,"page-sizes":[20,40,60,80],"page-size":e.formData.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)},l=[],o={render:n,staticRenderFns:l};t.a=o},78:function(e,t,a){"use strict";function n(e){a(320)}Object.defineProperty(t,"__esModule",{value:!0});var l=a(200),o=a(322),r=a(4),i=n,s=r(l.a,o.a,!1,i,null,null);t.default=s.exports}});