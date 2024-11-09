<!--
 * @Author: dfh
 * @Date: 2024-09-18 17:14:14
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
  <view class="container">
    <view class="header">
      <image src="/static/images/mainBg.png" class="header-img" />
    </view>
    <view class="time-line">
      <view class="time-line-item">
        <view class="dot"></view>
        <view class="flex flex-col ml-20">
          <view class="flex ai-center">
            <text class="txt-black-50 txt-28 txt-w-6">排队中</text>
            <text
              class="txt-red-233 txt-30 txt-w-6"
              v-if="queueInfo.queueNum > 0"
              >（当前排队人数：{{ queueInfo.queueNum }}）</text
            >
          </view>
          <view class="flex ai-center mt-20">
            <image src="/static/images/time.png" class="time" />
            <text class="txt-black-black-102 txt-22 mt-10"
              >由于聚餐内容多，您当前处于排队中，请耐心等待...</text
            >
          </view>
        </view>
      </view>
      <view class="time-line-item" @click="onStatusChange(1)">
        <view class="dot"></view>
        <view class="flex flex-col ml-20">
          <text class="txt-black-50 txt-28 txt-w-6">菜品准备中</text>
          <view class="flex ai-center mt-20">
            <image src="/static/images/time.png" class="time" />
            <text class="txt-black-black-102 txt-22 mt-10"
              >您点的菜品已在锅里，大厨正在为您精心烹饪...</text
            >
          </view>
        </view>
      </view>
      <view class="time-line-item">
        <view class="dot"></view>
        <view class="flex flex-col ml-20">
          <text class="txt-black-50 txt-28 txt-w-6">准备上菜</text>
          <view class="flex ai-center mt-20">
            <image src="/static/images/time.png" class="time" />
            <text class="txt-black-black-102 txt-22 mt-10"
              >菜品已就绪，您可以自行取餐或等待服务员送餐...</text
            >
          </view>
        </view>
      </view>
      <view class="move-card" :style="{ top: topVal + 'rpx' }"></view>
    </view>
    <button
      class="cancel-btn"
      v-if="queueInfo.status == 1"
      @click="onOrderCancelHandle"
    >
      取消订单
    </button>
  </view>
</template>

<script setup>
import { onUnmounted, ref } from "vue";
import { orderCancel, fetchOrder } from "@/services/order";
import { useHomeStore } from "@/store/home";
import { onLoad } from "@dcloudio/uni-app";
import { onReady } from "@dcloudio/uni-app";
import { fetchQueueInfo } from "@/services/queue";

const homeStore = useHomeStore();
const topVal = ref(0);
const orderId = ref("");
const queueInfo = ref({
  queueNum: 0,
  status: 1,
});

const onStatusChange = (index) => {
  topVal.value = 180 * index;
};

onLoad((options) => {
  // console.log("options.orderId-->", options.orderId);
  // orderId.value = options.orderId;
  getOrderInfo();
});

const getOrderInfo = async () => {
  const { code, msg, data } = await fetchOrder(homeStore.sitNum);
  console.log("排队数据-->", data);
  if (code == 1) {
    orderId.value = data.id;
  } else {
    uni.showToast({ title: msg, icon: "none" });
  }
};

let interval = null;
onReady(() => {
  if (interval != null) clearInterval(interval);
  interval = setInterval(getQueueInfo, 3000);
});

const getQueueInfo = async () => {
  const { code, msg, data } = await fetchQueueInfo(orderId.value);
  console.log("排队数据-->", data);
  if (code == 1) {
    queueInfo.value = data;
    if (queueInfo.value.status == 1) {
      onStatusChange(0);
    } else if (queueInfo.value.status == 2) {
      onStatusChange(1);
    } else if (queueInfo.value.status == 3) {
      onStatusChange(2);
    } else {
      uni.redirectTo({ url: "/pages/home/index" });
    }
  } else {
    uni.showToast({ title: msg, icon: "none" });
  }
};

onUnmounted(() => {
  if (interval != null) clearInterval(interval);
});
// onMounted(() => {
//   const clientId = Math.random().toString(32).slice(2);
//   uni.connectSocket({
//     url: WEB_SOCKET_URL + "/" + clientId,
//   });
//   uni.onSocketOpen(function (res) {
//     console.log("WebSocket连接已打开！");
//     uni.sendSocketMessage({ data: `${orderId.value}` });
//   });
//   uni.onSocketError(function (res) {
//     console.log("WebSocket连接打开失败，请检查！", res);
//   });
//   uni.onSocketMessage(function (res) {
//     console.log("收到服务器内容：" + res.data);
//     data.value = {
//       ...JSON.parse(res.data),
//     };
//     const { type } = data.value;
//     if (type == 4) {
//       //4的情况才是排队所需
//     }
//     // const { status } = data.value;
//     // if (status == 2) {
//     //   onStatusChange(1);
//     // } else if (status == 1) {
//     //   onStatusChange(2);
//     // } else {
//     //   if (status != 3) {
//     //     uni.redirectTo({ url: "/pages/home/index" });
//     //   }
//     // }
//   });
// });

//取消订单
const onOrderCancelHandle = () => {
  uni.showModal({
    title: "取消订单",
    content: "取消订单后您将不能正常就餐，确定要取消嘛？",
    cancelText: "取消",
    confirmText: "确定",
    success: async (res) => {
      if (res.confirm) {
        // const openId = homeStore.getOpenId();
        const { code, msg } = await orderCancel(orderId.value);
        // const { code, msg } = await orderCancel({
        //   sitNum: homeStore.sitNum, //桌位号
        //   id: orderId.value, //订单ID
        //   openId, //openId
        // });
        if (code == 1) {
          uni.showToast({ title: "订单已取消", icon: "none" });
          uni.reLaunch({ url: "/pages/home/index" });
        } else {
          uni.showToast({ title: msg, icon: "none" });
        }
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;

  .header {
    &-img {
      width: 100%;
      height: 350rpx;
      object-fit: contain;
    }
  }

  .time-line {
    position: relative;
    border-left: 2rpx dashed #ccc;
    width: 80%;
    height: 600rpx;
    margin-left: 10%;

    &-item {
      height: 180rpx;
      display: flex;
      align-items: center;

      .dot {
        margin-left: -10rpx;
        width: 20rpx;
        height: 20rpx;
        border-radius: 10rpx;
        background-color: rgba(225, 163, 72, 1);
        box-shadow: 3rpx 4rpx 30rpx rgba(225, 163, 72, 1);
      }

      .time {
        margin-top: 6rpx;
        width: 30rpx;
        height: 30rpx;
        object-fit: contain;
        margin-right: 10rpx;
      }
    }

    .move-card {
      position: absolute;
      left: -50rpx;
      right: -50rpx;
      top: 0;
      height: 180rpx;
      border-radius: 20rpx;
      background-color: rgba(225, 163, 72, 0.3);
    }
  }

  .cancel-btn {
    position: fixed;
    bottom: 40rpx;
    left: 5%;
    right: 5%;
    width: 90%;
    height: 80rpx;
    background-color: rgba(225, 163, 72, 1);
    border-radius: 20rpx;
    color: white;
    font-size: 32rpx;
    line-height: 80rpx;
  }
}
</style>
