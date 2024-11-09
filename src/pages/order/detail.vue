<!--
 * @Author: dfh
 * @Date: 2024-10-31 16:39:13
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
  <view class="container">
    <view class="card flex">
      <image :src="$filters.formateImage(shopInfo.image)" class="shop-img" />
      <view class="flex flex-col ml-30 jc-between">
        <text class="txt-black-51 txt-28 txt-w-6">{{ shopInfo.name }}</text>
        <text class="txt-black-100 txt-24">{{ shopInfo.address }}</text>
        <text class="txt-black-100 txt-24"
          >营业时间：{{ shopInfo.beginTime }} 至 {{ shopInfo.endTime }}</text
        >
      </view>
    </view>
    <view class="card flex flex-col">
      <view class="sit-wrap">
        <text class="txt-black-51 txt-30 txt-w-6 ml-10">桌位号：</text>
        <text class="txt-orange-254 txt-34 txt-w-6">{{
          homeStore.sitNum
        }}</text>
      </view>
      <view
        class="flex jc-between ai-center mt-20 ml-10"
        v-for="item in orderDetailList"
        :key="item.id"
      >
        <text class="txt-black-100 txt-26">{{ item.name }}</text>
        <text class="xt-black-100 txt-26">x{{ item.number }}</text>
      </view>
      <view class="flex jc-between ai-center mt-40 ml-10">
        <text class="txt-black-100 txt-26">总结金额：</text>
        <text class="txt-orange-254 txt-26 txt-w-6">{{ amount }}/元</text>
      </view>
    </view>
    <view class="bottom-wrap">
      <view class="flex ai-center">
        <text class="txt-40 txt-red-233 txt-w-7">{{ amount }}</text>
        <text class="txt-26 txt-black-51">/元</text>
      </view>
      <view class="btn btn-orange" @click="paymentHandle" v-if="payStatus == 0"
        >去结算</view
      >
    </view>
  </view>
</template>

<script setup>
import { useHomeStore } from "@/store/home";
import { onLoad } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import { fetchOrderDetail, payment } from "@/services/order";
const homeStore = useHomeStore();
const shopInfo = computed(() => homeStore.shopInfo);
const orderDetailList = ref([]);
const amount = ref(0);
const orderNumber = ref("");
const payStatus = ref("");
onLoad((options) => {
  amount.value = options.amount;
  orderNumber.value = options.orderNumber;
  payStatus.value = options.payStatus;
  getOrderDetail(options.id);
});

const getOrderDetail = async (id) => {
  const { code, data, msg } = await fetchOrderDetail(id);
  if (code == 1) {
    orderDetailList.value = data || [];
  } else {
    uni.showToast({
      title: msg,
      icon: "none",
    });
  }
};

//去结算
const paymentHandle = async () => {
  const { code, msg, data } = await payment({
    // sitNum: homeStore.sitNum,
    orderNumber: orderNumber.value,
    payMethod: 1,
    amount: amount.value,
  });
  if (code == 1) {
    uni.requestPayment({
      provider: "wxpay",
      // orderInfo: prepayId,//支付宝需要
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr, //随机码小于32位
      package: data.packageStr, //预支付ID
      signType: data.signType,
      paySign: data.paySign,
      success() {
        // uni.reLaunch({ url: "/pages/home/index" });
        uni.redirectTo({
          url: `/pages/queue/index?orderId=${orderNumber.value}`,
        });
      },
      fail(error) {
        error.errMsg = error.errMsg.replace("requestPayment:fail", "");
        error.errMsg = error.errMsg.includes("cancel")
          ? "您已取消支付"
          : error.errMsg;
        uni.showToast({ title: error.errMsg, icon: "none" });
      },
    });
  } else {
    uni.showToast({
      title: msg,
      icon: "none",
    });
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-color: aliceblue;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  .card {
    margin: 30rpx 4% 0rpx;
    width: 92%;
    padding: 20rpx;
    border-radius: 10rpx;
    background-color: white;
    box-sizing: border-box;
    .shop-img {
      width: 140rpx;
      height: 140rpx;
    }
    .sit-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 60rpx;
      border-left: 6rpx solid rgba(225, 163, 72, 1);
      box-sizing: border-box;
      line-height: 60rpx;
      padding-left: 10rpx;
      margin-bottom: 10rpx;
    }
  }
  .bottom-wrap {
    position: fixed;
    left: 0rpx;
    right: 0rpx;
    bottom: 0rpx;
    width: 100%;
    height: 120rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    box-sizing: border-box;
    padding: 0 30rpx;
    .btn {
      height: 80rpx;
      width: 300rpx;
      text-align: center;
      border-radius: 40rpx;
      color: white;
      font-size: 30rpx;
      line-height: 80rpx;
      background-color: rgba(253, 101, 65, 1);
    }
  }
}
</style>
