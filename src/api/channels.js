import {get, post} from '@/utils/request';

//链接shopify店铺
export function connectShopifyStore(data, success, error, complete) {
	post("/store/connect", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}
// 被shopify下架应用，true走shopify，false走手动安装
export function switchShopify(data, success, error, complete) {
	get("/store/publicAppEnable", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}
//链接shopify店铺----失效：
export function registerCustomApp(data, success, error, complete) {
	post("/store/registerCustomApp", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}
//绑定shopify店铺
export function bindShopifyStore(data, success, error, complete) {
	post("/store/bind", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}
//验证auth
export function authShopifyStore(data, success, error, complete) {
	post("/store/auth", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}
//shopify列表 分页获取店铺列表
export function shopifyStoreList(data, sucess, error, complete) {
	post("/store/list", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//删除店铺链接
export function disconnectStoreByID(data,success, error, complete){
	post("/store/disconnect", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}
//三方店铺列表
export function shopifyStorecollections(data, sucess, error, complete) {
	post("/store/collections", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//获取店铺合集列表
export function getCollectionsListByStoreID(curPage,storeId,success, error, complete){
	const data = {
		storeId: storeId,
		curPage: curPage,
		pageSize: 10,
	};
	post("/store/collections", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}
//合集导出shopify
export function shopifyExport(data, sucess, error, complete) {
	post("/store/export", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

//小b店铺信息
export function shopModify(data, sucess, error, complete) {
	post("/shop/modify", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//合集导出shopify
export function getShopifyProductType(data, sucess, error, complete) {
	post("/store/product/configs", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//导出到小b店铺单个商品
export function personalStoreProduct(data, success, error, complete) {
	post("/personalStoreProduct/add", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}
//导出到小b店铺合集商品
export function addFromCollections(data, success, error, complete) {
	post("/personalStoreProduct/addFromCollections", data, complete).then(
		function (res) {
			success(res)
		},
		(err) => {
			error(err)
		}
	);
}
