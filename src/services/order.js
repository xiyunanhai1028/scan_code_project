/*
 * @Author: dfh
 * @Date: 2024-09-26 16:20:07
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
import http from "@/utils/request";

//获取订单列表
export function fetchOrderList(currentPage, pageSize, status) {
    return http.get({
        url: `/order/list?page=${currentPage}&pageSize=${pageSize}&status=${status}`
    });
}

//用户下单
export function submit(data) {
    return http.post({
        url: `/order/submit`,
        data
    });
}

//结算接口
export function payment(data) {
    return http.post({
        url: `/order/payment`,
        data
    });
}

//取消订单
export function orderCancel(id) {
    return http.put({
        url: `/order/cancel/${id}`
    });
}


//获取订单详情
export function fetchOrderDetail(id) {
    return http.get({
        url: `/order/detail/${id}`
    });
}

//获取订单详情
export function fetchOrder(sitNum) {
    return http.get({
        url: `/order/order?sitNum=${sitNum}`
    });
}