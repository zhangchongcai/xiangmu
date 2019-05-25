<template>
    <div>
        <div class="flat">
            <p class="title">
                <i class="el-icon-menu"></i>
                <span><strong>我的常用功能</strong></span>
                <span>(可拖动调整顺序)</span>
            </p>
            <ul class="list">
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
            </ul>
        </div>
        <div class="xian"></div>
        <div class="flat">
            <p class="title">
                <i class="el-icon-time"></i>
                <span><strong>最近访问</strong></span>
                <span>(可将最近访问的功能添加到上方常用功能区)</span>
            </p>
            <ul class="list">
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
                <li><i class="yuan"></i>用户管理</li>
            </ul>
        </div>
    </div>
</template>

<script>
  export default {
    name: "addMenu"
  }
</script>

<style lang="scss" scoped>
    .flat{
        padding-left: 20px;
        padding-top: 20px;
        .title{
            height: 19px;
            line-height: 19px;
            .el-icon-menu{
                font-size: 18px;
                color: #3B74FF;
            }
            span:first-child{
                width: 23%;
                font-size: 14px;
                color: #333;
            }
            span:last-child{
                font-size: 14px;
                color: #c5c5c5;
            }
        }
        .list{
            width: 100%;
            display: flex;
            padding-top: 30px;
            justify-content: flex-start;
            flex-wrap: wrap;
            li{
                width: 25%;
                height: 34px;
                line-height: 19px;
                color: #666;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                .yuan{
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 4px;
                    border: 1px solid #000;
                    margin-right: 10px;
                }
            }
        }
    }
    .xian{
        width: 100%;
        height: 1px;
        background: #F5F5F5;
        margin: 40px 0 20px;
    }

</style>
