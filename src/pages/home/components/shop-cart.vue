<!--
 * @Author: dfh
 * @Date: 2024-09-24 09:37:19
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
  <view class="cart-wrap" v-if="visible" @click="hide">
    <view class="cart">
      <view class="cart-header">
        <text class="txt-28 txt-black-50">购物车</text>
        <view class="flex ai-center">
          <text class="iconfont icon-shanchu"></text>
          <text class="txt-black-100 txt-24 ml-10" @click="onCleanAllCart"
            >清空</text
          >
        </view>
      </view>
      <scroll-view scroll-y class="cart-list" @click.stop="">
        <view
          class="cart-list-item"
          v-for="item in cartStore.cartList"
          :key="item.id"
        >
          <image :src="$filters.formateImage(item.image)" class="img" />
          <view class="flex flex-col jc-between flex-1 ml-20">
            <text class="txt-black-50 txt-32 txt-w-7">{{ item.name }}</text>
            <view class="flex ai-center jc-between mt-20">
              <view class="flex">
                <text class="txt-yellow-225 txt-24 mt-8">￥</text>
                <text class="txt-yellow-225 txt-32 txt-w-7">{{
                  item.amount
                }}</text>
              </view>
              <AddDish :item="item" type="shopCart" />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import AddDish from "./add-dish.vue";
import { useCartStore } from "@/store/cart";
import { useHomeStore } from "@/store/home";

const homeStore = useHomeStore();
const cartStore = useCartStore();

const visible = ref(false);

const show = () => {
  visible.value = true;
};

const hide = () => {
  visible.value = false;
};

const onCleanAllCart = () => {
  cartStore.cleanCart(homeStore.sitNum);
};

defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
.cart-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);

  .cart {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 600rpx;
    background-color: white;
    border-radius: 30rpx 30rpx 0rpx 0rpx;
    padding: 20rpx 30rpx 0;
    box-sizing: border-box;

    &-header {
      width: 100%;
      height: 80rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    &-list {
      width: 100%;
      height: 420rpx;

      &-item {
        margin-top: 20rpx;
        display: flex;
        flex-direction: row;
        align-items: center;

        .img {
          width: 128rpx;
          height: 128rpx;
          object-fit: contain;
          border-radius: 20rpx;
          overflow: hidden;
        }

        .icon-jianshao,
        .icon-zengjia {
          color: rgba(225, 163, 72, 1);
        }
      }
    }
  }
}
</style>
