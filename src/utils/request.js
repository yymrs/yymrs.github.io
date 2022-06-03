import axios from 'axios';
import qs from 'qs'
import router from '@/router'
import { Notification } from 'element-ui'
import VueCookies from 'vue-cookies'
// import store from '@/store'
const instance = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
	timeout: 30000
});
// 添加请求拦截器
instance.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	config.headers['platform'] = 2;
	config.headers['os'] = 3;
	config.headers['version'] = 'V1.2.9';
	config.headers['Access-Token'] = VueCookies.get('TOKEN');
	config.headers['timezone']=new Date().getTimezoneOffset();
	return config;
}, function(error) {
	Notification({
		title: "Oops",
		message: 'The request failed to send!',
		iconClass:'el-icon-warning-outline',
		duration: 3000,
		showClose: false
	});
	return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
	// 对响应数据做点什么
	return response;
}, function(error) {
	return Promise.reject(error);
});

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params, complete) {
	let shopId = localStorage.getItem('USERINFO')===null?undefined:JSON.parse(localStorage.getItem('USERINFO')).shopId
	return new Promise((resolve, reject) => {
		instance.get(url, {
			params: { ...params, channel: 3, shopId: shopId }
		})
		.then(response => {
			complete();
			resolve(response);
		})
		.catch(err => {
			complete();
			reject(err);
			Notification({
				title: "Oops",
				message: 'Data response failed!',
				iconClass:'el-icon-warning-outline',
				duration: 3000,
				showClose: false
			});
		})
	}).then(errorMsg)
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data, complete) {
	// let urlData = {shopID: ''};
	// if(window.location.href.indexOf('shopID') > -1) {
	// 	window.location.href.split('?')[1].split('&').forEach(item=>{
	// 		let val = item.split('=');
	// 		urlData[val[0]] = val[1];
	// 	})
	// }
	let shopId = localStorage.getItem('USERINFO')===null?undefined:JSON.parse(localStorage.getItem('USERINFO')).shopId
	return new Promise((resolve, reject) => {
		if(url=='/store/export') {
			instance.defaults.timeout = 120000
		}
		// 服务器设置1分钟响应504前端无法判断到504 我们这里给59s来做超时判断
		if(url=='/store/exportProduct') {
			instance.defaults.timeout = 59000
		}
		instance.post(url, Object.assign({}, data, { channel: 3, shopId: shopId })) // channel的值：0:ios 1:android 2:H5 3:PC
		.then(response => {
			resolve(response);
			complete();
		}, err => {
			console.log(err,'err',err.message);
      reject(err)
			// if(url=='/store/exportProduct'&&err.message.includes('timeout')) {
			// 	Notification({
			// 		title: "Adding In Progress",
			// 		message: 'Thanks for your patience. We will send you an email when it completes.',
			// 		iconClass:'el-icon-circle-check',
			// 		duration: 3000,
			// 		showClose: false
			// 	});
			// 	complete();
			// 	return
			// }
			if(url=='/store/exportProduct'&&err.message.includes('timeout')) {
				Notification({
					title: "Adding In Progress",
					message: 'Thanks for your patience. We will send you an email when it completes.',
					iconClass:'el-icon-circle-check',
					duration: 3000,
					showClose: false
				});
			}else {
				Notification({
					title: "Oops",
					message: 'Data response failed!',
					iconClass:'el-icon-warning-outline',
					duration: 3000,
					showClose: false
				});
			}
			complete();
		})
	}).then(errorMsg)
}

/**
 * 文件上传
 * @param url
 * @param data
 * @returns {Promise}
 */
export function postFormData(url, data, complete,config) {
	return new Promise((resolve, reject) => {
		instance.post(url, data, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				...config
			})
			.then(response => {
				resolve(response);
				complete();
			}, err => {
				reject(err);
				complete();
				// 如果是用户取消的请求不需要提示信息
				if(err.message==='cancelApi') {
					return
				}
				Notification({
					title: "Oops",
					message: 'Data response failed!',
					iconClass:'el-icon-warning-outline',
					duration: 3000,
					showClose: false
				});
			})
	}).then(errorMsg)
}

/**
 * @param {Object} response自定义错误信息
 */
function errorMsg(response) {
	return new Promise((resolve, reject) => {
		if (response.status === 200) {
			if (response.data.code != 200) {
				reject(response)
				switch (response.data.code) {
					case 610:
						console.log(61000000000);
						router.push({path: '/login'})
						break;
					case 600:
						break;
					case 500:
						// Notification({
						// 	title: "Oops",
						// 	message: response.data.message,
						// 	iconClass:'el-icon-warning-outline',
						// 	duration: 3000,
						// 	showClose: false
						// });
						break;
					case 505:
						break;
					default:
						Notification({
							title: "Oops",
							message: response.data.message,
							iconClass:'el-icon-warning-outline',
							duration: 3000,
							showClose: false
						});
				}
			} else {
				resolve(response.data);
			}
		} else {
			Notification({
				title: "Oops",
				message: 'Data response failed!',
				iconClass:'el-icon-warning-outline',
				duration: 3000,
				showClose: false
			});
			reject(response)
		}
	})
}
