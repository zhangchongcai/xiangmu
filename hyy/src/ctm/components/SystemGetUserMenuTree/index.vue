<template>
    <div class="systemStree">
        <el-tree
            ref="treeBox" 
            :data="dataTree" 
            :props="defaultProps" 
            @node-click="handleNodeClick" 
            highlight-current
            node-key="menuName"
            :default-expanded-keys="defaulKeyMerk"
            :default-checked-keys="defaulKey"
        >
            <span style="padding:0px" slot-scope="{ node, data }" v-if="data.applicableobj">
                <el-radio v-model="customTree" :label="data.applicableobj">
                    {{ node.label }}
                </el-radio>
            </span>
            <span style="padding:0px" slot-scope="{ node }" v-else>
                {{ node.label }}
            </span>
        </el-tree>
    </div>
</template>
<script>
export default {
    data(){
        return{
            customTree:'',
            dataTree: [],
            defaultProps: {
                label: 'menuName',
                children: 'sonTree'
            },
            applicableobj:'',
            defaulKey:[],
            defaulKeyMerk:['总部'],
            radio:1,
            key:''
        }
    },
    methods:{
        //影院选择
        handleNodeClick(item) {
            if(item.applicableobj){
                this.applicableobj = item.applicableobj
                this.$emit('choseCinema',this.applicableobj);
                this.customTree = item.applicableobj
            }
        },
        
        getCinemaStree() {
            this.$ctmList.systemGetUserMenuTree().then(res =>{
                let obj = res.data 
                this.formData(obj,true)
                // console.log(this.key)
                this.defaulKey.push([this.key.menuName]) //默认的key
                this.applicableobj = this.key.applicableobj //默认的请求参数
                this.$nextTick(() => {
                    this.$refs.treeBox.setCurrentKey(this.key.menuName); // value 绑定的node-key
                });
                this.$emit('choseCinema',this.applicableobj);
                this.formData(obj)
                let arr =[]
                arr.push(obj)
                this.dataTree = arr
                // console.log(arr,'--------------')
            })
        },
        //递归重组后台返回的菜单树
        formData(obj,defaulKey) {
            if(obj.sonTree){
                if(obj.cinemas){
                    let item = obj.cinemas
                    for(let j=0; j<item.length; j++){
                        let data = {
                            applicableobj : item[j].first,
                            menuName:item[j].second,
                        }
                        if(defaulKey) {
                            console.log('-----------默认key-------------------',data.applicableobj)
                            this.key = data
                            return 
                        }
                        obj.sonTree.push(data)
                    }
                }
                for(let i = 0; i < obj.sonTree.length; i++){
                    let item = obj.sonTree[i];
                    if(item.sonTree){
                        this.formData(item,defaulKey)
                    }
                }
            }
        },
    },
    created() {
        this.getCinemaStree()
    }
}
</script>
<style lang="scss">
.systemStree{
    .tree{
        overflow-x: scroll;
    }
    .el-tree {
        min-width: 100%;
        display:inline-block !important;
    }
    .el-radio__label{
        padding: 0;
    }
    .el-tree-node{
        background: #f5f5f5;
    }
}

</style>


