<template>
  <div class="address">
    <el-form v-if="true" :model="formInfoAddress" :rules="rulesAddress" ref="formInfoAddress" label-width="364px" label-position="top" class="addaddress-form" hide-required-asterisk>
      <el-col :span="12">
        <el-form-item label="" prop="firstName" style="margin-right: 12px;">
          <el-input v-model="formInfoAddress.firstName" placeholder="First Name *" maxlength="40" autocomplete="off" v-focusblurstyle></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="" prop="lastName" style="margin-left: 12px;">
          <el-input v-model="formInfoAddress.lastName" placeholder="Last Name *" maxlength="40" v-focusblurstyle></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="" prop="addressLine1">
          <el-input v-model="formInfoAddress.addressLine1" placeholder="Address Line 1 *" maxlength="200" v-focusblurstyle></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="" prop="addressLine2">
          <el-input v-model="formInfoAddress.addressLine2" placeholder="Address Line 2" maxlength="200" v-focusblurstyle></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="" prop="city" style="margin-right: 12px;">
          <el-input v-model="formInfoAddress.city" placeholder="City *" maxlength="40" v-focusblurstyle></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="" prop="state" style="margin-left: 12px;">
          <el-select class="input-state" v-model="formInfoAddress.state" placeholder="State*" clearable filterable no-match-text="No matching data" v-focusblurstyle>
            <el-option v-for="item in stateData" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="" prop="zipCode" style="margin-right: 12px;">
          <el-input v-model="formInfoAddress.zipCode" placeholder="Zip Code *" maxlength="40" v-focusblurstyle></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="" prop="country" style="margin-left: 12px;">
          <el-input class="input-country" v-model="formInfoAddress.country" placeholder="Country/Region *" maxlength="40" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="" prop="phoneNumber">
          <el-input class="input-phone-number" placeholder="Phone Number *" v-model="formInfoAddress.phoneNumber" maxlength="12" @input="onInputMobile(formInfoAddress)" v-focusblurstyle>
            <template slot="prepend">+1</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="input-btn margin-8-0">
        <el-form-item>
          <div class="input-btn-save"><div class="btn-save" @click="addressSave">Save</div></div>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import { addAddressCard } from '@/api/address'
export default {
  name: 'Address',
  data() {
    let formInfoAddress = {
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phoneNumber: ''
    }
    let validateMobile = (rule, value, callback) => {
      if (value.length === 12) {
        let pattern = /^[0-9]{3}[-][0-9]{3}[-][0-9]{4}$/;
        if(!(pattern.test(value))) {
          callback(new Error('This phone number is invalid.'));
        } else { callback() }
      } else { callback() }
    }
    let validateMobile2 = (rule, value, callback) => {
      if (value.length === 12) {
        let pattern = /^[0-9]{3}[-][0-9]{3}[-][0-9]{4}$/;
        if(!(pattern.test(value))) {
          callback(new Error('This phone number is invalid.'));
        } else { callback() }
      } else { callback(new Error('This phone number is invalid.')) }
    }
    return {
      formInfoAddress: formInfoAddress,
      formInfoAddressCopy: formInfoAddress,
      rulesAddress: {
        firstName: [{ required: true, message: 'Please enter first name.', trigger: 'blur' }],
        lastName: [{ required: true, message: 'Please enter last name.', trigger: 'blur' }],
        addressLine1: [{ required: true, message: 'Please enter addressLine1.', trigger: 'blur' }],
        city: [{ required: true, message: 'Please enter city.', trigger: 'blur' }],
        state: [{ required: true, message: 'Please enter state.', trigger: 'change' }],
        zipCode: [{ required: true, message: 'Please enter zip code.', trigger: 'blur' }],
        country: [{ required: true, message: 'Please enter country.', trigger: 'blur' }],
        phoneNumber: [
          { required: true, message: 'Please enter phoneNumber.', trigger: 'blur' },
          { validator: validateMobile, trigger: 'change' },
          { validator: validateMobile2, trigger: 'blur' }
        ]
      },
      stateData: ['AA', 'AE', 'AK', 'AL', 'AP', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'FM', 'GA', 'GU', 'HI', 'IA', 'ID',
      'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND',
      'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY']
    }
  },
  methods: {
    getSeparatorMobile(mobile) {
      if (!mobile) {
        return '';
      }
      const reg = new RegExp('\\s', 'g');
      const regLine = new RegExp('-', 'g');
      const mobileResultStr = mobile.replace(reg, '').replace(regLine, ''); //去掉空格
      const prefixSeparator = mobileResultStr.length > 3 ? '-' : '';
      const middleSeparator = mobileResultStr.length > 6 ? '-' : '';
      return (
        mobileResultStr.substring(0, 3) +
        prefixSeparator +
        mobileResultStr.substring(3, 6) +
        middleSeparator +
        mobileResultStr.substring(6, mobileResultStr.length)
      );
    },
    onInputMobile(val) {
      this.formInfoAddress.phoneNumber = this.getSeparatorMobile(val.phoneNumber);
    },
    addressSave() {
      this.$refs['formInfoAddress'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '',
            spinner: 'el-icon-loading',
            background: 'rgba(51, 51, 51, 0.25)'
          });

          this.formInfoAddress.firstName = this.formInfoAddress.firstName.trim();
          this.formInfoAddress.lastName = this.formInfoAddress.lastName.trim();
          this.formInfoAddress.addressLine1 = this.formInfoAddress.addressLine1.trim();
          this.formInfoAddress.addressLine2 = this.formInfoAddress.addressLine2.trim();
          this.formInfoAddress.city = this.formInfoAddress.city.trim();
          this.formInfoAddress.zipCode = this.formInfoAddress.zipCode.trim();

          let data = Object.assign({}, this.formInfoAddress, {
            userId: JSON.parse(localStorage.getItem('USERINFO')).id,
            phoneNumber: '+1' + this.formInfoAddress.phoneNumber.replace(/-/g,''),
            isDefault: 1
          })
          addAddressCard(data,() => {
            loading.close();
            this.$emit('addSuccessAddress');
          },
          () => {
            loading.close();
          },
          () => {
            loading.close();
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="less">
  .address {
    .addaddress-form {
      .el-input.is-disabled .el-input__inner {
        background: #ffffff;
        color: #333333;
      }
      .input-phone-number {
        .el-input-group__prepend {
          background: #ffffff;
          border: 1px solid #eeeeee;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
          border-right: none;
        }
        & > input {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
      .el-select .el-input.is-focus .el-input__inner, .el-select .el-input__inner:focus, .el-select .el-input__inner:hover {
        border-color: #eeeeee;
      }
      .input-state {
        width: 100%;
        @color: #333333;
        input::-webkit-input-placeholder {color: @color;} /* WebKit browsers */
        input:-moz-placeholder {color: @color;} /* Mozilla Firefox 4 to 18 */
        input::-moz-placeholder {color: @color;} /* Mozilla Firefox 19+ */
        input:-ms-input-placeholder {color: @color;} /* Internet Explorer 10+ */
        .el-icon-arrow-up:before, .el-icon-circle-close:before {
          color: #333333 !important;
        }
      }
      .input-btn-save {
        width: 100%;
        display: inline-flex;
        justify-content: center;
        .btn-save {
          cursor: pointer;
          text-align: center;
          width: 180px;
          height: 40px;
          line-height: 40px;
          background: #333333;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
          border-radius: 20px;
          color: #ffffff;
        }
        .btn-save:hover {
          opacity: 0.6;
        }
        .btn-save:active {
          opacity: 0.8;
        }
      }
    }
  }
</style>