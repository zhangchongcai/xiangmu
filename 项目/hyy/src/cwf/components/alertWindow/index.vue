<template>
<div class="alert-window">
    <iframe :src="alertBaseConfig.src" frameborder="0" :width="alertShowConfig.width" :height="alertShowConfig.height"></iframe>
</div>
</template>

<script>
export default {
    props: {
        /**
         * @param {Object} config - 唤起弹窗配置信息
         * @param {String} config.src - 唤起弹窗地址
         * @param {Object} config.param - 需要传递给弹窗的必要参数
         * @param {String} config.callFnName - 弹窗回调名称
         */
        config: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            alertShowConfig: {
                width: '0px',
                height: '0px'
            },
            alertBaseConfig: {
                src: ''
            },
            /**
             * 唯一callFnName
             */
            callFnNameId: ''
        }
    },
    created() {
        /* 设置弹窗页面显示大小 */
        let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.alertShowConfig = {
            width,
            height
        };

        /* 初次设置弹窗src */
        let config = this.config;
        let callFnNameId = this.onlyID(config.callFnName);
        this.callFnNameId = callFnNameId;
        this.setBaseConfig(config);

        /* 注册消息 */
        window.distributeMessage.addMessage({
            name: callFnNameId,
            fn: this.emitCallFn
        });

    },
    destroyed() {
        /* 注销消息 */
        let messageName = this.callFnNameId;
        window.distributeMessage.removeMessage(messageName);
    },
    methods: {
        /**
         * @function setBaseConfig - 设置弹窗地址，拼接参数
         * @param {Object} config - 唤起弹窗配置信息
         * @param {String} config.src - 唤起弹窗地址
         * @param {Object} config.param - 需要传递给弹窗的必要参数
         * @param {String} config.callFnName - 弹窗回调名称
         */
        setBaseConfig(config) {
            let src = config.src;
            let param = config.param;
            let callFnName = this.callFnNameId;
            let isNullParam = param ? JSON.stringify(param) == '{}' ? true : false : true;
            let paramSrc = '?';
            if (!isNullParam) {
                 paramSrc += `param=${JSON.stringify(param)}&`;
            }

            paramSrc += `callFnName=${callFnName}`;

            this.alertBaseConfig.src = encodeURI(src + paramSrc);
        },
        /**
         * @function emitCallFn - 触发弹窗回调，传递参数
         */
        emitCallFn(param) {
            param.callFnName = this.config.callFnName;
            this.$emit('alertCallBack', param);
        },
        /**
         * @function onlyID - 设置callFnName唯一算法
         * @param {String} name - callFnName
         */
        onlyID(name) {
            let timestamp = Date.parse(new Date());
            return `${name}_${timestamp}`;
        }
    }
}
</script>

<style lang="postcss" scoped>
.alert-window {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 999;
}
</style>
