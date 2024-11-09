/*
 * @Author: dfh
 * @Date: 2024-09-24 19:18:01
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
import http from "@/utils/request";

//添加评论
export function addComment(data) {
    return http.post({
        url: '/comment',
        data
    });
}

//获取评论列表
export function fetchCommentList() {
    return http.get({
        url: '/comment/list'
    });
}
