webpackJsonpcim([73],{167:function(e,a,t){"use strict";a.a={data:function(){return{pageSizes:[15,30,45],pageSize:15,pgLayout:"total, sizes, prev, pager, next, jumper",pgbackground:!0,defaultTableHeight:"610"}}}},344:function(e,a,t){"use strict";var n=t(167);a.a={mixins:[n.a],data:function(){return{editableTabsValue:"卖品首页",editableTabsArray:[{name:"卖品首页",path:""}],routerLinks:[{name:"基础设置",icon:"el-icon-setting",path:"",children:[{name:"仓库管理",path:"goodsStorehouse/list"},{name:"货架管理",path:"storageRack/index"},{name:"销售地点",path:"salesLocation/index"},{name:"销售终端",path:"salesTerminal/index"},{name:"销售大类",path:"salesType/index"},{name:"类别管理",path:"goodsCategories/index"},{name:"商品分类管理",path:"goodsCategoriesManagement/index"},{name:"单位管理",path:"goodsUnit/index"},{name:"品牌管理",path:"goodsBrand/index"},{name:"销售属性",path:"salesAttribute/index"}]},{name:"商品资料",icon:"el-icon-menu",path:"",children:[{name:"总部商品管理",path:"commodityInformation"},{name:"门店商品管理",path:"commodityInformationStore"}]}]}},methods:{addTab:function(e){for(var a=!1,t=0;t<this.editableTabsArray.length;t++)if(e.name==this.editableTabsArray[t].name){a=!0;break}a||(e.closable=!0,this.editableTabsArray.push(e)),this.editableTabsValue=e.name},removeTab:function(e){var a=this.editableTabsArray,t=this.editableTabsValue;t===e&&a.forEach(function(n,i){if(n.name===e){var s=a[i+1]||a[i-1];s&&(t=s.name)}}),this.editableTabsValue=t,this.editableTabsArray=a.filter(function(a){return a.name!==e})}},components:{}}},441:function(e,a,t){var n=t(442);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);t(87)("638582c0",n,!0,{})},442:function(e,a,t){a=e.exports=t(86)(!0),a.push([e.i,"","",{version:3,sources:[],names:[],mappings:"",file:"index.vue",sourceRoot:""}])},443:function(e,a,t){"use strict";var n=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("el-container",{staticStyle:{width:"100%",height:"-webkit-fill-available"}},[t("el-aside",{staticStyle:{"padding-top":"30px"},attrs:{width:"200px"}},[t("el-menu",{staticClass:"el-menu-vertical-demo"},[e._l(e.routerLinks,function(a,n){return[a.children&&a.children.length>0?t("el-submenu",{key:a.name,attrs:{index:n+1+""}},[t("template",{slot:"title"},[t("i",{class:a.icon}),e._v(" "),t("span",[e._v(e._s(a.name))])]),e._v(" "),e._l(a.children,function(a,n){return t("el-menu-item",{key:a.name,attrs:{index:n+1+""},on:{click:function(t){return e.addTab(a)}}},[e._v(e._s(a.name))])})],2):e._e()]})],2)],1),e._v(" "),t("el-main",[t("el-tabs",{attrs:{type:"card"},on:{"tab-remove":e.removeTab},model:{value:e.editableTabsValue,callback:function(a){e.editableTabsValue=a},expression:"editableTabsValue"}},e._l(e.editableTabsArray,function(e,a){return t("el-tab-pane",{key:e.name,attrs:{label:e.name,name:e.name,closable:e.closable}},[t("iframe",{attrs:{src:e.path,height:"800px",width:"100%"}})])}),1)],1)],1)},i=[],s={render:n,staticRenderFns:i};a.a=s},98:function(e,a,t){"use strict";function n(e){t(441)}Object.defineProperty(a,"__esModule",{value:!0});var i=t(344),s=t(443),r=t(22),l=n,o=r(i.a,s.a,!1,l,null,null);a.default=o.exports}});