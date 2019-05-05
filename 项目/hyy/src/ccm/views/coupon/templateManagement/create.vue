<template>
<div class="template">
    <!-- 票版元素 -->
    <section class="elemenet">
        <h3 class="title">票版元素<span class="tips-text">(请单击选择)</span></h3>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="元素库" name="elementLibary">
                <!-- <template v-for="item in ">
                   
                </template> -->
            </el-collapse-item>
            <el-collapse-item title="已选元素" name="elementSelect">

            </el-collapse-item>
        </el-collapse>
    </section>
    <!-- 票版内容 -->
    <section class="content">

    </section>
    <!-- 编辑属性 -->
    <section class="attribute">

    </section>
</div>
</template>

<script>
export default {
    data() {
        return {
            activeNames: ['elementLibary', 'elementSelect'],
            config: {
                element: [
                    {
                        title: '票券名称',
                        content: '票券名称',
                        type: 'text'
                    },
                    {
                        title: '票券名称',
                        content: '票券名称',
                        type: 'text'
                    },

                ]
            }
        }
    },
    created() {
        this.findcouponPrintModelDef();
    },
    methods: {
        /**
         * @function packElementItem - 组装票版元素
         * 
         * @return {Array} 
         */
        packElementItem() {
            let elementArr = [];

            // let elemenet = [{
            //     title: '基本类型',
            //     content: ['票券名称','票券分类','票券类型','销售数量','起售数量','销售方式','票券编号','影院名称','影院地址','影院电话','销售单备注','销售单价']
            // },{
            //     title: '票券消费规划',
            //     content: ['排除日期','星期范围','影院范围','消费渠道','消费者身份','会员生日','规则名称','票券使用数量','兑换补充金额','抵用金额','代金券消费密码','允许购买商品范围','代金券每笔低消','商品类型','商品数量','放映有效期','放映排除日期','放映星期范围','放映时段范围','影片名称','影片类型','影厅类型','']
            // }]
        },
        /**
         * @function findcouponPrintModelDef - 查询票版元素
         */
        findcouponPrintModelDef() {
            this.$ccmList.findcouponPrintModelDef({}).then(data => {
                console.log(data);
            }).catch(msg => {
                console.log(`查询票版元素错误：${msg}`);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
@mixin font-base {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    letter-spacing: 0;
    height: 19px;
}

@mixin flex {
    display: flex;
    display: -webkit-flex;
}

@mixin flex-no-wrap {
    flex-wrap: nowrap;
}

.template {
    @include flex;
    @include flex-no-wrap;

    .elemenet {
        width: 260px;
    }

    .content {
        width: 680px;
    }

    .attribute {
        width: 316px;
    }

}

.title {
    @include font-base;
    color: #333333;

    .tips-text {
        color: #8885858a;
    }
}
</style>
