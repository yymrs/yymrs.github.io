
import { post,get } from '@/utils/request';
// 小b页面样式
export function getShopStyleConfig(data, success, error, complete) {
  const id = localStorage.getItem('USERINFO')===null?undefined:JSON.parse(localStorage.getItem('USERINFO')).shopId
  return get("/personalStoreConfig/getShopConfig/" + id , data, complete).then(
    function (res) {
      success(res)
    },
    (err) => {
      error(err)
    }
  );
}
// 修改小b页面样式
export function personalStoreConfig(data, success, error, complete) {
  post("/personalStoreConfig/addShopConfig", data, complete).then(
    function (res) {
      success(res)
    },
    (err) => {
      error(err)
    }
  );
}
// 获取店铺信息
export function shopInfo(data, success, error, complete) {
  get("/shop/info", data, complete).then(
    function (res) {
      success(res)
    },
    (err) => {
      error(err)
    }
  );
}
// 校验二级域名是否合法
export function validateThirdDomainName(data, success, error, complete) {
  post("/personalStoreConfig/validateThirdDomainName", data, complete).then(
    function (res) {
      success(res)
    },
    (err) => {
      error(err)
    }
  );
}
