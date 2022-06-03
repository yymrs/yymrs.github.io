import {postFormData,post} from '@/utils/request';
import axios from 'axios';
const CancelToken = axios.CancelToken;
// 查询地址列表
// file/upload
export function uploadFileApi(data, success, error, complete,onUploadProgress,cancel){
  postFormData("/file/uploadPermit", data, complete,{
    cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel.cancel = c;
    }),
    onUploadProgress: (progressEvent) => {
      /* 
        progressEvent.loaded 已上传文件大小
        progressEvent.total 被上传文件的总大小
      */
      const progressPrecent = (progressEvent.loaded / progressEvent.total * 100);
      console.log('progressEvent',progressEvent);
      onUploadProgress(progressPrecent)
    },
    }).then(
      function (res) {
        success(res)
      },
      (err) => {
        error(err)
      }
  );
}

export function modifyUserPermit(data, success, error, complete) {
  post("/user/modifyUserPermit", data, complete).then(
    function (res) {
      success(res)
    },
    (err) => {
      error(err)
    }
  );
}