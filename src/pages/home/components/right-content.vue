<!--
 * @Author: dfh
 * @Date: 2024-09-23 17:31:05
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
  <scroll-view scroll-y class="content-right">
    <view
      class="content-right-item"
      v-for="item in list"
      :key="item.id"
      @click="navigateHandle(item)"
    >
      <image :src="$filters.formateImage(item.image)" class="img" />
      <view class="flex flex-col ml-12">
        <text class="txt-black-50 txt-26">{{ item.name }}</text>
        <text
          class="txt-black-153 txt-22 txt-ellipsis my-10"
          style="width: 300rpx"
          >{{ item.description }}</text
        >
        <text class="txt-black-153 txt-22">月销：{{ item.monthSales }}</text>
        <view class="flex ai-center jc-between mt-10">
          <text class="txt-red-233 txt-22">￥{{ item.price }}</text>
          <AddDish :flavors="item.flavors" :item="item" type="content" />
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import AddDish from "./add-dish.vue";
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const navigateHandle = (item) => {
  uni.navigateTo({ url: `/pages/home/detail?item=${JSON.stringify(item)}` });
};
</script>

<style lang="scss" scoped>
.content-right {
  padding-top: 80rpx;
  width: calc(100vw - 164rpx);
  height: 100%;
  padding-left: 10px;
  box-sizing: border-box;
  overflow: hidden;

  &-item {
    margin-bottom: 16rpx;
    display: flex;
    flex-direction: row;

    &:last-child {
      padding-bottom: 120rpx;
    }

    .img {
      width: 172rpx; //86
      height: 172rpx; //86
      overflow: hidden;
      border-radius: 16rpx;
      object-fit: cover;
    }
  }
}
</style>
