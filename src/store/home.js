/*
 * @Author: dfh
 * @Date: 2024-09-24 09:45:05
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { setOpenId, setToken } from '@/utils/index';

import { fetchOpenId } from '@/services/login';
import {
    fetchShopInfo
} from "@/services/home";

export const useHomeStore = defineStore('homeStore', () => {
    //桌位号
    const sitNum = ref(1);
    //当前左侧菜单选择的是菜品还是套餐
    //菜品：1 套餐：2
    const type = ref(1);

    //商户信息
    const shopInfo = ref({});

    //订单ID
    const orderId = ref('');
    //订单号
    const orderNumber = ref('');

    const setSitNum = (num) => {
        sitNum.value = num;
    }

    const setType = (val) => {
        type.value = val;
    }

    const setOrderId = (val) => {
        orderId.value = val;
    }

    const setOrderNumber = (val) => {
        orderNumber.value = val;
    }

    //获取 openid/token
    const getTokenActive = (callback) => {
        uni.getProvider({
            service: "oauth",
            success: (res) => {
                let provider = ''
                if (~res.provider.indexOf("alipay")) {
                    sitNum.value = 2;
                    provider = 'alipay';
                } else {
                    sitNum.value = 1;
                    provider = 'weixin';
                }
                uni.login({
                    provider: provider, //使用微信登录
                    success: async (loginRes) => {
                        console.log(loginRes);
                        const { code, msg, data } = await fetchOpenId({ code: loginRes.code, provider });
                        if (code == 1) {
                            const { token, openid } = data;
                            setOpenId(openid);
                            setToken(token);
                            callback();
                        } else {
                            uni.showToast({ title: msg, icon: 'none' });
                        }
                    },
                    fail: (err) => {
                        console.log(err);
                    }
                });
            },
        });

    }

    const getShopInfo = async () => {
        const { code, data, msg } = await fetchShopInfo(1);
        if (code == 1) {
            shopInfo.value = data;
        } else {
            uni.showToast({
                title: msg,
                icon: "none",
            });
        }
    };



    return {
        sitNum,
        setSitNum,
        type,
        setType,
        getTokenActive,
        shopInfo,
        getShopInfo,
        orderId,
        setOrderId,
        setOrderNumber
    }
})