<template>
    <div class="cart-dialog">
        <el-dialog
            title="数量"
            :visible.sync="showStatus"
            :modal-append-to-body='false'
            :append-to-body="false"
            width="45%"
            :close-on-click-modal=false
            center>
            <div class="cart-numberboard">
                <el-input v-model="number" placeholder="请输入数量" />
                <KeyBoadr v-model="number" @keynumber="keynumber" ref="keyboard"></KeyBoadr>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showStatus = false">取消</el-button>
                <el-button @click="comfirmNumber">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import KeyBoadr from 'src/components/numberKeyBoard'
import {mapMutations , mapGetters} from 'vuex'
import {SHOW_CART_KEYBOARD , SET_CART_NUMBER} from 'types'
import { VM_CART_NUMBER_CHANGE } from 'types/vmOnType'
export default {
    components:{ KeyBoadr },
    data() {
        return {
            number:''
        }
    },
    computed: {
        ...mapGetters([
            "showCartKeyBoard",
            "cartGoodlistIndex",
            "cartDatalist"
        ]),
        showStatus: {
            get() {
                
                return this.showCartKeyBoard
            },
            set(vel) {
                this.SHOW_CART_KEYBOARD()
            }
        },

    },
    mounted(){
        
    },
    watch:{
        showStatus(newValue){
            if(!newValue) return
            if(this.cartDatalist.length){
                this.number =  this.cartDatalist[this.cartGoodlistIndex].saleNum
            }
        }
    },
    methods: {
        ...mapMutations([
            SHOW_CART_KEYBOARD,
            SET_CART_NUMBER
        ]),
        keynumber(val) {
            this.number =val
        },
        comfirmNumber() {
            if(!this.number || this.number < 1) return this.$message.warning('数量不能小于1！');
            this.SHOW_CART_KEYBOARD(this.cartGoodlistIndex);
            this.$vm.$emit('VM_CART_NUMBER_CHANGE',this.number)
            // this.SET_CART_NUMBER(this.number)
            this.number=""
        },

    }
}
</script>
<style lang="scss">
.cart-numberboard{
    width: 24vw;
    margin: 0 auto;
    .el-input{
        height: 4.2vh;
        margin-bottom: 10%;
    }
}
.cart-dialog{
    .el-dialog__header{
        text-align: left;
        span{font-size: $font-size16};
    }
}
</style>

