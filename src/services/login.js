/*
 * @Author: dfh
 * @Date: 2024-09-25 15:08:39
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
import http from "@/utils/request";

//获取openId
export function fetchOpenId(data) {
    return http.post({
        url: '/user/login',
        data
    });
}

//更新用户信息
export function updateUserInfo(mobile) {
    return http.put({
        url: `/user/${mobile}`
    });
}