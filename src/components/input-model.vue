<!--
 * @Author: dfh
 * @Date: 2024-09-27 10:32:08
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
    <view class="container" v-if="visible">
        <view class="model-wrap">
            <text class="txt-black-50 txt-32 mt-30">用户实名</text>
            <view class="input-wrap">
                <input class="input" type="number" maxlength="11" v-model="phone" />
            </view>
            <view class="bottom-wrap">
                <text class="txt1" @click="hide">取消</text>
                <view class="line"></view>
                <text class="txt2" @click=onOkHandle>确定</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import { validatePhoneNumber } from '@/utils/index';

const emits = defineEmits(['onConfirm'])
const phone = ref('');
const visible = ref(false);

const show = () => {
    visible.value = true;
}

const hide = () => {
    phone.value = '';
    visible.value = false;
}

const onOkHandle = () => {
    if (validatePhoneNumber(phone.value)) {
        emits('onConfirm', phone.value);
    } else {
        uni.showToast({
            title: '请输入正确的手机号',
            icon: 'none'
        })
    }

}

defineExpose({
    show,
    hide
})
</script>

<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .3);
    display: flex;
    align-items: center;
    justify-content: center;

    .model-wrap {
        // padding: 30rpx;
        width: 86%;
        border-radius: 20rpx;
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        box-sizing: border-box;

        .input-wrap {
            width: 90%;
            // height: 140rpx;
            margin: 50rpx 30rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-sizing: border-box;

            .input {
                width: 100%;
                height: 80rpx;
                border-radius: 8rpx;
                border: 2rpx solid #ece7e7;
                padding: 0 14rpx;
                line-height: 80rpx;
                box-sizing: border-box;
                font-weight: 500;
            }
        }

        .bottom-wrap {
            width: 100%;
            display: flex;
            height: 80rpx;
            border-top: 2rpx solid #ece7e7;

            .line {
                width: 2rpx;
                height: 80rpx;
                background-color: #ece7e7;
            }

            .txt1,
            .txt2 {
                flex: 1;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 32rpx;
                color: rgba(100, 101, 102, 1);
                text-align: center;
            }

            .txt2 {
                color: rgba(225, 163, 72, 1);
            }

        }
    }
}
</style>