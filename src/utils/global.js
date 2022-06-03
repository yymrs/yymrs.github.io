/*
  * “全局变量”的执行顺序先于“main.js”，所以不得不采用全局函数的方法。
*/


// import amplitude from 'amplitude-js';
import md5 from 'js-md5';
import moment from 'moment'

// let pv_id = '';
let userId = JSON.parse(localStorage.getItem('USERINFO')) && JSON.parse(localStorage.getItem('USERINFO')).id;  // 是否有userId
// let deviceId = amplitude.getInstance().options.deviceId;

// if (userId) {
//   console.log(11111, moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' ' + userId);
//   pv_id = md5(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' ' + userId)
// } else {
//   console.log(22222, moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' ' + deviceId);
//   pv_id = md5(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' ' + deviceId);
// }

function pv_id_func(id) {
  return  md5(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' ' + id);
}

export default {
  userId,
  // deviceId,
  // pv_id,
  pv_id_func
}
