import {post} from '@/utils/request';

export function createCustomer(stripeToken,success, error, complete){
    const data = {
        stripeToken: stripeToken,
        type: 1 // 1支付；2提现
    };
    post("/stripe/createCustomer", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// 支付交易无需验证
export function stripeCharge(data, success, error, complete){
    post("/stripe/charge", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

/***添加支付卡***
 *
 * data 参数说明：
 *userId 用户id
 *brand（createToken中 返回的 brand信息）
 *type 1-添加支付卡，2-添加提现银行账户
 *last4 （createToken中 返回的 银行卡后4位信息）,
 *isDefault 0-非默认卡  1-默认卡
 *customerId （createCustomer接口 返回的信息）
 *
 * **/
export function addPaymentCart(data, success, error, complete){
    post("/bankAccount/insert", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

//查询银行卡列表
//接口参数 需再次确认 osType
export function queryPaymentCardList(userId, success, error, complete){
    const data = {
        osType: 3, // 1ios,2:android;3web
        type: 1,
        userId: userId
    };
    post("/bankAccount/payList", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

//删除某个支付卡
//接口参数 需再次确认 osType
export function deletePaymentCardByID(id,success, error, complete){
    const data = {
        id: id,
        osType: 3
    };
    post("/bankAccount/delete", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

//设置银行卡号为默认支付卡
export function setPaymentCardAsDefaultByID(id,success, error, complete){
    const data = {
        id: id,
    };
    post("/bankAccount/set-default", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// 优惠券
export function discountApply(data, success, error, complete){
    post("/discount/apply", data, complete).then(
        function (res) {
          success(res)
        },
        (err) => {
          error(err)
        }
    );
}
