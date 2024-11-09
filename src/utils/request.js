import { getToken } from "./index";
import { showToast } from "./toast";
import { BASE_URL } from '@/config/index'
let isShowModel = true;

const statusMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

class HttpRequest {
  constructor() {
    this.baseURL = "";

    this.header = {
      "content-type": "application/json"
    };

    this.dataType = "json";
    // this.responseType = "text";
    this.queue = {}; //用来维护请求队列

    this.interceptors = {
      //请求拦截
      request: (func) => {
        if (func) {
          HttpRequest.requestBefore = func;
        } else {
          HttpRequest.requestBefore = (request) => request;
        }
      },
      response: (func) => {
        //相应拦截
        if (func) {
          HttpRequest.requestAfter = func;
        } else {
          HttpRequest.requestAfter = (response) => response;
        }
      }
    };
  }

  //请求拦截
  static requestBefore(config) {
    return config;
  }

  //相应拦截
  static requestAfter(response) {
    return response;
  }

  request(options = {}) {
    options.url = BASE_URL + options.url;
    options.dataType = options.dataType || this.dataType;
    // options.responseType = options.responseType || this.responseType;
    options.data = options.data || "";
    options.header = {
      ...this.header,
      ...options.header
    };
    options.method = options.method || "GET";
    options = {
      ...options,
      ...HttpRequest.requestBefore(options)
    };
    return new Promise((resolve, reject) => {
      options.success = (res) => {
        delete this.queue[options.url];
        if (Object.keys(this.queue).length === 0) {
          uni.hideLoading();
        }
        resolve(HttpRequest.requestAfter(res));
      };
      options.fail = (err) => {
        delete this.queue[options.url];
        reject(HttpRequest.requestAfter(err));
      };
      const requestTask = uni.request(options);
      //设置requestTask
    }).catch((err) => Promise.reject(err));
  }

  requestOptions(url, data, options, method) {
    options.url = url;
    options.data = data;
    options.method = method;
    return options;
  }
  get({ url, data, options = {} }) {
    options = this.requestOptions(url, data, options, "GET");
    return this.request(options);
  }

  post({ url, data, options = {} }) {
    options = this.requestOptions(url, data, options, "POST");
    return this.request(options);
  }

  delete({ url, data, options = {} }) {
    options = this.requestOptions(url, data, options, "DELETE");
    return this.request(options);
  }

  put({ url, data, options = {} }) {
    options = this.requestOptions(url, data, options, "PUT");
    return this.request(options);
  }
}

//处理错误
function handleError(response) {
  const { statusCode, statusText, errMsg } = response;
  if (statusCode === 401) {
    //权限问题
    authError();
  } else {
    let errorText = statusMessage[statusCode] || statusText || errMsg;
    //请求被主动取消
    if (errMsg.includes("request:fail abort")) return;
    if (errMsg === "request:fail timeout") errorText = "请求超时";
    if (errMsg.startsWith("request:fail")) errorText = "无网络";
    return showToast(errorText).then(() => {
      uni.hideLoading();
      const error = new Error(errorText);
      error.status = statusCode;
      error.response = response;
      throw error;
    });
  }
}

//权限错误
function authError() {
  if (isShowModel) {
    isShowModel = false;
    const pages = getCurrentPages(); //获取加载的页面
    const currentPage = pages[pages.length - 1]; //获取当前页面的对象
    const url = currentPage.route; //当前页面url
    const options = currentPage.options; //如果要获取url中所带的参数可以查看options
    uni.showModal({
      title: "登录失效",
      content: "请重新登录，登录后继续操作",
      showCancel: false,
      success() {
        isShowModel = true;
        uni.clearStorageSync();
        uni.redirectTo({
          url: `/pages/login/index?from=${url}&params=${JSON.stringify(
            options
          )}`
        });
      }
    });
  }
}

const http = new HttpRequest();

http.interceptors.request((config) => {
  // console.log("请求地址-->", config);
  // console.log("请求参数-->", config.data);
  //显示loading
  if (
    (Object.keys(http.queue).length === 0 && config.data == null) ||
    (Object.keys(http.queue).length === 0 && !config.data.hideLoading)
  ) {
    uni.showLoading({ title: "正在加载..." });
  }
  http.queue[config.url] = true;
  //删除设置的参数
  if (config.data && config.data.hideLoading) {
    delete config.data.hideLoading;
  }

  const token = getToken();
  if (token) config.header.authentication = token;
  http.queue[config.url] = true;
  return config;
});

http.interceptors.response((response) => {
  const { statusCode } = response;
  if (statusCode >= 200 && statusCode < 300) {
    // console.log("相应结果-->", response.data);
    const { code } = response.data;

    if (code == 401) {
      authError();
      return;
    }

    return response.data;
  } else {
    handleError(response);
  }
});

export function uploadFiles(path) {
  uni.showLoading({
    title: "正在上传..."
  });
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: BASE_URL + '/common/upload',
      fileType: 'image',
      filePath: path,
      name: "file",
      success: (uploadFileRes) => {
        uni.hideLoading();
        console.log("uploadFileRes.data", uploadFileRes.data);
        resolve(uploadFileRes.data);
      },
      fail: (err) => {
        uni.hideLoading();
        reject(err);
      }
    });
  });
}
export default http;
