/*
 * @Author: dfh
 * @Date: 2024-09-23 16:07:56
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
export function showToast(title, icon = "none", duration = 3000) {
  if (!title) return;
  return new Promise((resolve) => {
    uni.showToast({
      title,
      icon,
      duration
    });
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve();
    }, duration);
  });
}
