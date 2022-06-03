import moment from 'moment';
import VueCookies from 'vue-cookies'
// import AWS from 'aws-sdk';
//获取缓存前缀
export function getStoragePrefix(t) {
	return "shobby_web_b" + t;
}
export function formatPrice(s, n) {
	if (s === null || s === undefined || s === '') {
		return '0.00';
	}
	n = n > 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d.-]/g, "")).toFixed(n) + "";
	let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
	let t = "";
	for (let i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
}
export function transferDateFromNowDetail(date) {
	// date = '2020-11-15 10:35:00'
	if (date) {
		// global替换为本地缓存的请求时间戳
		const currentMoment = global.timestamp ? global.timestamp : moment();
		const targetDate = date ? moment.unix(date) : moment();
		const day = targetDate.diff(currentMoment, 'day');

		if (day >= 7) {
			return null;
		}
		if (day >= 3 && day < 7) {
			return `${day} Days`;
		}
		const hours = targetDate.diff(currentMoment, 'hour');
		if (hours >= 1 && day < 3) {
			const hours = targetDate.diff(currentMoment, 'hour');
			return `${hours} Hours`;
		}
		if (hours < 1) {
			const minute = targetDate.diff(currentMoment, 'minute');
			if (minute === 0) {
				return null;

			} else {
				return `${minute} Minutes`;
			}
		}
	} else {
		return null;
	}

}

//支付key
export function stripeKey() {
	if (process.env.NODE_ENV == 'production') {
		return "pk_live_51H1nrZLSavjdCkG4jayqYsS7pfheDToQGp3LSDQeb9VDTT45rmhNmN5IORG0UnzGKoFfOlO5bZKFbDAcwwfOL5ga00RRrEEi8Y";
	} else {
		return "pk_test_51H1nrZLSavjdCkG4nM95WBxlNX4CVNLNdinSnb4mn3xNE55q4nTPuGk1DFHuFouhg4fHMUYOBtKzRcrenD9sPqio009cgTIuqt";
	}
}

export function clearLocal() {
	for (const key in localStorage) {
		if (Object.hasOwnProperty.call(localStorage, key)) {
			if (key.indexOf(getStoragePrefix('')) != -1) {
				localStorage.removeItem(key)
			}
		}
	}
}
export function myTrim(str) {
	if(String.prototype.trim) {
			return str.trim();
	}
	return str.replace(/^\s+(.*?)\s+$/g, "$1");
}
/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accAdd(arg1, arg2) {
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}
/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accSub(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

export function isMobileOs(){
	var isMobile = /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);
	let {inAPP} = this.query;
	inAPP = inAPP||undefined
	// inAPP：1-在app内
	if (isMobile&&inAPP!=1) {
		// 当前网页在手机端打开
		return true
	} else {
		// 当前网页在PC端打开
		return false
	}
}
export class UploadImage {
  static async upload(images) {
    try {
      let resultImages = [];
      for (let i = 0; i < images.length; i++) {
        let uri = images[i];
        let formData = new FormData();
        formData.append('file', uri);
				let response = await fetch(process.env.VUE_APP_BASE_API + 'file/upload', {
          method: 'POST',
          headers: {
						'Access-Token': VueCookies.get('TOKEN'),
            'platform': '2',
						'os':'3',
						'type':'.jpg'
          },
					body:formData ,
        }).then((response) => {
          console.log('response====', response);
          return response.json();
        });
				console.log(response);
				if(response.code == 200) {
          resultImages.push(response.result);
				}
      }
      return resultImages;
    } catch (err) {
      console.log('err======', err);
      throw err;
    }
  }
}
export function dateAddSomeDays(date,day){
	if(date){
			const stillUtc = moment.unix(date);
			return moment(stillUtc)
					.add(day,"day")
					.local()
					.format('MMM DD')
	}else {
			return '';
	}
}
export function transFormTimeToLocalDate (date) {
	if (date) {
			const stillUtc = moment.unix(date);
			return moment(stillUtc)
					.local()
					.format('MMM DD, YYYY')
	} else {
			return '--'
	}
}
//判断是否有滚动条：vertical纵轴，horizontal横轴
export function hasScrolled(element,direction){
	if(direction==='vertical'){
			return element.scrollHeight>element.clientHeight;
	}else if(direction==='horizontal'){
			return element.scrollWidth>element.clientWidth;
	}
}