/**
 * 适配 UniApp 的请求封装
 * 使其兼容 @umijs/openapi 生成的服务调用
 */

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8080'; // 后端基地址

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: any;
  data?: any;
  headers?: any;
  [key: string]: any;
}

export default async function request(url: string, options: RequestOptions = {}) {
  const { method = 'GET', params, data, headers } = options;

  // 处理 Query 参数
  let queryString = '';
  if (params) {
    const parts = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`);
    if (parts.length > 0) {
      queryString = (url.includes('?') ? '&' : '?') + parts.join('&');
    }
  }

  const finalUrl = url.startsWith('http') ? url + queryString : BASE_URL + url + queryString;

  return new Promise((resolve, reject) => {
    uni.request({
      url: finalUrl,
      method: method as any,
      data: data,
      header: {
        'Content-Type': 'application/json',
        ...headers,
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          // 处理错误逻辑
          uni.showToast({
            title: `请求失败: ${res.statusCode}`,
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}
