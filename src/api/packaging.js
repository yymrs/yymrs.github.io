import {post,get} from '@/utils/request'

// 新增或编辑收据
export function shopSaveInvoice(data,success, error, complete){
    post("/shop/saveInvoice", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}
// 新增或编辑收据
export function getShopInvoice(data,success, error, complete){
	let id = localStorage.getItem('USERINFO')===null?undefined:JSON.parse(localStorage.getItem('USERINFO')).shopId
    get(`/shop/getInvoice/${id}`, data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}
