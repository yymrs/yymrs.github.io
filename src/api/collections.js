import {post} from '@/utils/request'

//获取集合列表
export function productCollectionList(data, sucess, error, complete) {
	post("/productCollection/list", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//新增合集
export function addProductCollection(data, sucess, error, complete) {
	post("/productCollection/add-collection", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//删除合集
export function delProductCollection(data, sucess, error, complete) {
	post("/productCollection/remove-collection", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//添加或者移除合集商品
export function editProductStatusAtSomeProductCollection(data, sucess, error, complete) {
	post("/productCollection/product-collection", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//活动添加或者移除合集商品
export function cmsEditProductStatusAtSomeProductCollection(data, sucess, error, complete) {
	post("/operateBanner/addToCollection", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//集合明细列表
export function productCollectionListDetail(data, sucess, error, complete) {
	post("/productCollection/detail-list", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//添加到默认合集
export function addDefaultproductCollection(data, sucess, error, complete) {
	post("/productCollection/add-product", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
//修改合集名称
export function editproductCollectionName(data, sucess, error, complete) {
	post("/productCollection/edit-collection", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
// 导出fb
export function productCollectionCRSToEmail(data, sucess, error, complete){
	post("/productCollection/export", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
	// return assembleUrlParms('/productCollection/export', netMethod.POST, {collectionId,email,productID:productId,exportType});
}
// 活动导出fb
export function cmsProductCollectionCRSToEmail(data, sucess, error, complete){
	post("/facebook/export", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
// WebApp操作商品合集
export function productCollectionMulti(data, sucess, error, complete){
	post("/productCollection/collection-product", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
// WebApp是否默认合集
export function productCollectionIsDefault(data, sucess, error, complete){
	post("/productCollection/web-detail", data, complete).then(
		function (res) {
			sucess(res)
		},
		(err) => {
			error(err)
		}
	);
}
