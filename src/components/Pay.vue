<template>
  <div class="pay">
    <div class="card-box">
      <div class="card-number-box">
        <!-- <div class="title">Credit or Debit Card Number</div> -->
        <div
          id="card-number"
          class="stripe-input"
          :class="{
            'no-empty': cardNumberDisable,
            'is-focus': cardNumberFocus,
          }"
        ></div>
      </div>
      <div class="expiry-and-cvc">
        <div class="card-expiry-box">
          <!-- <div class="title">Expiration</div> -->
          <div
            id="card-expiry"
            class="stripe-input"
            :class="{
              'no-empty': cardExpiryDisable,
              'is-focus': cardExpiryFocus,
            }"
          ></div>
        </div>
        <div class="card-cvc-box">
          <!-- <div class="title">Security Code (CVV)</div> -->
          <div
            id="card-cvc"
            class="stripe-input"
            :class="{ 'no-empty': cardCvcDisable, 'is-focus': cardCvcFocus }"
          ></div>
        </div>
      </div>
      <div class="card-postal-box">
        <!-- <div class="title">Zip Code</div> -->
        <div
          id="card-postal"
          class="stripe-input"
          :class="{
            'no-empty': cardPostalDisable,
            'is-focus': cardPostalFocus,
          }"
        ></div>
      </div>
    </div>
    <div class="crad-save">
      <div v-if="!noDisabled" class="save-buton" :class="{ nodisabled: noDisabled }">Save</div>
      <div v-else class="save-buton" :class="{ nodisabled: noDisabled }" @click="saveCard">Save</div>
    </div>
  </div>
</template>

<script>
import { stripeKey } from "@/utils/common";
import { loadStripe } from "@stripe/stripe-js";
import { addPaymentCart, createCustomer } from '@/api/stripe'
export default {
  name: "Pay",
  data() {
    return {
      cardNumber: '',
      stripe: '',
      updateIsDefault: 0,
      cardNumberDisable: false,
      cardExpiryDisable: false,
      cardCvcDisable: false,
      cardPostalDisable: false,
      cardNumberFocus: false,
      cardExpiryFocus: false,
      cardCvcFocus: false,
      cardPostalFocus: false,
    };
  },
  props:{
    setDefault:{
      typeof:Number,
      default:0
    }
  },
  computed: {
    noDisabled() {
      if (
        this.cardNumberDisable &&
        this.cardExpiryDisable &&
        this.cardCvcDisable &&
        this.cardPostalDisable
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {},
  mounted() {
    this.createStripe();
  },
  methods: {
    //创建
    async createStripe() {
      let than = this;
      than.stripe = await loadStripe(stripeKey());
      let elements = than.stripe.elements({
        locale: "en",
      });
      than.cardNumber = elements.create("cardNumber",{
        placeholder:'Enter card number'
      });
      let cardExpiry = elements.create("cardExpiry",{
        placeholder:'Enter Expiration'
      });
      let cardCvc = elements.create("cardCvc",{
        placeholder:'Enter security code'
      });
      let cardPostal = elements.create("postalCode",{
        placeholder:'Enter zip code'
      });
      
      than.cardNumber.mount("#card-number");
      cardExpiry.mount("#card-expiry");
      cardCvc.mount("#card-cvc");
      cardPostal.mount("#card-postal");

      than.cardNumber.on("change", function (e) {
        than.cardNumberDisable = e.empty ? false : true;
        if (e.complete) cardExpiry.focus();
      });
      than.cardNumber.on("focus", function () {
        than.cardNumberFocus = true;
      });
      than.cardNumber.on("blur", function () {
        than.cardNumberFocus = false;
      });

      cardExpiry.on("change", function (e) {
        than.cardExpiryDisable = e.empty ? false : true;
        if (e.complete) cardCvc.focus();
      });
      cardExpiry.on("focus", function () {
        than.cardExpiryFocus = true;
      });
      cardExpiry.on("blur", function () {
        than.cardExpiryFocus = false;
      });

      cardCvc.on("change", function (e) {
        than.cardCvcDisable = e.empty ? false : true;
        if (e.complete) cardPostal.focus();
      });
      cardCvc.on("focus", function () {
        than.cardCvcFocus = true;
      });
      cardCvc.on("blur", function () {
        than.cardCvcFocus = false;
      });

      cardPostal.on("change", function (e) {
        than.cardPostalDisable = e.empty ? false : true;
      });
      cardPostal.on("focus", function () {
        than.cardPostalFocus = true;
      });
      cardPostal.on("blur", function () {
        than.cardPostalFocus = false;
      });
    },
    saveCard() {
      let than = this;
      let loading = than.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      than.stripe.createToken(than.cardNumber).then(function(result) {
        if (result.error) {
          than.$notify({
            title: "Oops",
            message: result.error.message,
            iconClass:'el-icon-warning-outline',
            duration: 3000,
            showClose: false
          });
          loading.close();
        } else {
          createCustomer(result.token.id, function(res) {
            addPaymentCart( {
              "customerId": res.result,
              "isDefault": than.setDefault,
              "mask": result.token.card.last4,
              "officialName": result.token.card.brand,
              "type": 1
            },
            () => {
              loading.close();
              than.$emit('addSuccessPay');
            },
            () => {},
            () => {})
          }, function(res) {
            loading.close();
            than.$notify({
              title: "Oops",
              message: res.data.message,
              iconClass:'el-icon-warning-outline',
              duration: 3000,
              showClose: false
            });
          }, function() {})
        }
      });
    }
  }
}
</script>

<style lang="less">
  @import "../styles/inputPay.less";
  .pay {
    .stripe-input {
      height: 48px !important;
      margin-top: 16px;
      border: 1px solid #eeeeee;
      background: #eeeeee;
    }
    .card-box .expiry-and-cvc {
      margin: 0 !important;
    }
    #card-expiry, #card-postal {
      margin-right: 8px;
    }
    #card-cvc {
      margin-left: 8px;
    }
    .crad-save {
      margin-top: 24px !important;
      .save-buton {
        font-size: 18px;
        width: 180px;
        height: 40px;
        line-height: 40px;
        &.nodisabled {
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
        }
        &.nodisabled:active { opacity: 0.8; }
        &.nodisabled:hover { opacity: 0.6; }
      }
    }
  }
</style>