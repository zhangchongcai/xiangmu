<template>
    <el-table :data="data" border style="width: 100%" :height="tableHeight" :row-style="showTr" size="mini" class="tree-table">
        <el-table-column v-for="(column,index) in columns" :key="column.dataIndex" :label="column.text" show-overflow-tooltip>
            <template slot-scope="scope">
                <template v-for="(space, levelIndex) in scope.row._level">
                    <span 
                        v-if="spaceIconShow(index)" 
                        :key="levelIndex"
                        class="ms-tree-space">
                    </span>
                </template>
                <span :style="{marginLeft: 16*scope.row._level +'px'}" v-if="index === 0">
                </span>
                <i v-if="!scope.row._expanded && toggleIconShow(index,scope.row)" class="el-icon-caret-right" aria-hidden="true" @click="toggle(scope.$index)"></i>
                <i v-if="scope.row._expanded && toggleIconShow(index,scope.row)" class="el-icon-caret-bottom" aria-hidden="true" @click="toggle(scope.$index)"></i>
                <span>
                    {{scope.row[column.dataIndex]}}
                </span>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import tool from '../../util/table'
export default {
    name: 'TreeGrid',
    props: {
        // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
        treeStructure: {
            type: Boolean,
            default: function () {
                return false
            }
        },
        // height: {
        //     type: Number,
        //     default: function () {
        //         return 500
        //     }
        // },
        more: {
            type: Boolean,
            default: function () {
                return false
            }
        },
        // 这是相应的字段展示
        columns: {
            type: Array,
            default: function () {
                return []
            }
        },
        // 这是数据源
        dataSource: {
            type: Array,
            default: function () {
                return []
            }
        },
        // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
        requestUrl: {
            type: String,
            default: function () {
                return ''
            }
        },
        // 这个是是否展示操作列
        treeType: {
            type: String,
            default: function () {
                return 'normal'
            }
        },
        // 是否默认展开所有树
        defaultExpandAll: {
            type: Boolean,
            default: function () {
                return false
            }
        }
    },
    data() {
        return {
            tableHeight: 500
        }
    },
    computed: {
        // 格式化数据源
        data: function () {
            let me = this
            if (me.treeStructure) {
                let data = tool.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
                return data
            }
            return me.dataSource
        }
    },
    mounted() {
        this.calcTableHeight()
    },
    methods: {
        calcTableHeight() {
            let h = 0
            document.querySelectorAll('.tree-table tr').forEach(node => {
                h += node.clientHeight
            })
            this.tableHeight = h + 2
        },
        // 显示行
        showTr(row, index) {
                let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
                row.row._show = show
                return show ? '' : 'display:none;'
        },
        // 展开下级
        toggle(trIndex) {
            let me = this
            let record = me.data[trIndex]
            record._expanded = !record._expanded
        },
        // 显示层级关系的空格和图标
        spaceIconShow(index) {
            let me = this
            if (me.treeStructure && index === 0) {
                return true
            }
            return false
        },
        // 点击展开和关闭的时候，图标的切换
        toggleIconShow(index, record) {
            this.$nextTick(()=>{
                this.calcTableHeight()
            })
            let me = this
            if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
                return true
            }
            return false
        },
    }
}
</script>
<style scoped lang="scss">

</style>
