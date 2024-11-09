/*
 * @Author: dfh
 * @Date: 2024-09-24 13:30:06
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
import http from "@/utils/request";

//添加1个购物车数量
export function addCart(data) {
    return http.post({
        url: '/shoppingCart/add',
        data
    });
}

//移除1个购物车数量
export function subCart(data) {
    return http.post({
        url: '/shoppingCart/sub',
        data
    });
}

//清空购物车数量
export function clearCart(sitNum) {
    return http.delete({
        url: `/shoppingCart/clean?sitNum=${sitNum}`
    });
}

//查询购物车数据
export function fetchCartList(sitNum) {
    return http.get({
        url: `/shoppingCart/list/${sitNum}`
    });
}