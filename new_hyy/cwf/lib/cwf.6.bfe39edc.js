webpackJsonpcwf([6],{56:function(e,t,n){"use strict";function i(e){n(92)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(71),A=n(94),o=n(12),c=i,r=o(a.a,A.a,!1,c,"data-v-2a7be663",null);t.default=r.exports},71:function(e,t,n){"use strict";t.a={data:function(){return{type:this.$route.query.type||"",spId:this.$route.query.spId||"",activeNames:["1"],formData:{name:"",noteNum:1,processList:[{assigneeId:"",assigneeName:"",assigneeType:0,nextNoteNum:null,noteNum:1,tenantId:this.$store.state.loginUser.consumerId||""}],status:0,tenantId:this.$store.state.loginUser.consumerId||""},tenantId:this.$store.state.loginUser.consumerId||""}},created:function(){this.findSpById()},methods:{findSpById:function(){var e=this,t={spId:this.spId};this.$cwfList.findSpById(t).then(function(t){if(t&&200===t.code&&1==t.flag){var n=t.data;e.formData.noteNum=n.noteNum,e.formData.name=n.name,e.formData.status=n.status,e.formData.processList=[],n.processList.forEach(function(t){e.formData.processList.push({assigneeId:t.assigneeId,assigneeName:t.assigneeName,assigneeType:t.assigneeType,nextNoteNum:t.nextNoteNum,noteNum:t.noteNum,tenantId:e.tenantId})})}else e.$message({message:t.msg,type:"warning",duration:1e3})}).catch(function(e){console.log(e)})},closeBack:function(){this.$store.commit("tagNav/removeTagNav",this.$route),this.$router.push({path:"/workflow/approvalSetting"})}}}},92:function(e,t,n){var i=n(93);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);n(51)("2f7d5a16",i,!0,{})},93:function(e,t,n){t=e.exports=n(50)(!0),t.push([e.i,'\n@charset "UTF-8";\n.cwf_checkApprovalSetting .collapse-style[data-v-2a7be663] {\n  width: 100%;\n  border: 0;\n  position: relative;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-header[data-v-2a7be663] {\n  width: 100%;\n  overflow: hidden;\n  margin: 20px 0;\n  padding-left: 20px;\n  font-size: 12px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-header .header-item[data-v-2a7be663] {\n    float: left;\n    margin-right: 64px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-header .header-item .header-item-name[data-v-2a7be663] {\n      display: inline-block;\n      float: left;\n      height: 32px;\n      line-height: 32px;\n      color: #666666;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-header .header-item .header-item-content[data-v-2a7be663] {\n      min-width: 300px;\n      display: inline-block;\n      float: left;\n      width: 100px;\n      height: 32px;\n      line-height: 32px;\n      color: #666666;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left[data-v-2a7be663] {\n  position: absolute;\n  width: 95px;\n  float: left;\n  overflow: hidden;\n  min-height: 611px;\n  padding: 15px 0px 15px 20px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .items[data-v-2a7be663] {\n    width: 80px;\n    overflow: hidden;\n    height: 20px;\n    line-height: 20px;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .items .circle[data-v-2a7be663] {\n      float: left;\n      display: block;\n      width: 12px;\n      height: 12px;\n      border-radius: 50%;\n      border: 2px solid #bcbcbc;\n      vertical-align: middle;\n      margin: 4px 0;\n      margin-right: 14px;\n      margin-left: 4px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .items .words[data-v-2a7be663] {\n      float: left;\n      display: block;\n      color: #666666;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .items .round[data-v-2a7be663] {\n      border-radius: 50%;\n      height: 20px;\n      width: 20px;\n      display: inline-block;\n      vertical-align: top;\n      border: 2px solid #bcbcbc;\n      float: left;\n      margin-right: 10px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .items .round .round-number[data-v-2a7be663] {\n        display: block;\n        color: #bcbcbc;\n        height: 20px;\n        line-height: 20px;\n        text-align: center;\n        font-size: 12px;\n        font-weight: bold;\n        margin-top: -1px;\n        margin-left: -1px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .line[data-v-2a7be663] {\n    width: 80px;\n    height: 72px;\n    border-left: 1px solid #bcbcbc;\n    margin-left: 10px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-right[data-v-2a7be663] {\n  float: left;\n  overflow: hidden;\n  min-height: 611px;\n  padding: 15px 100px 15px 100px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-right .content-first[data-v-2a7be663] {\n    height: 94px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-right .content-last[data-v-2a7be663] {\n    height: 95px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-right .content[data-v-2a7be663] {\n    overflow: hidden;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n    height: 86px;\n    line-height: 22px;\n    color: #666666;\n    margin-bottom: 12px;\n    padding-left: 50px;\n    text-overflow: ellipsis;\n    /* 超出部分显示省略号 */\n    white-space: normal;\n    /*规定段落中的文本不进行换行 */\n    word-break: break-all;\n    display: -webkit-box;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 4;\n}\n.cwf_checkApprovalSetting .footer[data-v-2a7be663] {\n  text-align: center;\n  margin: 24px 0;\n}\n',"",{version:3,sources:["G:/Workspaces/work/chenxin/module-hyy/cwf/src/views/workflow/approvalSetting/checkApprovalSetting.vue"],names:[],mappings:";AACA,iBAAiB;AACjB;EACE,YAAY;EACZ,UAAU;EACV,mBAAmB;CACpB;AACD;EACE,YAAY;EACZ,iBAAiB;EACjB,eAAe;EACf,mBAAmB;EACnB,gBAAgB;CACjB;AACD;IACI,YAAY;IACZ,mBAAmB;CACtB;AACD;MACM,sBAAsB;MACtB,YAAY;MACZ,aAAa;MACb,kBAAkB;MAClB,eAAe;CACpB;AACD;MACM,iBAAiB;MACjB,sBAAsB;MACtB,YAAY;MACZ,aAAa;MACb,aAAa;MACb,kBAAkB;MAClB,eAAe;CACpB;AACD;EACE,mBAAmB;EACnB,YAAY;EACZ,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,4BAA4B;EAC5B,+BAA+B;UACvB,uBAAuB;CAChC;AACD;IACI,YAAY;IACZ,iBAAiB;IACjB,aAAa;IACb,kBAAkB;IAClB,+BAA+B;YACvB,uBAAuB;CAClC;AACD;MACM,YAAY;MACZ,eAAe;MACf,YAAY;MACZ,aAAa;MACb,mBAAmB;MACnB,0BAA0B;MAC1B,uBAAuB;MACvB,cAAc;MACd,mBAAmB;MACnB,iBAAiB;CACtB;AACD;MACM,YAAY;MACZ,eAAe;MACf,eAAe;CACpB;AACD;MACM,mBAAmB;MACnB,aAAa;MACb,YAAY;MACZ,sBAAsB;MACtB,oBAAoB;MACpB,0BAA0B;MAC1B,YAAY;MACZ,mBAAmB;CACxB;AACD;QACQ,eAAe;QACf,eAAe;QACf,aAAa;QACb,kBAAkB;QAClB,mBAAmB;QACnB,gBAAgB;QAChB,kBAAkB;QAClB,iBAAiB;QACjB,kBAAkB;CACzB;AACD;IACI,YAAY;IACZ,aAAa;IACb,+BAA+B;IAC/B,kBAAkB;CACrB;AACD;EACE,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,+BAA+B;EAC/B,+BAA+B;UACvB,uBAAuB;CAChC;AACD;IACI,aAAa;CAChB;AACD;IACI,aAAa;CAChB;AACD;IACI,iBAAiB;IACjB,+BAA+B;YACvB,uBAAuB;IAC/B,aAAa;IACb,kBAAkB;IAClB,eAAe;IACf,oBAAoB;IACpB,mBAAmB;IACnB,wBAAwB;IACxB,eAAe;IACf,oBAAoB;IACpB,kBAAkB;IAClB,sBAAsB;IACtB,qBAAqB;IACrB,6BAA6B;IAC7B,sBAAsB;CACzB;AACD;EACE,mBAAmB;EACnB,eAAe;CAChB",file:"checkApprovalSetting.vue",sourcesContent:['\n@charset "UTF-8";\n.cwf_checkApprovalSetting .collapse-style[data-v-2a7be663] {\n  width: 100%;\n  border: 0;\n  position: relative;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-header[data-v-2a7be663] {\n  width: 100%;\n  overflow: hidden;\n  margin: 20px 0;\n  padding-left: 20px;\n  font-size: 12px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-header .header-item[data-v-2a7be663] {\n    float: left;\n    margin-right: 64px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-header .header-item .header-item-name[data-v-2a7be663] {\n      display: inline-block;\n      float: left;\n      height: 32px;\n      line-height: 32px;\n      color: #666666;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-header .header-item .header-item-content[data-v-2a7be663] {\n      min-width: 300px;\n      display: inline-block;\n      float: left;\n      width: 100px;\n      height: 32px;\n      line-height: 32px;\n      color: #666666;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left[data-v-2a7be663] {\n  position: absolute;\n  width: 95px;\n  float: left;\n  overflow: hidden;\n  min-height: 611px;\n  padding: 15px 0px 15px 20px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .items[data-v-2a7be663] {\n    width: 80px;\n    overflow: hidden;\n    height: 20px;\n    line-height: 20px;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .items .circle[data-v-2a7be663] {\n      float: left;\n      display: block;\n      width: 12px;\n      height: 12px;\n      border-radius: 50%;\n      border: 2px solid #bcbcbc;\n      vertical-align: middle;\n      margin: 4px 0;\n      margin-right: 14px;\n      margin-left: 4px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .items .words[data-v-2a7be663] {\n      float: left;\n      display: block;\n      color: #666666;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .items .round[data-v-2a7be663] {\n      border-radius: 50%;\n      height: 20px;\n      width: 20px;\n      display: inline-block;\n      vertical-align: top;\n      border: 2px solid #bcbcbc;\n      float: left;\n      margin-right: 10px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .items .round .round-number[data-v-2a7be663] {\n        display: block;\n        color: #bcbcbc;\n        height: 20px;\n        line-height: 20px;\n        text-align: center;\n        font-size: 12px;\n        font-weight: bold;\n        margin-top: -1px;\n        margin-left: -1px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-left .line[data-v-2a7be663] {\n    width: 80px;\n    height: 72px;\n    border-left: 1px solid #bcbcbc;\n    margin-left: 10px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-right[data-v-2a7be663] {\n  float: left;\n  overflow: hidden;\n  min-height: 611px;\n  padding: 15px 100px 15px 100px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-right .content-first[data-v-2a7be663] {\n    height: 94px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-right .content-last[data-v-2a7be663] {\n    height: 95px;\n}\n.cwf_checkApprovalSetting .checkApprovalSetting-item-right .content[data-v-2a7be663] {\n    overflow: hidden;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n    height: 86px;\n    line-height: 22px;\n    color: #666666;\n    margin-bottom: 12px;\n    padding-left: 50px;\n    text-overflow: ellipsis;\n    /* 超出部分显示省略号 */\n    white-space: normal;\n    /*规定段落中的文本不进行换行 */\n    word-break: break-all;\n    display: -webkit-box;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 4;\n}\n.cwf_checkApprovalSetting .footer[data-v-2a7be663] {\n  text-align: center;\n  margin: 24px 0;\n}\n'],sourceRoot:""}])},94:function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"cwf_checkApprovalSetting"},[n("div",{staticClass:"checkApprovalSetting-header"},[n("div",{staticClass:"header-item"},[n("div",{staticClass:"header-item-name"},[e._v("审批流程名称：")]),e._v(" "),n("div",{staticClass:"header-item-content"},[e._v(e._s(e.formData.name))])]),e._v(" "),n("div",{staticClass:"header-item"},[n("div",{staticClass:"header-item-name"},[e._v("审批节点数：")]),e._v(" "),n("div",{staticClass:"header-item-content"},[e._v(e._s(e.formData.noteNum))])])]),e._v(" "),n("el-collapse",{staticClass:"collapse-style",model:{value:e.activeNames,callback:function(t){e.activeNames=t},expression:"activeNames"}},[n("el-collapse-item",{attrs:{title:"节点审批设置",name:"1"}},[n("div",{staticClass:"checkApprovalSetting-item-left"},[n("div",{staticClass:"items"},[n("span",{staticClass:"circle"}),n("span",{staticClass:"words"},[e._v("开始")])]),e._v(" "),n("div",{staticClass:"line"}),e._v(" "),e._l(e.formData.processList,function(t,i){return[n("div",{key:i},[n("div",{staticClass:"items",staticStyle:{margin:"3px 0"}},[n("span",{staticClass:"round"},[n("span",{staticClass:"round-number"},[e._v(e._s(i+1))])]),e._v(" "),n("span",{staticClass:"words"},[e._v("审批人：")])]),e._v(" "),n("div",{staticClass:"line"})])]}),e._v(" "),n("div",{staticClass:"items"},[n("span",{staticClass:"circle"}),n("span",{staticClass:"words"},[e._v("结束")])])],2),e._v(" "),n("div",{staticClass:"checkApprovalSetting-item-right"},[n("div",{staticClass:"content-first"}),e._v(" "),e._l(e.formData.processList,function(t,i){return[n("div",{key:i,staticClass:"content"},[e._v("\n            "+e._s(t.assigneeName)+"\n          ")])]}),e._v(" "),n("div",{staticClass:"content-last"})],2)])],1),e._v(" "),n("div",{staticClass:"footer"},[n("el-button",{on:{click:e.closeBack}},[e._v("返 回")])],1)],1)},a=[],A={render:i,staticRenderFns:a};t.a=A}});