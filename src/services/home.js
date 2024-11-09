/*
 * @Author: dfh
 * @Date: 2024-09-23 16:10:28
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
import http from "@/utils/request";

//获取分类列表
export function fetchCategoryList() {
    return http.get({
        url: '/category'
    });
}

//获取对应分类下的菜品
export function fetchDishList(categoryId) {
    return http.get({
        url: `/dish/list?categoryId=${categoryId}`
    });
}

//获取对应分类下的套餐
export function fetchSetmealList(categoryId) {
    return http.get({
        url: `/setmeal/list?categoryId=${categoryId}`
    });
}

//获取店铺信息
export function fetchShopInfo(shopId) {
    return http.get({
        url: `/shop/${shopId}`
    });
} 