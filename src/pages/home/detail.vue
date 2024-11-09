<!--
 * @Author: dfh
 * @Date: 2024-09-25 08:33:29
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<!--
 * @Author: dfh
 * @Date: 2024-09-25 08:33:29
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
  <view class="container">
    <view class="header">
      <image
        :src="$filters.formateImage(item.image)"
        class="img"
        mode="widthFill"
      />
      <view
        class="black-wrap"
        :style="{
          top: barHeight + 'px',
          height: titleHeight + 'px',
          width: titleHeight + 'px',
        }"
        @click="goBack"
      >
        <text
          class="iconfont icon-arrow-left-bold txt-white-255 txt-40 txt-w-7"
        ></text>
      </view>
    </view>
    <view class="main-wrap">
      <view class="shop-info">
        <view class="flex ai-center jc-between">
          <view class="flex ai-center">
            <text class="txt-red-233 txt-22 mt-10">￥</text>
            <text class="txt-red-233 txt-40 txt-w-6">{{ item.price }}</text>
          </view>
          <AddDish :item="item" :flavors="item.flavors" />
        </view>
        <view class="my-20 flex ai-center jc-between">
          <text class="txt-40 txt-black-40 txt-w-7">{{ item.name }}</text>
          <text class="txt-24 txt-black-100">月销200+</text>
        </view>
        <view class="txt-22 txt-black-153">{{ item.description }}</view>
      </view>
      <view class="comment-wrap">
        <view class="flex ai-center jc-between mx-30 mt-30">
          <view class="flex ai-center">
            <text class="txt-black-50 txt-30">评价</text>
            <text class="txt-black-153 txt-24">（好评率{{ rigthRate }}%）</text>
          </view>
          <view class="flex ai-center">
            <text class="txt-18 txt-black-153">{{ totalComment }}条评论</text>
            <text
              class="iconfont icon-arrow-right-bold txt-black-153 txt-22"
            ></text>
          </view>
        </view>
        <scroll-view
          class="scroll"
          scroll-y
          v-if="commentList && commentList.length > 0"
        >
          <view
            class="comment-item"
            v-for="(item, index) in commentList"
            :key="index"
          >
            <image
              :src="$filters.formateImage(item.images)"
              class="avatar"
              v-if="item.images"
            />
            <image src="@/static/images/noImg.png" class="avatar" v-else />
            <view class="flex flex-1 flex-col ml-14">
              <view class="flex ai-center jc-between">
                <text class="txt-black-50 txt-28">{{
                  item.mobile || `游客${index + 1}`
                }}</text>
                <text class="txt-black-151 txt-24">{{ item.createTime }}</text>
              </view>
              <view class="txt-black-100 txt-26 my-10">{{
                item.description
              }}</view>
              <image
                :src="$filters.formateImage(item.images)"
                class="desc-img"
                v-if="item.images"
              />
            </view>
          </view>
        </scroll-view>
        <EmptyWidget v-else />
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import AddDish from "./components/add-dish.vue";
import { fetchCommentList } from "@/services/comment";
import { useHomeStore } from "@/store/home";
import EmptyWidget from "@/components/empty-widget.vue";
import { ref } from "vue";
const homeStore = useHomeStore();
const barHeight = ref(0);
const titleHeight = ref(0);
const item = ref({});
const commentList = ref([]);
const totalComment = ref(0);
const rigthRate = ref(0);
onLoad((options) => {
  const sysInfo = uni.getSystemInfoSync();
  const { statusBarHeight } = sysInfo;
  const { height, top } = uni.getMenuButtonBoundingClientRect();
  barHeight.value = statusBarHeight;
  titleHeight.value = (top - statusBarHeight) * 2 + height;
  item.value = JSON.parse(options.item);
  getCommentList();
});

const getCommentList = async () => {
  const { id } = item.value;
  const options = {
    dishId: homeStore.type == 1 ? id : "",
    setmealId: homeStore.type == 2 ? id : "",
  };
  const { code, msg, data } = await fetchCommentList(options);
  if (code == 1) {
    commentList.value = data || [];
    if (data && data.length > 0) {
      totalComment.value = data.length;
      const rightArr = data.filter((item) => item.status == 1);
      if (rightArr && rightArr.length > 0) {
        rigthRate.value = (rightArr.length / data.length) * 100;
      }
    }
  } else {
    uni.showToast({ title: msg, icon: "none" });
  }
};

const goBack = () => {
  uni.navigateBack({ url: "/pages/home/index" });
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: rgba(204, 204, 204, 0.3);

  .header {
    position: relative;
    width: 100%;
    height: 400rpx;

    .img {
      width: 100%;
      height: 100%;
    }

    .black-wrap {
      position: absolute;
      left: 30rpx;
      top: 80rpx;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .main-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 340rpx;
    width: 100%;
    height: calc(100vh - 340rpx);
    display: flex;
    flex-direction: column;

    .shop-info {
      width: 100%;
      padding: 30rpx;
      box-sizing: border-box;
      background-color: white;
      border-radius: 20rpx 20rpx 0rpx 0rpx;
      display: flex;
      flex-direction: column;
    }

    .comment-wrap {
      margin-top: 30rpx;
      width: 100vw;
      height: calc(100% - 300rpx);
      display: flex;
      flex-direction: column;
      background-color: white;

      .scroll {
        flex: 1;
        margin-top: 20rpx;
        display: flex;
        flex-direction: column;
        padding: 0rpx 30rpx;
        box-sizing: border-box;

        .comment-item {
          display: flex;
          margin-top: 20rpx;
          padding-bottom: 30rpx;
          border-bottom: 1px dashed #ccc;
          .avatar {
            width: 80rpx;
            height: 80rpx;
            object-fit: cover;
            border-radius: 80rpx;
            border: 6rpx solid rgba(254, 100, 53, 1);
          }

          .desc-img {
            width: 160rpx;
            height: 160rpx;
            object-fit: contain;
            border-radius: 10rpx;
          }
        }
      }
    }
  }
}
</style>
