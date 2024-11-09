import { defineStore } from 'pinia';
import { addCart, subCart, clearCart, fetchCartList } from '@/services/shop-cart';
import { ref } from 'vue';

export const useCartStore = defineStore('cartStore', () => {
    //购物车列表数据
    const cartList = ref([]);
    //添加的总数据
    const totalCartNum = ref(0);
    //总金额
    const totalAomunt = ref(0);

    //select flavors
    const selectItem = ref({});


    //获取购物车信息
    const getCartList = async (sitNum) => {
        const { code, data, msg } = await fetchCartList(sitNum);
        if (code == 1) {
            cartList.value = data || [];
        } else {
            uni.showToast({
                title: msg,
                icon: 'none'
            })
        }
        let amount = 0, num = 0;
        (cartList.value || []).forEach(item => {
            num += item.number;
            amount += item.number * (item.amount);
        })
        totalCartNum.value = num;
        totalAomunt.value = amount;
    }

    //添加
    const addCartActive = async (options) => {
        const { code, msg } = await addCart({
            ...options,
            amount: options.price
        });
        if (code == 1) {
            getCartList(options.sitNum);
        } else {
            uni.showToast({ title: msg });
        }
    }

    //减少
    const subCartActive = async (options) => {
        const { code, msg } = await subCart({
            ...options,
            amount: options.price
        });
        if (code == 1) {
            getCartList(options.sitNum);
        } else {
            uni.showToast({ title: msg });
        }
    }

    //清除
    const cleanCart = async (sitNum) => {
        const { code, msg } = await clearCart(sitNum);
        if (code == 1) {
            getCartList(sitNum);
        } else {
            uni.showToast({ title: msg });
        }
    }

    //设置选择的flavors item
    const setSelectFlavorsItem = (item) => {
        selectItem.value = item;
    }

    return {
        cartList,
        totalCartNum,
        totalAomunt,
        getCartList,
        addCartActive,
        subCartActive,
        cleanCart,
        selectItem,
        setSelectFlavorsItem,
    }
})