<!--
 * @Author: dfh
 * @Date: 2024-09-18 08:27:52
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<!--
 * @Author: dfh
 * @Date: 2024-09-18 08:27:52
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
  <view class="container">
    <HeaderWidget :shopInfo="homeStore.shopInfo" />
    <view class="content">
      <LeftMenuList
        :menuList="leftNavList"
        @onMenuItemChange="onMenuItemChange"
      />
      <RightContent :list="list" />
    </view>
    <view class="bottom-wrap">
      <text class="iconfont icon-caipinguanli"></text>
      <view class="flex ai-center" style="margin-left: 120rpx">
        <text class="txt-26 txt-w-7 txt-white-255 mt-12">￥</text>
        <text class="txt-52 txt-w-7 txt-yellow-225">{{
          cartStore.totalAomunt
        }}</text>
      </view>
      <button
        class="submit"
        :disabled="cartStore.totalCartNum == 0"
        @click="paymentHandle"
      >
        去下单
      </button>
      <view
        class="dot-wrap"
        @click="onDopClick"
        v-if="cartStore.totalCartNum > 0"
        >{{ cartStore.totalCartNum }}
      </view>
      <!-- <view class="iconfont icon-caipinguanli"></view> -->
    </view>
    <!-- 购物车 -->
    <ShopCart ref="shopCartRef" />
    <!-- 口味选择 -->
    <FlavorSelect />
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import HeaderWidget from "./components/header-widget.vue";
import LeftMenuList from "./components/left-menu-list.vue";
import RightContent from "./components/right-content.vue";
import ShopCart from "./components/shop-cart.vue";
import FlavorSelect from "./components/flavor-select.vue";
import { useHomeStore } from "@/store/home";
import { useCartStore } from "@/store/cart";
import {
  fetchCategoryList,
  fetchDishList,
  fetchSetmealList,
} from "@/services/home";
import { payment, submit } from "@/services/order";
const leftNavList = ref([]);
const list = ref([]);
const shopCartRef = ref(null);
const homeStore = useHomeStore();
const cartStore = useCartStore();

onLoad(() => {
  homeStore.getShopInfo();
  homeStore.getTokenActive(() => {
    getCategoryList();
    getCartList();
  });
});

//获取分类列表
const getCategoryList = async () => {
  const { code, data, msg } = await fetchCategoryList();
  if (code == 1) {
    leftNavList.value = data || [];
    if (data && data.length > 0) {
      const { id, type } = data[0];
      homeStore.setType(type);
      getDishOrSeteamlList(type, id);
    }
  } else {
    uni.showToast({
      title: msg,
      icon: "none",
    });
  }
};

//获取菜品或套餐列表
const getDishOrSeteamlList = async (type, categoryId) => {
  let func = type == 1 ? fetchDishList : fetchSetmealList;
  const { code, data, msg } = await func(categoryId);
  if (code == 1) {
    list.value = data;
  } else {
    uni.showToast({
      title: msg,
      icon: "none",
    });
  }
};

//查询购物车数据
const getCartList = async () => {
  cartStore.getCartList(1);
};

const onDopClick = () => {
  shopCartRef.value.show();
};

const onMenuItemChange = (index) => {
  const { type, id } = leftNavList.value[index];
  homeStore.setType(type);
  getDishOrSeteamlList(type, id);
};

//下单
const paymentHandle = async () => {
  const { code, msg, data } = await submit({
    //1：微信，2：支付宝
    payMethod: 1,
    remark: "",
    amount: cartStore.totalAomunt,
    sitNum: homeStore.sitNum,
  });

  if (code === 1) {
    homeStore.setOrderId(data.id);
    homeStore.setOrderNumber(data.number);

    cartStore.getCartList(homeStore.sitNum);

    uni.navigateTo({
      url: `/pages/order/detail?id=${data.id}&amount=${data.orderAmount}&orderNumber=${data.orderNumber}&payStatus=0`,
    });
  } else {
    uni.showToast({
      title: msg,
      icon: "icon",
    });
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: aliceblue;
  display: flex;
  flex-direction: column;

  .content {
    display: flex;
    flex-direction: row;
    background-color: white;
    width: 100%;
    height: calc(100vh - 305rpx);
    box-sizing: border-box;
    overflow: hidden;
  }

  .bottom-wrap {
    position: fixed;
    left: 5%;
    right: 5%;
    bottom: 20rpx;
    background-color: black;
    width: 90%;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    // .dian-can {
    //   position: absolute;
    //   left: 10rpx;
    //   top: -40rpx;
    //   width: 140rpx;
    //   height: 140rpx;
    // }

    .icon-caipinguanli {
      position: absolute;
      left: 40rpx;
      top: 0rpx;
      font-size: 70rpx;
      color: rgba(225, 163, 72, 1);
    }

    .submit {
      padding: 0 24rpx;
      background-color: rgba(225, 163, 72, 1);
      height: 60rpx;
      border-radius: 30rpx;
      margin-right: 20rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      color: white;
    }

    .submit[disabled] {
      background-color: #ccc;
    }

    // .icon-caipinguanli {
    //   position: absolute;
    //   right: 10rpx;
    //   bottom: 88rpx;
    //   font-size: 100rpx;
    //   color: #fa709a;
    // }

    .dot-wrap {
      position: absolute;
      left: 90rpx;
      top: -20rpx;
      font-size: 20rpx;
      width: 40rpx;
      height: 40rpx;
      color: white;
      text-align: center;
      line-height: 40rpx;
      background-color: red;
      border-radius: 50%;
    }
  }
}
</style>
