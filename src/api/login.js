import { get, post } from '@/utils/request'

//获取验证码
export function verficationPost(data, sucess, error, complete) {
	post("login/verfication", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

//用户登录
export function loginPost(data, sucess, error, complete) {
	post("/login/login", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

//用户登出
export function logoutPost(data, sucess, error, complete) {
	post("/login/login-out", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 注册填写用户信息+用户信息修改
export function userModifyPost(data, sucess, error, complete) {
	post("/user/modify", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 注册绑定用户邀请码
export function userShareCodePost(data, sucess, error, complete) {
	post("/user/bind-shareCode", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 免登录
export function shopifyLogin(data, sucess, error, complete) {
	post("/store/login", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 是否是白名单用户
export function isWhiteUser(data, sucess, error, complete) {
	post("/user/is-white", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 是否展示过引导页
export function isShow(data, sucess, error, complete) {
	post("/user/is-show", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 未展示过引导页，则标记一下，下次不再默认展示
export function addShow(data, sucess, error, complete) {
	post("/user/add-show", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 获取user信息
export function userInfo(data, sucess, error, complete) {
	post("/user/info", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 问卷调查列表-问题+答案下拉选项
export function questionList(data, sucess, error, complete) {
	post("/question/getList", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 问卷调查列表-提交答案
export function questionCommit(data, sucess, error, complete) {
	post("/question/commit", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 问卷调查列表-是否已提交问卷
export function questionHasCommit(data, sucess, error, complete) {
	post("/question/hasCommit", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// setUpLater登录流程之后再安装trendsi store或者shopify
export function setUpLater(data, success, error, complete) {
	get("/login/setUpLater", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 首次注册创建Trendsi store，提供热销商品供选择
export function getHotSaleProduct(data, success, error, complete) {
	post("/personalStoreProduct/getHotSaleProduct", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 加热销商品
export function addHotSaleProduct(data, success, error, complete) {
	post("/personalStoreProduct/add", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}
