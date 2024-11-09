/*
 * @Author: dfh
 * @Date: 2023-02-16 10:04:11
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe:
 */
import { BASE_IMG } from "@/config/index";
const customPlugin = {
  install(app) {
    app.config.globalProperties.$filters = {
      formateImage(val) {
        if (!val) return '/src/static/images/noImg.png';
        return BASE_IMG + val;
      },
      formateAmount(val) {
        if (!val || val == 0) return '0.00';
        return `${val}.00`
      }
    }
  }
};

export default customPlugin;
