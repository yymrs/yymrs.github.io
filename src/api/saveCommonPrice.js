
import {post,get} from '@/utils/request';

export function getSaveCommonPrice(data,success, error, complete){
    get("/setting/priceRule", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}
export function saveCommonPrice(data,success, error, complete){
    post("/setting/priceRule/save", data, complete).then(
        function (res) {
            success(res)
        },
        (err) => {
            error(err)
        }
    );
}

