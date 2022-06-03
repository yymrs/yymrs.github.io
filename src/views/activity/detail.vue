<template>
  <div class="activity-detail-page">
    <div class="activity-detail-header">
      <div class="back-img-box">
        <!-- <img class="logo-back-img" src="@/static/headerLogoBack@2x.png" /> -->
        <img class="logo-img" src="@/static/projName@2x.png" />
      </div>
    </div>
    <div class="activity-detail-main">
      <div class="main-braner">
        <picture>
            <source srcset="@/static/activityDetail/baner2.png"
                    media="(max-width: 36em)">
            <img src="@/static/activityDetail/baner.png" alt="" />
        </picture>
      </div>
      <div class="coupon-list">
        <img class="mobile" src="@/static/activityDetail/coupon.png" alt="">
        <img src="@/static/activityDetail/coupon1.png" alt="" />
        <img src="@/static/activityDetail/coupon2.png" alt="" />
        <img src="@/static/activityDetail/coupon3.png" alt="" />
      </div>
      <p class="tip-one">
        Enjoy 3% - 5% rebates on all qualified orders. Sell more, earn more. See detailed rules below:
      </p>
      <div class="activity-rules" style="margin-top: 48px">Rules</div>
      <div class="activity-rules-list one">
        <!-- 
Earn a 3% rebate on each order over $39. 
Earn a 4% rebate on each order over $59. 
Earn a 5% rebate on each order over $119.
All products on Trendsi are eligible for rebates. 
Canceled, unpaid, and refunded orders are NOT eligibile for rebates.
Rebates will be issued within 30 days after the event (07/15/21 - 08/15/21) ends.
         -->
        <p>Earn a 3% rebate on each order over $39.</p>
        <p>Earn a 4% rebate on each order over $59.</p>
        <p>Earn a 5% rebate on each order over $119.</p>
        <p>All products on Trendsi are eligible for rebates.</p>
        <p>Canceled, unpaid, and refunded orders are NOT eligibile for rebates.</p>
        <p>Rebates will be issued within 30 days after the event (07/15/21 - 08/15/21) ends.</p>
      </div>
      <div class="activity-back-button">
        <div class="button" @click='backFun'>Start Selling Now</div>
      </div>
      <div class="get-money-img">
        <picture>
            <source srcset="@/static/activityDetail/getMoney2.png"
                    media="(max-width: 36em)">
            <img src="@/static/activityDetail/getMoney.jpg" alt="" />
        </picture>
      </div>
      <div class="get-money-number">$100 Add & Sell Bonus</div>
      <div class="money-tip">We are offering you a bonus of $100 if you add products and sold during the event. See detailed rules below:</div>
      <div class="activity-rules" style="margin-top: 32px">Rules</div>
      <div
        class="activity-rules-list two"
        style="max-width: 1000px; margin-top: 32px"
      >
      <!-- 
        You will receive a bonus of $100 if you add an additional 100 Trendsi products to your Shopify store and sell over $300 during the event. 
Canceled, unpaid, refunded, and sample orders are NOT eligible for this bonus.
You are eligible for receiving the bonus only once.
The bonus will be issued within 30 days after the event (07/15/21 - 08/15/21) ends.
       -->
        <p>You will receive a bonus of $100 if you add an additional 100 Trendsi products to your Shopify store and sell over $300 during the event. 
        </p>
        <p>Canceled, unpaid, refunded, and sample orders are NOT eligible for this bonus.</p>
        <p>You are eligible for receiving the bonus only once.</p>
        <p>The bonus will be issued within 30 days after the event (07/15/21 - 08/15/21) ends.</p>
      </div>
      <div class="sharing-caring-bonus">
        <div class="title">$100 Sharing is Caring Bonus</div>
        <div class="money-tip" style="max-width:1024px;margin:0 auto;margin-top:27px">We are also offering you an increased referral bonus of $100 for every friend that you invite to Trendsi. Invite more, earn more. See detailed rules below:</div>
        <div class="activity-rules" style="margin-top: 24px">Rules</div>
        <!-- <div class="reward">
          We are also offering you an increased referral bonus of $100 for every
          small business owner,<br />
          that successfully registers with Trendsi, you refer.
        </div> -->
        <!-- 
          For every friend that you invite to join Trendsi, you will receive a $100 referral bonus if he/she sold over 10 orders and made more than $300 in sales on Trendsi within the first 30 days of sign-up. 
Canceled, unpaid, refunded, and sample orders will not be added to the final sales and order count.
Your friends need to enter your referral code during sign-up in order to be eligible for this event.
The bonus will be issued within 60 days after the event (07/15/21 - 08/15/21) ends.


         -->
        <div
          class="activity-rules-list three"
          style="margin-top: 40px; max-width: 1000px"
        >
          <p>For every friend that you invite to join Trendsi, you will receive a $100 referral bonus if he/she sold over 10 orders and made more than $300 in sales on Trendsi within the first 30 days of sign-up. 
          </p>
          <p>Canceled, unpaid, refunded, and sample orders will not be added to the final sales and order count.
          </p>
          <p>Your friends need to enter your referral code during sign-up in order to be eligible for this event.</p>
          <p>The bonus will be issued within 60 days after the event (07/15/21 - 08/15/21) ends.</p>
        </div>
        <div class="activity-user-code-button">
          <div class="button" v-if="invitationCode" @click="shareInvitationCode(invitationCode,{},'two')">
            Copy My Referral Code: {{invitationCode}}
          </div>
          <div class="button button2" v-if="invitationCode" @click="shareInvitationCode(invitationCode,{},'two')">
            Copy My Referral Code: {{invitationCode}}
          </div>
        </div>
      </div>
      <div class="page-feature">
        <div class="how-to-invite">
          How to Invite 
        </div>
        <div class="feature1">
          <div class="feature-title">
            <div class="circular">
              <span>1</span>
            </div>
            <span class="tip-text">Find and copy your referral code on either Trendsi Web or Mobile App</span>
          </div>
          <div class="feature1-bottom" style="display:flex;justify-content:space-between">
            <div class="feature1-left">
            <img src="@/static/activityDetail/home.png" alt="" />
            <p>(Trendsi Web App)</p>
          </div>
          <div class="feature1-right">
            <div>
              <img src="@/static/activityDetail/appEarn.png" alt="" />
              <img src="@/static/activityDetail/appRefer.png" alt="" />
            </div>
            <p>(Trendsi Mobile App)</p>
          </div>
          </div>
        </div>
        <div class="feature3">
          <div class="feature1-left">
            <div class="feature-title">
              <div class="circular">
                <span>2</span>
              </div>
              <span class="tip-text">Share your referral code with your friends</span>
            </div>
            <img src="@/static/activityDetail/invite.png" alt="" />
            
          </div>
          <div class="feature1-right">
             <div class="feature-title">
              <div class="circular">
                <span>3</span>
              </div>
              <span class="tip-text"
                >Your friends enter the referral code during sign-up</span
              >
            </div>
            <div class="img-two">
              <img src="@/static/activityDetail/store.png" alt="" />
              <img src="@/static/activityDetail/appStore.png" alt="" />
            </div>
           
          </div>
        </div>
        <div class="feature4">
          <div class="feature1-left">
            <div class="feature-title">
              <div class="circular">
                <span>4</span>
              </div>
              <span class="tip-text">Your friends start selling within 30 days</span>
            </div>
            <img src="@/static/activityDetail/standard.png" alt="" />
            
          </div>
          <div class="feature1-right">
            <div class="feature-title">
              <div class="circular">
                <span>5</span>
              </div>
              <span class="tip-text">Receive $100 bonus if your friends reach sales goals</span>
            </div>
            <img src="@/static/activityDetail/getting.png" alt="" />
           
          </div>
        </div>
      </div>
      <p class="interpretation">
        Paypal is the preferred payment method to settle your rebates & bonuses.
Sales on Trendsi refers to order amount you paid to Trendsi (not the order amount you sold on Shopify).
If your order is partially refunded, the order and remaining amount will still be eligible for all above events.  
Trendsi reserves the right for the final interpretation of the above event rules. 
      </p>
    </div>
    <div class="activity-detail-footer">
      <div class="activity-detail-footer-left">
        <span>©2021 Trendsi. All rights reserved.</span>
        <a href="https://www.trendsi.com/terms-of-service" target="_blank"><span>Terms of Service</span></a>
        <a href="https://www.trendsi.com/privacy-policy" target="_blank"><span>Privacy Policy</span></a>
      </div>
      <div class="activity-detail-footer-right">
        <div class="icon-item">
          <a href="https://www.instagram.com/trendsishop/" target="_blank"
            ><img
              src="https://static.wixstatic.com/media/27f8d4_0de23d9a34b540ceaa9cc9db9d176220~mv2.png/v1/fill/w_20,h_20,al_c,q_85,usm_0.66_1.00_0.01/Instagram.webp"
              alt=""
          /></a>
        </div>
        <div class="icon-item">
          <a href="https://www.facebook.com/Trendsi-106938147841416/" target="_blank">
            <img
              src="https://static.wixstatic.com/media/27f8d4_86ca9b4c45f44afc9ff7f6f9c9cacbf7~mv2.png/v1/fill/w_20,h_20,al_c,q_85,usm_0.66_1.00_0.01/Facebook.webp"
              alt=""
            />
          </a>
        </div>
        <div class="icon-item">
          <a href="https://vm.tiktok.com/ZMeJ8Lg9E/" target="_blank">
            <img
              src="https://static.wixstatic.com/media/27f8d4_b7601adb0b92451bb0fc41c8a7d86c18~mv2.png/v1/fill/w_20,h_20,al_c,q_85,usm_0.66_1.00_0.01/TikTok.webp"
              alt=""
            />
          </a>
        </div>
        <div class="icon-item">
          <a href="https://www.pinterest.com/TrendsiShop/" target="_blank">
            <img
              src="https://static.wixstatic.com/media/27f8d4_406d10b5e52b4a32b11e16c4a130c1f8~mv2.png/v1/fill/w_20,h_20,al_c,q_85,usm_0.66_1.00_0.01/Pinterest.webp"
              alt=""
            />
          </a>
        </div>
        <div class="icon-item">
          <a href="https://twitter.com/TrendsiShop" target="_blank">
            <img
              src="https://static.wixstatic.com/media/27f8d4_dc07fe31080a4330b7b85a284d50b2db~mv2.png/v1/fill/w_20,h_20,al_c,q_85,usm_0.66_1.00_0.01/Twitter.webp"
              alt=""
            />
          </a>
        </div>
        <div class="icon-item">
          <a href="https://www.linkedin.com/company/trendsi" target="_blank">
            <img
              src="https://static.wixstatic.com/media/27f8d4_b9ecf2070a0946d68448e8e9d5ada0f1~mv2.png/v1/fill/w_20,h_20,al_c,q_85,usm_0.66_1.00_0.01/LinkedIn.webp"
              alt=""
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import VueCookies from 'vue-cookies'
import shareApi from '@/mixins/share'

export default {
  name: "ActivityDetail",
  mixins:[shareApi],
  computed: {
    invitationCode() {
      // if(!this.$store.state.user.userInfo.invitationCode) {
      //   VueCookies.remove('TOKEN')
      // }
      return this.$route.query.yqCode || this.$store.state.user.userInfo.invitationCode
    }
  },
  data() {
    return {
      id:null
    };
  },
  // created() {
  //   localStorage.setItem('ACTIVITYURL', window.location.href);
  // },
  mounted() {
    let html = document.querySelector('html')
    html.style.fontSize = '62.5%'
    this.id = this.$route.query.id;
  },
  beforeDestroy() {
    let html = document.querySelector('html')
    html.style.fontSize = 'initial'
  },
  methods:{
    backFun() {
      const {href} = this.$router.resolve({ path: `/event?id=${this.id}`});
      window.open(href,'_blank')
      // this.$router.replace(`/activity?id=${this.id}`)
    }
  }
};
</script>

<style lang='less'>

.activity-detail-page {
  max-width: 1440px;
  margin: 0 auto;
  .activity-detail-header {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 65px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    .back-img-box {
      padding-left: 57px;
      display: flex;
      align-items: center;
      // cursor: pointer;
    }
    // .logo-back-img {
    //   height: 30px;
    //   margin-right: 20px;
    // }
    .logo-img {
      height: 40px;
    }
  }
  .activity-detail-main {
    padding-top: 90px;
    .main-braner {
      width: 100%;
      img {
        display: block;
        width: 100%;
      }
    }
    .coupon-list {
      margin: 60px 0;
      display: flex;
      justify-content: center;
      .mobile {
        display: none;
      }
      img {
        max-width: 333px;
        max-height: 210px;
        border-radius: 30px;
        margin-right: 24px;
        width: 30%;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .tip-one {
      white-space: pre-wrap;
      font-size: 24px;
      padding: 0 20px;
      font-weight: 500;
      line-height: 150%;
      text-align: center;
      color: #666666;
    }
    .activity-rules {
      text-align: center;
      margin-top: 64px;
      font-weight: bold;
      font-size: 36px;
      line-height: 120%;
      text-align: center;
      color: #333333;
    }
    .activity-rules-list {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 20px;
      margin-top: 24px;
      p {
        // min-width: 375px;
        position: relative;
        font-weight: 500;
        font-size: 24px;
        line-height: 180%;
        color: #333333;
        display: flex;
        align-items: baseline;
        &::before {
          content: "";
          left: 0;
          margin-right: 15px;
          flex-shrink: 0;
          display: inline-block;
          // position: absolute;
          // vertical-align: middle;
          width: 10px;
          background: #dfbc77;
          height: 10px;
          border-radius: 50%;
        }
      }
    }
    .activity-back-button {
      margin-top: 56px;
      margin-bottom: 80px;
      display: flex;
      justify-content: center;
      // padding: 24px 0 22px 0;
      .button {
        cursor: pointer;
        font-weight: 500;
        font-size: 36px;
        /* or 43px */
        width: 536px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        color: #ffffff;
        background: #c79818;
        box-shadow: 0px 20px 40px rgba(199, 150, 24, 0.2);
        border-radius: 60px;
      }
    }
    .get-money-img {
      // margin-top: 80px;
      display: flex;
      padding: 0 64px;
      img {
        width: 100%;
        display: block;
      }
    }
    .get-money-number {
      margin-top: 77px;
      font-weight: bold;
      font-size: 48px;
      line-height: 120%;
      /* identical to box height, or 58px */

      text-align: center;

      /* Gold */

      color: #c79818;
    }
    .money-tip {
      margin-top: 11px;
      font-size: 24px;
      line-height: 140%;
      text-align: center;
      color: #666666;
    }
    .sharing-caring-bonus {
      margin-top: 80px;
      padding: 64px 0 85px 0; 
      max-width: 1440px;
      background: #f9f9f9;
      .title {
        font-weight: bold;
        font-size: 48px;
        line-height: 120%;
        /* identical to box height, or 58px */

        text-align: center;

        /* Gold */

        color: #c79818;
      }
      .activity-user-code-button {
        margin-top: 27px;
        display: flex;
        justify-content: center;
        .button2 {
          display: none;
        }
        .button {
          cursor: pointer;
          font-weight: 500;
          font-size: 36px;
          /* or 43px */
          width: 597px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          color: #ffffff;
          background: #c79818;
          box-shadow: 0px 20px 40px rgba(118, 85, 0, 0.2);
          border-radius: 60px;
          span {
            font-size: 36px;

            font-weight: 700;
          }
        }
      }
      .reward {
        margin-top: 40px;
        font-size: 24px;
        line-height: 140%;
        /* or 34px */
        text-align: center;

        /* Grey 66 */

        color: #666666;
      }
    }
    .page-feature {
      max-width: 1300px;
      margin: 0 auto;
      margin-top: 80px;
      .how-to-invite {
        font-weight: bold;
        font-size: 48px;
        line-height: 120%;
        text-align: center;
        color: #C79818;
        margin-bottom: 10px;
      }
      .feature1 {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // flex-wrap: wrap;
        @media (max-width:650px) {
          .feature1-bottom {
            flex-wrap: wrap;
            justify-content: center !important;
          }
          .feature1-left,.feature1-right  {
            flex: initial !important;
          }
          .feature-title {
            justify-content: center;
          }
        }
        .feature-title {
          display: flex;
          align-items: center;
          .tip-text {
            margin-left: 16px;
          }
        }
        .feature1-left {
          flex: 1;
          text-align: center;

          .feature-title {
            display: flex;
            align-items: center;
          }
          img {
            width: 392.31px;
            max-width: 100%;
            height: 273px;
            // max-width: 388px;
            // height: 270px;
          }
          p {
            // top: -20px;
            // left: 25px;
            margin-top: -30px;
            // max-width: 348px;
            font-weight: 500;
            font-size: 18px;
            line-height: 120%;
            /* or 22px */
            text-align: center;
            color: #333333;
          }
          .tip-text {
            margin-left: 16px;
            font-weight: 500;
            font-size: 24px;
            line-height: 120%;
            color: #333333;
          }
        }
        .feature1-right {
          flex: 1;
          text-align: center;
          img {
            // width: 392.31px;
            height: 273px;
          }
          p {
            margin-top: -30px;
            // max-width: 348px;
            font-weight: 500;
            font-size: 18px;
            line-height: 120%;
            /* or 22px */
            text-align: center;
            color: #333333;
          }
        }
      }
      .feature2 {
        display: flex;
        justify-content: space-between;
        .feature1-left {
          img {
            width: 352px;
          }
        }
        .feature-title {
          display: flex;
          align-items: center;
          .tip-text {
            margin-left: 16px;
          }
        }
      }
      .feature3 {
        margin-top: 56px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        @media (max-width:870px) {
          justify-content: center;
          .feature1-left, .feature1-right {
            flex: initial !important;
          } 
        }
        .feature1-left {
          flex: 1;
          text-align: center;
          img {
              width: 352px;
              max-width: 100%;
          }
        }
        .feature1-right {
          flex: 1;
          text-align: center;
          .img-two {
            display: flex;
            align-items: center;
            // flex-wrap: wrap;
          }
          img {
            &:nth-of-type(1) {
              max-width: 451px;
            }
            &:nth-of-type(2) {
              height: 270px;
            }
          }
        }
        .feature-title {
          display: flex;
          align-items: center;
          .tip-text {
            margin-left: 16px;
          }
        }
      }
      .feature4 {
        margin-top: 50px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        @media (max-width:740px) {
          justify-content: center;
          .feature1-left ,.feature1-right {
            flex: initial !important;
          } 
        }
        .feature1-left {
          flex: 1;
          text-align: center;
          img {
              width: 402px;
              height: 247px;
          }
        }
        .feature1-right {
          flex: 1;
          text-align: center;
          .img-two {
            display: flex;
            align-items: center;
          }
          img {
              width: 328px;
              // height: 247px;
          }
        }
        .feature-title {
          display: flex;
          align-items: center;
          .tip-text {
            margin-left: 16px;
          }
        }
      }
      .circular {
        width: 28px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #eee1bc;
        border-radius: 50%;
        flex-shrink: 0;
        padding: 5px;
        span {
          background: #c79618;
          display: block;
          width: 26px;
          border-radius: 50%;
          height: 26px;
          line-height: 26px;
          font-weight: bold;
          font-size: 14px;
          /* identical to box height, or 17px */

          text-align: center;

          /* White */

          color: #ffffff;
        }
      }
    }
    .interpretation {
      font-weight: 500;
      font-size: 18px;
      line-height: 150%;
      margin: 0 auto;
      margin-top: 40px;
      max-width: 840px;
      text-align: center;
      color: #979797;
    }
  }
  .activity-detail-footer {
    margin-top: 33px;
    padding: 0 47px;
    padding-bottom: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    @media (max-width:740px) {
      justify-content: center;
      .activity-detail-footer-right {
        margin-top: 20px;
      }
    }
    .activity-detail-footer-left {
      color: rgb(127, 141, 153);
      font-size: 16px;
      a {
        color: rgb(127, 141, 153);
        text-decoration: none;
        &:nth-of-type(1) {
          margin: 0 50px;
        }
      }
    }
    .activity-detail-footer-right {
      display: flex;

      .icon-item {
        margin-right: 10px;
        img {
          &:hover {
            opacity: 0.8;
          }
          width: 20px;
          height: 20px;
          display: block;
        }
      }
    }
  }
}
@media (max-width: 36em) {
  body {
    zoom:1
  }
  .activity-detail-page {
    // background: #f40;
    // font-size: 1.4rem !important;
    .coupon-list {
      margin: 1.6rem 0 0 0 !important;
      img {
        display: none;
      }
      .mobile {
        max-width: 100% !important;
        // height: 8.2rem !important;
        width: 100% !important;
        border-radius: 0 !important;
        margin-right: 0 !important;
        display: block !important;
      }
    }
    .tip-one {
      margin: 2.4rem 0 1.6rem 0;
    }
    .activity-rules {
      font-size: 1.8rem !important;
      margin-top: 0 !important;
    }
    .tip-one,.activity-rules-list p,.money-tip,.interpretation {
      font-size: 1.4rem !important;
      font-weight: 400 !important;
    }
    .money-tip {
      margin-bottom: 2.4rem;
    }
    .activity-back-button {
      display: none !important;
    }
    .get-money-number {
      margin-top: 4rem !important;
      font-size:2.4rem !important;
    }
    .get-money-img {
      margin-top: 2.4rem;
      padding: 0 1.6rem !important;
    }
    .activity-rules-list {
      max-width: 100% !important;
      margin-top: 1.6rem !important;
    }
    .sharing-caring-bonus {
      margin-top: 2.4rem !important;
      padding:3.2rem 0 2.4rem 0 !important;
      .title {
        font-size: 2.4rem !important;
      }
      .activity-rules {
        margin-top: 1.6rem !important;
      }
    }
    .activity-user-code-button {
      .button {
        display: none;
      }
      .button2 {
        display: block !important;
        max-width: 34rem !important;
        
        height: 4.8rem !important;
        line-height: 4.8rem !important;
        font-size: 1.8rem !important;
      }
    }
    .page-feature {
      margin-top: 4rem !important;
      .how-to-invite {
        display: none;
      }
      .tip-text {
        font-size:1.4rem !important;
        font-weight: 500;
        margin-left: .8rem !important;
      }
      .feature3 {
        margin-top: 4rem!important;
        .feature1-right {
          margin-top: 4rem;
        }
        .img-two {
          margin-top: 2.3rem;
          img:nth-child(1) {
            // width: 100%;
            max-width: 26.3rem !important;
          }
          img:nth-child(2) {
            // max-width: 7.1rem !important;
            height: 15.3rem !important;
          }
        }
      }
      .feature4 {
        margin-top: 4rem !important;
        text-align: center;
        .feature-title {
          justify-content: center;
        }
        .feature1-left img {
          max-width: 100% !important; 
        }
        .feature1-right img { 
          margin-top: 2rem;
          max-width: 100% !important; 
        }
      }
    }
    .interpretation {
      padding-bottom: 2rem !important;
    }
    .activity-detail-footer {
      display: none;
    }
    .activity-detail-header {
      display: none;
    }
    .activity-detail-main {
      padding: 0 !important;
    }
  }
}
</style>