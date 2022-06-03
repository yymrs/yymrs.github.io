import {post} from '@/utils/request'

/*
* 创建订单接口 参数说明
* data：{
    * skuList:[],
    * addressId:'',
    * userCouponId:'',
    * email:''
* }
*
* */
export function createOrder(data,success, error, complete){
    post("/order/create", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

//查询订单列表接口
export function queryOrderListByStatus(data,success, error, complete){
    post("/order/list-new", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// 创建订单
export function orderCreateNew(data, success, error, complete){
    post("/order/create-new", data, complete).then(
        function (res) {
          success(res)
        },
        (err) => {
          error(err)
        }
    );
}

//查询订单详情接口
export function queryOrderDetailById(data, success, error, complete){
    post("/order/info-new", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

//取消订单接口
export function cancelOrderById(data, success, error, complete){
    post("/order/cancel-new", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

//当前订单是 shopify 同步过来的订单时，需要查询是否满足下单支付条件 再进行支付
export function checkShopifyOrderCanBePayment(orderId,success, error, complete){
    const data = {orderId:orderId};
    post("/shopify/checkout", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// 自动支付
export function autoCheckoutPay(data, success, error, complete){
    post("/shop/setAutoPay", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// 手动减少sku数量接口
export function orderLessSku(data, success, error, complete){
    post("/order/lessSku", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// Return列表
export function orderListReturn(data, success, error, complete){
    post("/returnOrder/list", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// Return原因列表
export function orderListReturnReason(data, success, error, complete){
    post("/returnOrder/returnReason", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// Return创建退货单
export function orderReturnCreate(data, success, error, complete){
    post("/returnOrder/create", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// Return退货单详情接口
export function orderReturnDetail(data, success, error, complete){
    post("/returnOrder/info", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// Return退货单详情接口
export function orderReturnCancel(data, success, error, complete){
    post("/returnOrder/cancelReturn", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

