<!--
 * @Author: dfh
 * @Date: 2024-09-24 10:33:50
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
  <view class="container" v-if="data && data.length > 0">
    <view class="card">
      <view class="flex jc-center txt-black-50">{{
        cartStore.selectItem.name
      }}</view>
      <view v-for="(item, index) in data" :key="index">
        <view class="txt-black-100 txt-30 mt-30">{{ item.name }}</view>
        <view class="flavor-wrap">
          <text
            class="flavor-item"
            :class="dishFlavor.indexOf(flavor) > -1 ? 'active' : ''"
            v-for="(flavor, i) in item.flavors"
            :key="i"
            @click="onItemClick(flavor)"
            >{{ flavor }}</text
          >
        </view>
      </view>
      <view class="flex flex-1 ai-center jc-between mt-30">
        <view class="flex ai-center">
          <text class="txt-red-233 txt-26 mt-6">￥</text>
          <text class="txt-red-233 txt-40 txt-w-6">{{
            cartStore.selectItem.price
          }}</text>
        </view>
        <view class="btn" @click="addCart">加入购物车</view>
      </view>
      <text class="iconfont icon-close" @click="onClose"></text>
    </view>
  </view>
</template>

<script setup>
import { useCartStore } from "@/store/cart";
import { useHomeStore } from "@/store/home";
import { effect, ref } from "vue";
const data = ref([]);

const cartStore = useCartStore();
const homeStore = useHomeStore();

const dishFlavor = ref([]);

effect(() => {
  data.value = (
    (cartStore.selectItem && cartStore.selectItem.flavors) ||
    []
  ).reduce((memo, cur) => {
    memo.push({
      ...cur,
      flavors: JSON.parse(cur.value),
    });
    return memo;
  }, []);
});

//添加到购物车
const addCart = () => {
  if (dishFlavor.value == null || dishFlavor.value.length == 0) {
    uni.showToast({ title: "请选择您需要的口味", icon: "none" });
  } else {
    // let openId = homeStore.getOpenId();
    // if (!openId) {
    //     homeStore.getOpenIdActive(addCartFunc)
    // } else {
    //     addCartFunc(openId);
    // }
    addCartFunc();
  }
};

const addCartFunc = () => {
  cartStore.addCartActive({
    ...cartStore.selectItem,
    dishFlavor: JSON.stringify(dishFlavor.value),
    dishId: homeStore.type == 1 ? cartStore.selectItem.id : null,
    setmealId: homeStore.type == 2 ? cartStore.selectItem.id : null,
    sitNum: homeStore.sitNum,
  });
  onClose();
};

const onItemClick = (item) => {
  if (dishFlavor.value.indexOf(item) > -1) {
    dishFlavor.value = dishFlavor.value.filter((flavor) => flavor != item);
  } else {
    dishFlavor.value = [...dishFlavor.value, item];
  }
};
const onClose = () => {
  cartStore.setSelectFlavorsItem({});
  dishFlavor.value = [];
};
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .card {
    position: relative;
    width: 600rpx;
    padding: 30rpx;
    background-color: white;
    border-radius: 20rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .flavor-wrap {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .flavor-item {
        margin-top: 16rpx;
        border-radius: 8rpx;
        border: 2rpx solid rgba(225, 163, 72, 1);
        margin-right: 20rpx;
        font-size: 20rpx;
        text-align: center;
        height: 50rpx;
        line-height: 50rpx;
        padding: 0rpx 20rpx;
        box-sizing: border-box;
        color: rgba(100, 101, 102, 1);

        &.active {
          background-color: rgba(225, 163, 72, 0.6);
        }
      }
    }

    .icon-close {
      position: absolute;
      font-size: 80rpx;
      left: 50%;
      margin-left: -40rpx;
      bottom: -100rpx;
    }
  }

  .btn {
    background-color: rgba(225, 163, 72, 1);
    color: black;
    height: 50rpx;
    font-size: 20rpx;
    text-align: center;
    line-height: 50rpx;
    border-radius: 25rpx;
    padding: 0 20rpx;
  }
}
</style>
