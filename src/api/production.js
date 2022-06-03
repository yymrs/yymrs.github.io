import {post, get} from '@/utils/request'

//获取主页数据
export function homeProductPost(data, sucess, error, complete) {
	post("/product/home-product", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//获取主页一级分类数据
export function homeProductPostCategoryList(data, sucess, error, complete) {
	return post("/product/frontCategorylist", data, complete).catch((res) => res)
}
//获取一级分类下的二级分类
export function homeProductPostReclassifyList(data, sucess, error, complete) {
	return get("/front-category/listByFirstCategory", data, complete).catch((res) => res)
}
//获取主页预发布商品数据
export function homeComingSoonProductList(data, sucess, error, complete) {
	return get("/product/comingProduct", {...data}, complete).catch((res) => res)
	// get("/product/comingProduct", {}, complete).then(
	// 	function (res) {
	// 		sucess(res)
	// 	},
	// 	(err) => {
	// 		error(err)
	// 	}
	// );
}
// 获取首页商品一级分类单个分类的列表
export function productShopClassifyList(data, sucess, error, complete) {
	post("/product/frontProductByCategoryId", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
// 获取预发布商品列表
export function comingProductByTime(data, sucess, error, complete) {
	post("/product/comingProductByTime", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
// 商品详情
export function productDetail(data, sucess, error, complete) {
	post("/product/info", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
// 用户是否关注商品
export function attentionProduct(data, sucess, error, complete) {
	get("/product/attentionProduct", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
// 用户是否关注商品
export function attentionSku(data, sucess, error, complete) {
	get("/product/attentionSku", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
// 记录用户是关注商品
export function recordOnLineProduct(data, sucess, error, complete) {
	post("/order/recordOnLineProduct", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 头部搜索-下拉接口
export function searchProductDown(data, sucess, error, complete) {
	post("/product/association-search", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 头部搜索
export function searchProduct(data, sucess, error, complete) {
	post("/product/product-search", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// addProductsList
export function addProductsList(data, sucess, error, complete) {
	post("/store/product/list", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// addProductsList remove
export function addProductRemove(data, sucess, error, complete) {
	post("/store/product/delete", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// addProductsListTrendsi
export function addProductsListTrendsi(data, sucess, error, complete) {
	post("/personalStoreProduct/searchProduct", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// addProductRemoveTrendsi remove
export function addProductRemoveTrendsi(data, sucess, error, complete) {
	post("/personalStoreProduct/removeProduct", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// 轮播图合集
export function bannerList(data, sucess, error, complete) {
	get("/operateBanner/operateBannerList", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}

// pre-launch添加商品判断是否超出事件
export function cartEvent(data, sucess, error, complete) {
	post("/cart/cartEvent", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
export function exportProductPost(data, sucess, error, complete) {
	post("/store/exportProduct", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
export function checkExportProduct(data, sucess, error, complete) {
	post("/store/checkExportProduct", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
