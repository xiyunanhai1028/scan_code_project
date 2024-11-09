/*
 * @Author: dfh
 * @Date: 2024-09-25 09:27:10
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
import http from "@/utils/request";

//获取评论列表
export function fetchCommentList(data) {
    return http.get({
        url: `/comment`,
        data
    });
}