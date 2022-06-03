import {post} from '@/utils/request';

// 查询地址列表
export function queryAddressCardList(data, success, error, complete){
  post("/address/list", data, complete).then(
      function (res) {
        success(res)
      },
      (err) => {
        error(err)
      }
  );
}

// 新增地址
export function addAddressCard(data, success, error, complete) {
  post("/address/insert", data, complete).then(
      function (res) {
        success(res)
      },
      (err) => {
        error(err)
      }
  );
}

// 修改地址
export function editAddressCard(data, success, error, complete){
  post("/address/update", data, complete).then(
      function (res) {
        success(res)
      },
      (err) => {
        error(err)
      }
  );
}

// 删除地址
export function removeAddressCard(data, success, error, complete){
  post("/address/removeAddress", data, complete).then(
      function (res) {
        success(res)
      },
      (err) => {
        error(err)
      }
  );
}