
import {post} from '@/utils/request'

// 活动页面数据
export function getOperateCmsPage(data,success, error, complete){
    post(`/operateBanner/newGetOperateCmsPage`, data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}