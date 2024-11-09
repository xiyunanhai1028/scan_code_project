/*
 * @Author: dfh
 * @Date: 2024-09-26 08:24:24
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
import http from "@/utils/request";

//根据座位号查询排队信息
export function fetchQueueInfo(orderId) {
    return http.get({
        url: `/order/queue?orderId=${orderId}`,
        data: {
            hideLoading: true
        }
    });
}