import {myTrim} from '@/utils/common'
import successApi from './successInfo';
const share = {
  methods:{
    shareInvitationCode(code,_info={},type='noe') {
      const userInfo = JSON.parse(localStorage.getItem('USERINFO'));
      let invitationCode = code || userInfo.invitationCode;
      var oInput = document.createElement("input");
      oInput.value = invitationCode;
      if(type=='two') {
        oInput.value = `I have an invite to this amazing dropshipping service called Trendsi and want to you to join. Use my referral code ${invitationCode} to sign up. Here is the link! https://www.trendsi.com/download`;
      }
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      document.body.removeChild(oInput);
      const info = {
        icon:require('@/static/success@2x.png'),
        title:'Copied',
        tip:_info.tip||'Your referral code has been copied.',
        selfStyle:'width:40px;height:40px'
      }
      successApi.methods.customImgCreatedSuccessInfo.bind(this,info)()
    },
    shareShop(id,tyep='product',value=null) {
      const userInfo = JSON.parse(localStorage.getItem('USERINFO'));
      var oInput = document.createElement("input");
      var url;
      if( userInfo.domainName === null || userInfo.domainName === undefined || userInfo.domainName === '' ) {
        this.$router.push({path: '/login/setup-info', query: {isShowSetUpLater: false}})
      } else {
        url = tyep=='product'?`${userInfo.domainName}/product-share/`:`${userInfo.domainName}/collection-share/`
        if(value) {
          oInput.value = value;
        }else {
          oInput.value = `${url}${id}`;
        }
        document.body.appendChild(oInput);
        // oInput.style='display:none'
        oInput.select();
        document.execCommand("Copy");
        document.body.removeChild(oInput);
        var div = (
          <div class="self">
            <div class="img-box link"></div>
            <div>
              <div class="title">
                <span>Link Copied</span>
              </div>
              <div class="tip">
                <span>You can paste this when you share.</span>
              </div>
            </div>
          </div>
        );
        this.$notify({
          customClass: "seft-notify link",
          dangerouslyUseHTMLString: true,
          showClose: false,
          duration: 3000,
          message: div,
        });
      }
    },
    shareShopInfo(info) {
      var oInput = document.createElement("textarea");
      // var USERINFO = localStorage.getItem('USERINFO')
      // var shopId = JSON.parse(USERINFO).shopId
      const userInfo = JSON.parse(localStorage.getItem('USERINFO'));
      const url = `${userInfo.domainName}/product-share/`
      oInput.value = myTrim(`${url}${info.id}${info.brand?info.brand:''}\n\n${info.title?info.title:''}\n\n${info.deliveryRemark?info.deliveryRemark:''}\n\n${info.deliveryFeeRemark?info.deliveryFeeRemark:''}\n\n${info.refundRemark?info.refundRemark:''}\n\n${info.text?info.text:''}`);
      document.body.appendChild(oInput);
      // oInput.style='display:none'
      oInput.select();
      document.execCommand("Copy");
      document.body.removeChild(oInput);
      // var div = (
      //   <div class="self">
      //     <div class="img-box link"></div>
      //     <div>
      //       <div class="title">
      //         <span>Product Info Copied</span>
      //       </div>
      //       <div class="tip">
      //         <span>You can paste this when you share.</span>
      //       </div>
      //     </div>
      //   </div>
      // );
      // this.$notify({
      //   customClass: "seft-notify link",
      //   dangerouslyUseHTMLString: true,
      //   showClose: false,
      //   duration: 3000,
      //   message: div,
      // });
    },
  }
}
export default share