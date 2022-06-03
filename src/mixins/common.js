

export default {
  data() {
    return {
      isTourist: localStorage.getItem('ALLINFO')===null?true:JSON.parse(localStorage.getItem('ALLINFO')).isTouristPermission,
    }
  }
}