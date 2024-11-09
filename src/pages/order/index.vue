<!--
 * @Author: dfh
 * @Date: 2024-09-26 09:22:07
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
  <view class="container">
    <view class="tab-wrap">
      <view
        class="tab-item"
        v-for="(item, index) in tabList"
        :key="index"
        @click="onTabChange(index)"
      >
        <text class="tab" :class="index == currentIdx ? 'active' : ''">{{
          item
        }}</text>
        <view class="line" :class="index == currentIdx ? 'active' : ''"></view>
      </view>
    </view>
    <scroll-view
      class="scroll"
      scroll-y
      v-if="orderList && orderList.length > 0"
      refresher-enabled="true"
      :refresher-triggered="triggered"
      :refresher-threshold="100"
      refresher-background="#F5F6F8"
      @refresherrefresh="onRefreshHandle"
      @refresherrestore="onRestoreHandle"
      @scrolltolower="onLoadMoreHandle"
    >
      <view
        class="card"
        v-for="item in orderList"
        :key="item.id"
        @click="navigateToDetail(item)"
      >
        <image :src="$filters.formateImage(item.image)" class="img" />
        <view class="flex flex-col ml-14 flex-1">
          <view class="flex ai-center jc-between">
            <text class="txt-black-50 txt-24 txt-ellipsis">{{
              item.names
            }}</text>
            <view
              class="btn"
              v-if="item.status == 4 && item.isComment == 0"
              @click.stop="navigateTo(item)"
              >评论</view
            ><view
              class="btn"
              v-if="item.payStatus == 0"
              @click.stop="navigateToDetail(item)"
              >去支持</view
            >
            <view
              class="btn"
              v-if="item.payStatus == 1 && item.status < 4"
              @click.stop="navigateTo(item)"
              >排队</view
            >
          </view>
          <view class="flex ai-center jc-between mt-10">
            <view class="flex ai-center">
              <text class="txt-28 txt-yellow-225 mt-8">￥</text>
              <text class="txt-34 txt-yellow-225 txt-w-6">{{
                item.amount
              }}</text>
            </view>
            <text class="txt-black-100 txt-22">{{ item.orderTime }}</text>
          </view>
        </view>
        <!-- 
        订单状态 1排队 2做餐 3出餐 4完成 5取消 6已退款 7已评论 
        支付状态 0未支付 1已支付 2退款
        -->
        <view class="status red" v-if="item.status == 6">已退款</view>
        <view class="status gray" v-else-if="item.status == 5">已取消</view>
        <view class="status blue" v-else-if="item.status == 4">已完成</view>
        <view class="status orange" v-else-if="item.payStatus == 0"
          >待付款</view
        >
        <view class="status yellow" v-else-if="item.isComment == 1"
          >已评论</view
        >
      </view>
    </scroll-view>
    <view class="empty-wrap" v-else>
      <EmptyWidget />
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { fetchOrderList } from "@/services/order";
import { onLoad } from "@dcloudio/uni-app";
import EmptyWidget from "@/components/empty-widget.vue";

// 订单状态 1排队 2做餐 3出餐 4完成 5取消 6已退款 7已评论
const tabList = ["全部", "已完成", "已取消", "已退款"];
const currentIdx = ref(0);
const orderList = ref([]);
const currentPage = ref(1);
const total = ref(0);
const openId = ref("");

const triggered = ref(false);
const reachBottom = ref(false);

onLoad(() => {
  getOrderList();
});
const onTabChange = (idx) => {
  if (idx == currentIdx.value) return;
  currentIdx.value = idx;
  getOrderList();
};

//下拉刷新
const onRefreshHandle = () => {
  console.log("--->下拉刷新");
  reachBottom.value = false;
  triggered.value = true;
  currentPage.value = 1;
  orderList.value = [];
  getOrderList();
};

//下拉复位
const onRestoreHandle = () => {
  triggered.value = false;
  console.log("--->下拉复位");
};

//加载更多
const onLoadMoreHandle = () => {
  console.log("---加载更多");
  if (orderList.value.length >= total.value) {
    return;
  }
  currentPage.value = currentPage.value + 1;
  getOrderList();
};

//获取订单列表
const getOrderList = async () => {
  const { code, msg, data } = await fetchOrderList(
    currentPage.value, //当前页
    30, //每页多少条数据
    // 订单状态 1排队 2做餐 3出餐 4完成 5取消 6已退款 7已评论
    // const tabList = ["全部","已完成", "已取消", "已退款"];
    currentIdx.value == 1
      ? 4
      : currentIdx.value == 2
      ? 5
      : currentIdx.value == 3
      ? 6
      : currentIdx.value //当前状态
  );
  uni.stopPullDownRefresh();
  if (code == 1) {
    orderList.value = (data.records || []).map((item) => ({
      ...item,
      names: (item.orderDetailList || []).map((item) => item.name).join(","),
      image:
        item.orderDetailList && item.orderDetailList.length > 0
          ? item.orderDetailList[0].image
          : "@/static/images/noImg.png",
    }));
    console.log("-->", orderList.value);
    total.value = data.total;
  } else {
    uni.showToast({ title: msg, icon: "none" });
  }
};

const navigateTo = (item) => {
  let url = "";
  if (item.status == 4) {
    url = `/pages/evaluate/index?openId=${openId.value}&item=${JSON.stringify(
      item
    )}`;
  } else {
    url = `/pages/queue/index?orderId=${item.id}`;
  }
  uni.navigateTo({ url });
};
const navigateToDetail = (item) => {
  uni.navigateTo({
    url: `/pages/order/detail?id=${item.id}&amount=${item.amount}&orderNumber=${item.number}&payStatus=${item.payStatus}`,
  });
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;

  .tab-wrap {
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    width: 100%;
    height: 80rpx;
    box-sizing: border-box;
    background-color: white;

    .tab-item {
      width: 140rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      flex-direction: column;

      .tab {
        height: 74rpx;
        line-height: 74rpx;
        font-size: 30rpx;
        color: rgba(153, 153, 153, 1);
        font-weight: 400;

        &.active {
          font-size: 32rpx;
          font-weight: 600;
          color: rgba(225, 163, 72, 1);
        }
      }

      .line {
        width: 60rpx;
        height: 4rpx;
        border-radius: 2rpx;
        background-color: transparent;

        &.active {
          background-color: rgba(225, 163, 72, 1);
        }
      }
    }
  }

  .scroll {
    width: 100%;
    height: calc(100% - 80rpx);
    display: flex;
    flex-direction: column;
    background-color: rgba(204, 204, 204, 0.3);

    .card {
      position: relative;
      margin-top: 20rpx;
      width: 92%;
      padding: 20px 14rpx;
      margin-left: 4%;
      background-color: white;
      border-radius: 20rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      // justify-content: space-between;

      .status {
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 0rpx 20rpx 0 20rpx;
        width: 100rpx;
        height: 40rpx;
        font-size: 20rpx;
        color: white;
        text-align: center;
        line-height: 40rpx;

        &.gray {
          background-color: #ccc;
        }

        &.red {
          background-color: rgb(233, 78, 60);
        }

        &.orange {
          background-color: rgba(253, 101, 65, 1);
        }

        &.blue {
          background-color: rgba(56, 103, 255, 1);
        }
        &.yellow {
          background-color: rgba(225, 163, 72, 1);
        }
      }

      .img {
        width: 120rpx;
        height: 120rpx;
        object-fit: cover;
        border-radius: 20rpx;
      }

      .btn {
        width: 90rpx;
        height: 50rpx;
        border-radius: 10rpx;
        text-align: center;
        line-height: 50rpx;
        background: rgb(239, 223, 105);
        color: black;
        font-size: 24rpx;
      }
    }
  }

  .empty-wrap {
    width: 100%;
    height: calc(100% - 80rpx);
    background-color: rgba(204, 204, 204, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
