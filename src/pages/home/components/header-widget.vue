<!--
 * @Author: dfh
 * @Date: 2024-09-23 17:21:50
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
  <view class="header">
    <view
      class="order-wrap"
      :style="{
        top: barHeight + 'px',
        height: titleHeight + 'px',
      }"
    >
      <text
        class="iconfont icon-flat-user-order txt-white-255 txt-52"
        @click="navigateTo"
      ></text>
    </view>
    <view class="header-card">
      <text
        class="iconfont icon-shengchanjiagong"
        @click="navigateTo('queue')"
      ></text>
      <view class="flex flex-row ai-center">
        <image
          class="header-card-avator"
          :src="$filters.formateImage(shopInfo.image)"
        />
        <view class="flex flex-col ml-10 flex-1">
          <view class="flex ai-center jc-between">
            <view class="flex ai-center">
              <text class="txt-30 txt-black-50">{{ shopInfo.name }}</text>
              <view class="shop-status ml-10">{{
                shopInfo.status == 1 ? "营业中" : "停业中"
              }}</view>
            </view>
            <text class="ml-6 txt-black-153 txt-24"
              >地址：{{ shopInfo.address }}</text
            >
          </view>
          <view class="flex ai-center mt-10 jc-between">
            <text class="txt-24 txt-black153"
              >营业时间：{{ shopInfo.beginTime }} 至
              {{ shopInfo.endTime }}</text
            >
          </view>
        </view>
      </view>
      <view class="line"></view>
      <view class="txt-black-153 txt-22">
        简介：{{ shopInfo.description }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useHomeStore } from "@/store/home";

const homeStore = useHomeStore();
const shopInfo = computed(() => homeStore.shopInfo);
const barHeight = ref(0);
const titleHeight = ref(0);

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync();
  const { statusBarHeight } = sysInfo;
  const { height, top } = uni.getMenuButtonBoundingClientRect();
  barHeight.value = statusBarHeight;
  titleHeight.value = (top - statusBarHeight) * 2 + height;
});

const navigateTo = (type) => {
  let url = "";
  if (type == "queue") {
    // if (!homeStore.orderId) {
    //   return uni.showToast({ title: "您还未下单，不能查看", icon: "none" });
    // }
    url = `/pages/queue/index?orderId=${homeStore.orderId}`;
  } else {
    url = "/pages/order/index";
  }
  uni.navigateTo({ url });
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  width: 100%;
  height: 305rpx;
  // background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
  background-image: linear-gradient(to bottom, #fa709a 0%, #fee140 100%);
  // background: linear-gradient();
  // background-color: 100% 100%;

  .order-wrap {
    position: absolute;
    left: 5%;
    width: 300rpx;
    display: flex;
    align-items: center;
  }

  &-card {
    position: absolute;
    left: 5%;
    bottom: -60rpx;
    width: 90%;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 10rpx;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 4rpx 4rpx 12rpx rgb(231, 227, 227);

    // background-image: radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%);
    .icon-shengchanjiagong {
      font-size: 80rpx;
      color: #fa709a;
      position: absolute;
      bottom: -30rpx;
      right: 20rpx;
    }

    &-avator {
      width: 90rpx;
      height: 90rpx;
      border-radius: 10rpx;
      margin-right: 10rpx;
    }

    .shop-status {
      padding: 8rpx 12rpx;
      border-radius: 10rpx;
      background-color: rgba(225, 163, 72, 1);
      color: white;
      font-size: 16rpx;
    }
  }

  .line {
    width: 100%;
    height: 2rpx;
    background: rgb(235, 235, 235);
    margin: 16rpx 0 10rpx;
  }
}
</style>
