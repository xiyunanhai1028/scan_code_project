/*
 * @Author: dfh
 * @Date: 2024-07-23 14:56:21
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
import {
	createSSRApp
} from "vue";
import { createPinia } from 'pinia';
import customPlugin from "@/plugins/index";
import App from "./App.vue";
const pinia = createPinia();
export function createApp() {
	const app = createSSRApp(App);
	app.use(pinia);
	app.use(customPlugin);
	return {
		app,
	};
}
