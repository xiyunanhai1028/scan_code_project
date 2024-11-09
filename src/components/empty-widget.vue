<template>
    <view class="container">
        <text class="iconfont icon-no_data"></text>
        <text class="txt-black-100 txt-26 mt-20">暂无数据</text>
    </view>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 400rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .icon-no_data {
        font-size: 80rpx;
        color: rgba(153, 153, 153, 1);
    }
}
</style>