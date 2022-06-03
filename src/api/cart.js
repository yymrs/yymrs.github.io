
import { post } from '@/utils/request';
export function addShopToCart(data, success, error, complete) {
  post("/cart/add", data, complete).then(
    function (res) {
      success(res)
    },
    (err) => {
      error(err)
    }
  );
}
export function cartConfirmForMutilableOrder(data, success, error, complete) {
  post("/cart/confirm-new", data, complete).then(
    function (res) {
      success(res)
    },
    (err) => {
      error(err)
    }
  );
}
// 减少购物车商品数量，当减少数量大>= 当前数量，则直接删除
export function cartDelete(data, success, error, complete){
  post("/cart/delete", data, complete).then(
    function (res) {
      success(res)
    },
    (err) => {
      error(err)
    }
  );
}
// 购物车数量
export function cartNumber(data, success, error, complete){
  post("/cart/list", data, complete).then(
    function (res) {
      success(res)
    },
    (err) => {
      error(err)
    }
  );
}
