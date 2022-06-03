
import { get,post } from '@/utils/request'

// 通知信息
export function queryMessageNotificationList(data,success, error, complete){
    get(`/message/queryMessageNotificationList`, data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}
// 首页商品分类导航列表
export function queryCategoryNavList(data,success, error, complete){
    get(`/front-category/categoryNavList`, data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

// 查询 分类树结构
export function getLeftCategoryNavTree(data,success, error, complete){
    post(`/front-category/getLeftCategoryNavTree`, data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}
// 查询从详情页面跳转到分类页面的真实分类树
export function getCategoryTree(data,success, error, complete){
    post(`/front-category/getCategoryTree?cId=${data.cId}`, data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}
// 查询marketingUrl
export function getMarketingUrl(data,success, error, complete){
    post(`/front-category/getMarketingUrl?cId=${data.cId}`, data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}
