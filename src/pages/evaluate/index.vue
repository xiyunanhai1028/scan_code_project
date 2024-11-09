<template>
  <view class="container">
    <view class="flex ai-center jc-between">
      <view class="flex ai-center" @click="() => inputEle.show()">
        <text
          class="iconfont icon-radiobutton txt-yellow-225"
          v-if="formdata.mobile"
        ></text>
        <text class="iconfont icon-radio txt-black-204" v-else></text>
        <text class="txt-black-50 txt-22 ml-10">实名评价</text>
      </view>
      <text class="txt-black-50 txt-22">实需要登录</text>
    </view>
    <view class="card">
      <view class="flex ai-center">
        <image :src="$filters.formateImage(item.image)" class="card-img" />
        <view class="flex flex-col ml-20 flex-1">
          <text class="txt-black-50 txt-30 txt-w-6">{{ item.name }}</text>
          <view class="mt-10 flex ai-center jc-between">
            <view class="flex ai-center">
              <text class="txt-24 txt-yellow-225 mt-6">￥</text>
              <text class="txt-30 txt-yellow-225 txt-w-7">{{
                item.amount
              }}</text>
            </view>
            <text class="txt-black-100 txt-24">{{ item.checkoutTime }}</text>
          </view>
        </view>
      </view>
      <view class="flex ai-center jc-between my-40">
        <view
          class="card2"
          :class="formdata.status == 0 ? 'active' : ''"
          @click="onStatusChange(0)"
        >
          <text
            class="iconfont icon-bumanyi txt-40 mr-20"
            :class="formdata.status == 0 ? 'txt-white-255' : 'txt-black-153'"
          ></text>
          <text
            class="txt-28"
            :class="formdata.status == 0 ? 'txt-white-255' : 'txt-black-50'"
            >不满意</text
          >
        </view>
        <view
          class="card2"
          :class="formdata.status == 1 ? 'active' : ''"
          @click="onStatusChange(1)"
        >
          <text
            class="iconfont icon-manyi txt-40 mr-20"
            :class="formdata.status == 1 ? 'txt-white-255' : 'txt-black-153'"
          ></text>
          <text
            class="txt-28"
            :class="formdata.status == 1 ? 'txt-white-255' : 'txt-black-50'"
            >满意</text
          >
        </view>
      </view>
      <view class="input-wrap">
        <textarea
          placeholder="口味效果，可以让更多人有更好的选择.."
          :maxlength="200"
          class="txt-24 tx-black-50"
          v-model="formdata.description"
          style="height: 190rpx"
        />
        <view class="img-wrap" @click.stop="chooseImage">
          <image
            :src="$filters.formateImage(formdata.images)"
            v-if="formdata.images"
            class="img"
          />
          <template v-else>
            <text class="iconfont icon-xiangji txt-54 txt-black-151"></text>
            <text class="txt-black-151 txt-28 mt-10">添加照片</text>
          </template>
        </view>
        <text class="right-txt">{{ formdata.description.length }}/200字</text>
      </view>
    </view>
    <button class="btn" @click="onAddComment">提 交</button>
    <InputModel @onConfirm="onConfirm" ref="inputEle" />
  </view>
</template>

<script setup>
import { addComment } from "@/services/evaluate";
import { uploadFiles } from "@/utils/request";
import { onLoad } from "@dcloudio/uni-app";
import { updateUserInfo } from "@/services/login";
import InputModel from "@/components/input-model.vue";
import { ref } from "vue";

const item = ref({});
const inputEle = ref("");
const formdata = ref({
  status: 1,
  description: "",
  images: "",
  dishIds: "",
  setmealIds: "",
  //   openId: "",
  orderId: "",
  //   mobile: "",
});

onLoad((options) => {
  item.value = JSON.parse(options.item);
  const orderInfo = item.value.orderDetailList;

  const dishIds = (orderInfo.filter((item) => item.dishId) || []).map(
    (item) => item.dishId
  );
  const setmealIds = (orderInfo.filter((item) => item.setmealId) || []).map(
    (item) => item.setmealId
  );
  formdata.value = {
    ...formdata.value,
    dishIds: dishIds.join(","),
    setmealIds: setmealIds.join(","),
    orderId: item.value.id,
  };
  console.log(formdata.value);
});

//状态改变
const onStatusChange = (val) => {
  formdata.value = {
    ...formdata.value,
    status: val,
  };
};

//添加评论
const onAddComment = async () => {
  const { description } = formdata.value;
  if (!description)
    return uni.showToast({ title: "评论描述不能为空", icon: "none" });
  const { code, msg } = await addComment(formdata.value);
  if (code == 1) {
    uni.reLaunch({ url: "/pages/home/index" });
  } else {
    uni.showToast({ title: msg, icon: "none" });
  }
};

//拍照 or 相册功能
const chooseImage = () => {
  uni.chooseImage({
    count: 1, //默认9
    sourceType: ["camera", "album"],
    success: async (res) => {
      const tempFilePaths = res.tempFilePaths;
      const result = await uploadFiles(tempFilePaths[0]);
      const { code, msg, data } = JSON.parse(result);
      if (code == 1) {
        formdata.value.images = data;
      } else {
        uni.showToast({ title: msg, icon: "none" });
      }
    },
  });
};

const onConfirm = async (phone) => {
  const { code, msg } = await updateUserInfo(phone);
  inputEle.value.hide();
  if (code == 1) {
    formdata.value.mobile = phone;
    uni.showToast({ title: "实名认证成功", icon: "none" });
  } else {
    uni.showToast({ title: msg, icon: "none" });
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 30rpx;
  background-color: rgb(246, 246, 246);

  .card {
    margin-top: 20rpx;
    padding: 30rpx 20rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 20rpx;

    &-img {
      width: 100rpx;
      height: 100rpx;
      object-fit: contain;
    }

    .card2 {
      flex: 1;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80rpx;
      background-color: rgba(147, 157, 191, 0.1);
      border-radius: 20rpx;

      &:last-child {
        margin-left: 20rpx;
      }

      &.active {
        background-color: rgba(225, 163, 72, 1);
      }
    }

    .input-wrap {
      position: relative;
      background-color: rgba(228, 228, 228, 0.3);
      padding: 30rpx;
      border-radius: 20rpx;
      box-sizing: border-box;
      height: 400rpx;

      .img-wrap {
        position: absolute;
        left: 30rpx;
        bottom: 30rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 150rpx;
        height: 150rpx;
        border-radius: 10rpx;
        border: 2rpx dashed #ccc;
      }

      .right-txt {
        position: absolute;
        right: 30rpx;
        bottom: 30rpx;
        font-size: 22rpx;
        color: rgba(151, 152, 153, 1);
      }

      .img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }

  .btn {
    position: fixed;
    left: 30rpx;
    right: 30rpx;
    bottom: 40rpx;
    background-color: rgba(225, 163, 72, 1);
    height: 80rpx;
    border-radius: 20rpx;
    color: white;
    font-size: 30rpx;
  }
}
</style>
