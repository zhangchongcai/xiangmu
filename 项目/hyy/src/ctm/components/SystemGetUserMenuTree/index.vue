<template>
    <div class="systemStree">
        <aside class="aside">
            <el-tree
                ref="treeBox" 
                :data="dataTree" 
                :props="defaultProps" 
                @node-click="handleNodeClick" 
                default-expand-all 
                highlight-current
                node-key="applicableobj"
                :default-checked-keys="defaulKey"
                :render-content="renderContent"
            >
            </el-tree>
        </aside>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dataTree: [],
            defaultProps: {
                label: 'menuName',
                children: 'sonTree'
            },
            applicableobj:'',
            defaulKey:[],
            radio:1,
        }
    },
    methods:{
        //影院选择
        handleNodeClick(item) {
            if(item.applicableobj){
                this.applicableobj = item.applicableobj
                this.$emit('choseCinema',this.applicableobj);
            }
        },
        
        getCinemaStree() {
            this.$ctmList.systemGetUserMenuTree().then(res =>{
                let obj = res.data 
                this.defaulKey.push([obj.sonTree[0].cinemas[0].first]) //默认的key
                this.applicableobj = obj.sonTree[0].cinemas[0].first //默认的请求参数
                this.$nextTick(() => {
                    this.$refs.treeBox.setCurrentKey(obj.sonTree[0].cinemas[0].first); // value 绑定的node-key
                });
                this.$emit('choseCinema',this.applicableobj);
                this.formData(obj)
                let arr =[]
                arr.push(obj)
                this.dataTree = arr
            })
        },
         renderContent(h, { node, data, store }) {
            if(data.applicableobj){
                console.log(data)
                return (
                <span >
                    <i class="el-icon-menu"></i>
                    {node.label}
                </span>);
            }else{
                return (
                <span >
                    <span>
                        <span>{node.label}</span>
                    </span>
                </span>);
            }
        },
        //递归重组后台返回的菜单树
        formData(obj) {
            if(obj.sonTree){
                if(obj.cinemas){
                    obj.cinemas.forEach(item =>{
                        let data = {
                            applicableobj : item.first,
                            menuName:item.second,
                        }
                        obj.sonTree.push(data)
                    })
                }
                for(let i = 0; i < obj.sonTree.length; i++){
                    let item = obj.sonTree[i];
                    if(item.sonTree){
                        this.formData(item)
                    }
                }
            }
        }
    },
    created() {
        this.getCinemaStree()
    }
}
</script>
<style lang="scss">
.systemStree{
    .el-radio{
        margin: 0;
    }
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
        background: #3B74FF;
        color: #fff;
    }
}

</style>


