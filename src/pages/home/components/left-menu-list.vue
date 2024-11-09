<template>
    <view class="content-left">
        <view class="content-left-item" v-for="(item, index) in  menuList " :key="item.id"
            :class="index == currentIndex ? 'active' : ''" @click="onMenuItemClick(index)">{{ item.name }}</view>
    </view>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
    menuList: {
        type: Array,
        default: () => []
    }
})

const emits = defineEmits('onMenuItemChange')

const currentIndex = ref(0);

const onMenuItemClick = (index) => {
    if (currentIndex.value == index) return;
    currentIndex.value = index;
    emits('onMenuItemChange', index);
}
</script>

<style lang="scss" scoped>
.content-left {

    padding-top: 80rpx;
    width: 164rpx;
    height: 100%;
    background-color: rgb(246, 246, 246);

    &-item {
        width: 100%;
        height: 90rpx;
        text-align: left;
        line-height: 90rpx;
        color: black;
        font-size: 26rpx;
        padding-left: 20rpx;
        box-sizing: border-box;

        &.active {
            background-color: white
        }
    }
}
</style>