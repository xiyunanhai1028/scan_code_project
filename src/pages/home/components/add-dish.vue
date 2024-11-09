<!--
 * @Author: dfh
 * @Date: 2024-09-23 17:40:16
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
-->
<template>
  <view class="dish-wrap">
    <text
      class="select-btn"
      v-if="flavors && flavors.length > 0"
      @click.stop="onFlavorClick"
      >选择规格</text
    >
    <view class="flex ai-center" v-else>
      <text
        class="iconfont icon-jianshao txt-40"
        @click="numChange('minus')"
        :class="num > 0 ? 'txt-yellow-225' : 'txt-black-228'"
      ></text>
      <text class="txt-black-50 mx-10 txt-26">{{ num }}</text>
      <text
        class="iconfont icon-zengjia txt-yellow-225 txt-40"
        @click.stop="numChange('add')"
      ></text>
    </view>
  </view>
</template>

<script setup>
import { effect, ref } from "vue";
import { useCartStore } from "@/store/cart";
import { useHomeStore } from "@/store/home";

const homeStore = useHomeStore();
const cartStore = useCartStore();
const num = ref(0);
const props = defineProps({
  flavors: {
    type: Array,
    default: () => [],
  },
  item: {
    type: Object,
    default: () => {},
  },
  type: {
    //用来区分是购物车，还是页面
    type: String,
    default: "",
  },
});

effect(() => {
  const cartItem = [...(cartStore.cartList || [])].find((item) => {
    if (props.type == "content") {
      return item.dishId == props.item.id || item.setmealId == props.item.id;
    } else {
      return item.id == props.item.id;
    }
  });
  if (cartItem != null) {
    num.value = cartItem.number;
  } else {
    num.value = 0;
  }
});

const numChange = async (type) => {
  let options = {
    ...props.item,
    sitNum: homeStore.sitNum,
  };
  if (type == "add") {
    if (props.type == "content") {
      options = {
        ...options,
        dishId: homeStore.type == 1 ? props.item.id : null,
        setmealId: homeStore.type == 2 ? props.item.id : null,
      };
    }
    cartStore.addCartActive(options);
  } else {
    if (props.type == "content") {
      options = {
        ...options,
        dishId: homeStore.type == 1 ? props.item.dishId : null,
        setmealId: homeStore.type == 2 ? props.item.setmealId : null,
      };
    }
    cartStore.subCartActive(options);
  }
};

const onFlavorClick = () => {
  cartStore.setSelectFlavorsItem(props.item);
};
</script>

<style lang="scss" scoped>
.dish-wrap {
  display: flex;
  align-items: center;

  .select-btn {
    width: 128rpx;
    height: 48rpx;
    background-color: rgb(255, 194, 0);
    font-size: 18rpx;
    color: black;
    border-radius: 24rpx;
    text-align: center;
    line-height: 48rpx;
  }
}
</style>
