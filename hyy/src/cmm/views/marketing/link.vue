<template>
    <el-container style="width: 100%; height: -webkit-fill-available;">
        <el-aside width="200px" style="padding-top: 30px;">
            <div class="link-item" v-for="(item, index) in routerLinks" :key="index + 1"
                 @click="addTab(item)">
                {{item.title}}
            </div>
        </el-aside>
        <el-main>
            <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab">
                <el-tab-pane
                        v-for="(item, index) in editableTabsArray"
                        :key="index"
                        :label="item.title"
                        :name="item.name"
                        :closable="item.closable"
                >
                    <iframe  :src="item.path" height="800px" width="100%"></iframe>
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
    <!-- <div class="ctm-home">
        <router-link ref="link" class="link-item"  v-for="(item, index) in routerLinks" 
            :to="item.path" :key="index">
                {{item.title}}
        </router-link>
    </div> -->
    
</template>

<script>
    export default {
        data() {
            return {
                editableTabsValue: '首页',
                editableTabsArray: [{
                    title: '首页',
                    name: '首页',
                    path: ''
                }],
                routerLinks: [
                    {
                        name: '影票活动管理',
                        path: 'movieTicketActivity',
                        title: '影票活动管理'
                    },
                    {
                        name: '卖品活动管理',
                        path: 'salesActivity',
                        title: '卖品活动管理'
                    },
                    {
                        name: '套票促销活动管理',
                        path: 'packagePromotionActivity',
                        title: '套票促销活动管理'
                    },
                    {
                        name: '赠送积分活动管理',
                        path: 'giftPointsActivity',
                        title: '赠送积分活动管理'
                    },
                    {
                        name: '赠送余额活动管理',
                        path: 'giftBalanceActivity',
                        title: '赠送余额活动管理'
                    },
                    {
                        name: '赠送票券活动管理',
                        path: 'giftTicketsActivity',
                        title: '赠送票券活动管理'
                    },
                    {
                        name: '自定义营销活动管理',
                        path: 'userDefinedActivity',
                        title: '自定义营销活动管理'
                    }
                ]

            }
        },
        methods: {
            addTab(item) {
                let existTab = false;
                for(let i = 0; i < this.editableTabsArray.length; i++){
                    if(item.name == this.editableTabsArray[i].name){
                        existTab = true;
                        break;
                    }
                }
                if(!existTab){
                    item.closable = true;
                    this.editableTabsArray.push(item);
                }
                this.editableTabsValue = item.name;
                //console.log('this.editableTabsValue='+this.editableTabsValue);
            },
            removeTab(targetName) {
                let tabs = this.editableTabsArray;
                let activeName = this.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue = activeName;
                this.editableTabsArray = tabs.filter(tab => tab.name !== targetName);
            }
        }
    }
</script>

<style lang="scss">
    // .ctm-home {
    //     .link-item {
    //         display: inline-block;
    //         width: 180px;
    //         line-height: 1;
    //         white-space: nowrap;
    //         cursor: pointer;
    //         background: #fff;
    //         border: 1px solid #dcdfe6;
    //         border-color: #dcdfe6;
    //         color: #606266;
    //         -webkit-appearance: none;
    //         text-align: center;
    //         box-sizing: border-box;
    //         outline: none;
    //         margin: 0;
    //         transition: .1s;
    //         -moz-user-select: none;
    //         -webkit-user-select: none;
    //         -ms-user-select: none;
    //         padding: 12px 20px;
    //         font-size: 14px;
    //         border-radius: 4px;
    //         margin: 3px;
    //         &:hover {
    //             background: #409eff;
    //             border-color: #409eff;
    //             color: #fff;
    //         }
    //     }
    // }
    .link-item {
        display: inline-block;
        width: 180px;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-color: #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: .1s;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px;
        margin: 3px;
        &:hover {
            background: #409eff;
            border-color: #409eff;
            color: #fff;
        }
    }

</style>