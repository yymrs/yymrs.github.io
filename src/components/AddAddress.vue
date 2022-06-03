<template>
  <div class="addaddress">
    <el-dialog
      class="dialog-addaddress"
      title="Shipping Addresses"
      :visible.sync="dialogVisible"
      width="640"
      :modal-append-to-body="modalAppend"
      :modal="modal"
      :before-close="onClose"
      center>
      <div style="min-height: 232px;">
        <div class="addaddress-card" v-for="(item, index) in listcard" :key="index">
          <div class="addaddress-card-item">
            <div class="addaddress-card-left">
              <div class="addaddress-card-check"><input
                @input="inputradio(item, index)" :id="index" type="radio" name="card" :value="item.id" 
                :checked="((checked === index) || ((defaultChecked && Number(defaultChecked.id) === item.id) || (defaultChecked?0:item.isDefault)) && checkedDeafult)?true:false" />
              </div>
              <div class="addaddress-card-info">
                <label :for="index">
                  <img v-if="(checked === index) || ((defaultChecked && Number(defaultChecked.id) === item.id) || (defaultChecked?0:item.isDefault)) && checkedDeafult" src="../static/check@2x.png" alt="">
                  <img v-else src="../static/nocheck@2x.png" alt="">
                  <div class="addaddress-card-person">
                    <div class="addaddress-card-name">{{ item.firstName + ' ' + item.lastName }}</div>
                    <div v-if="item.isDefault" class="addaddress-card-default">Default</div>
                    <div class="addaddress-card-addressinfo">{{ item.addressLine1 + ((item.addressLine2)?(', ' + item.addressLine2):'') + ', ' + item.city + ', ' + item.state + ', ' + item.zipCode }}</div>
                  </div>
                </label>
              </div>
            </div>
            <div class="addaddress-card-delete">
              <div @click="editCard(item)"><img src="../static/edit@2x.png" alt=""></div>
              <div @click="deleteCard(item)"><img src="../static/delete@2x.png" alt=""></div>
            </div>
          </div>
        </div>
        <div class="addaddress-card-add" @click="AddCard">
          <img src="../static/add@2x.png" alt="">
          Add New Address
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="setType==='setDefault' && (listcard.length===0 || (listcard.length===1 && oneDefault===true))" class="opacity-disabled"><div>Set As Default</div></div>
        <div v-if="setType==='setDefault' && (listcard.length!==0 && !(listcard.length===1 && oneDefault===true))" class="add-pay-btn"><div @click="setDefault">Set As Default</div></div>
        <div v-if="setType==='useCard' && listcard.length===0" class="opacity-disabled"><div>Use This Address</div></div>
        <div v-if="setType==='useCard' && listcard.length!==0"  class="add-pay-btn"><div @click="useCard">Use This Address</div></div>
      </div>
    </el-dialog>
    
    <el-dialog class="dialog-delete" title="Delete Address" width="300px"
      :visible.sync="dialogFormVisibleDelete"
      center
      :modal-append-to-body="modalAppendDelete"
      :modal="true"
      @close="closeDialog">
      <div><span>Are you sure you want to delete this address?</span></div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogDelete">Delete</div>
        <div class="dialog-btntext dialog-cancel" @click="dialogFormVisibleDelete=false">Cancel</div>
      </div>
    </el-dialog>

    <el-dialog class="dialog-edit" width="540px"
      :title="dialogTitle"
      v-if="inputaddressShow"
      :visible.sync="inputaddressShow"
      center
      :modal-append-to-body="false"
      :modal="true"
      @close="closeDialog">
      <el-form :model="formInfo" :rules="rules" ref="formInfo" label-width="364px" label-position="top" class="addaddress-form" hide-required-asterisk>
        <el-col :span="12">
          <el-form-item label="First Name *" prop="firstName" style="margin-right: 12px;">
            <el-input v-model="formInfo.firstName" placeholder="" maxlength="40" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Last Name *" prop="lastName" style="margin-left: 12px;">
            <el-input v-model="formInfo.lastName" placeholder="" maxlength="40"></el-input>
          </el-form-item>
        </el-col>
        <el-form-item label="Address Line 1 *" prop="addressLine1">
          <el-input v-model="formInfo.addressLine1" placeholder="" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="Address Line 2" prop="addressLine2">
          <el-input v-model="formInfo.addressLine2" placeholder="" maxlength="200"></el-input>
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="City *" prop="city" style="margin-right: 12px;">
            <el-input v-model="formInfo.city" placeholder="" maxlength="40"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="State *" prop="state" style="margin-left: 12px;">
            <el-select class="input-state" v-model="formInfo.state" placeholder="Select state" clearable filterable no-match-text="No matching data">
              <el-option v-for="item in stateData" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Zip Code *" prop="zipCode" style="margin-right: 12px;">
            <el-input v-model="formInfo.zipCode" placeholder="" maxlength="40"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Country/Region *" prop="country" style="margin-left: 12px;">
            <el-input class="input-country" v-model="formInfo.country" placeholder="" maxlength="40" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-form-item label="Phone Number *" prop="phoneNumber">
          <el-input class="input-phone-number" placeholder="" v-model="formInfo.phoneNumber" maxlength="12" @input="onInputMobile(formInfo)">
            <template slot="prepend">+1</template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-checkbox v-model="formInfo.isDefault">Default</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="false" class="dialog-btntext dialog-btntext-radius dialog-btntext-disabled">Save</div>
        <div v-else class="dialog-btntext dialog-btntext-radius" @click="dialogSave">Save</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import successInfo from "@/mixins/successInfo";
import { queryAddressCardList, addAddressCard, editAddressCard, removeAddressCard } from '@/api/address'
export default {
  name: 'AddAddress',
  components: {
  },
  mixins: [successInfo],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    modalAppend: {
      type: Boolean,
      default: false
    },
    modalAppendDelete: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    setType: {
      type: String,
      default: ''
    },
    defaultChecked: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let formInfo = {
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phoneNumber: '',
      isDefault: false
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
      oneDefault: false,
      listcard: [],
      checked: '',
      cardInfo: {},
      removeItem: null,
      defaultImg: require('../static/defaultCard@2x.png'),
      checkedDeafult: true,
      inputaddressShow: false,
      deleteId: '',
      dialogFormVisibleDelete: false,
      formInfo: formInfo,
      formInfoCopy: formInfo,
      rules: {
        firstName: [{ required: true, message: 'Please enter your first name.', trigger: 'blur' }],
        lastName: [{ required: true, message: 'Please enter your last name.', trigger: 'blur' }],
        addressLine1: [{ required: true, message: 'Please enter your addressLine1.', trigger: 'blur' }],
        city: [{ required: true, message: 'Please enter your city.', trigger: 'blur' }],
        state: [{ required: true, message: 'Please enter your state.', trigger: 'change' }],
        zipCode: [{ required: true, message: 'Please enter your zipCode.', trigger: 'blur' }],
        country: [{ required: true, message: 'Please enter your country.', trigger: 'blur' }],
        phoneNumber: [
          { required: true, message: 'Please enter your phoneNumber.', trigger: 'blur' },
          { validator: validateMobile, trigger: 'change' },
          { validator: validateMobile2, trigger: 'blur' }
        ]
      },
      dialogTitle: 'Add New Address',
      stateData: ['AA', 'AE', 'AK', 'AL', 'AP', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'FM', 'GA', 'GU', 'HI', 'IA', 'ID',
      'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND',
      'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY']
    }
  },
  computed: {
    removeDefault() {
      return this.removeItem&&this.removeItem.isDefault===1
    },
  },
  watch: {
    dialogVisible: { //深度监听，可监听到对象、数组的变化
      handler (newVal, oldVal) {
        if(newVal) {
          console.log(1000, 'page埋点-----', 'set_address_page');
          this.$amplitude.getInstance().logEvent('imp', {
            'page_code': 'set_address_page',
            'module_code': '',
            'position_code': '',
            'event_target': 'page',
            'event_value': '',
            'pv_id': this._global.userId?this._global.pv_id_func(this._global.userId):this._global.pv_id_func(this.$amplitude.getInstance().options.deviceId),
            'url': window.location.href
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getlist() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      queryAddressCardList({
        userId: JSON.parse(localStorage.getItem('USERINFO')).id,
        curPage: 1,
        pageSize: 10000
      }, (res) => {
        loading.close();
        this.listcard = res.result;
        if(res.result && res.result.length===1) {
          this.oneDefault = res.result[0].isDefault ? true : false;
        }
      },
      () => {
        loading.close();
      },
      () => {})
    },
    onClose() {
      if(this.listcard.length === 0) {
        this.$emit('close', {});
      } else {
        this.$emit('close', this.defaultChecked?this.defaultChecked:this.listcard[0]);
      }
    },
    inputradio(item, index) {
      this.checked = index;
      this.checkedDeafult = false;
      this.cardInfo = item;
    },
    setDefault() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      editAddressCard({
        id: this.cardInfo.id,
        isDefault: 1 // 1-默认；0-非默认
      },() => {
        loading.close();
        this.checked = '';
        this.checkedDeafult = true;
        this.getlist();
        this.$EventBus.$emit("refreshAddress");
        this.removeItem = null
      },
      () => {
        loading.close();
      },
      () => {})
    },
    useCard() {
      this.$emit('usecard', Object.keys(this.cardInfo).length?this.cardInfo:this.defaultChecked);
    },
    deleteCard(val) {
      this.deleteId = val.id;
      this.removeItem = val;
      this.dialogFormVisibleDelete = true;
    },
    dialogDelete() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      removeAddressCard({addressId: this.deleteId},
      () => {
        loading.close();
        this.dialogFormVisibleDelete = false;
        const info = {
          title: "Address Deleted",
          tip: "This address has been deleted.",
        };
        this.createdSuccessInfo(info);
        // 删除默认地址后通知下单页面更新地址
        if(this.removeDefault&&this.listcard.length>=2) {
          this.cardInfo = this.listcard[1]
          this.setDefault()
        }else if(this.removeDefault&&this.listcard.length<2) {
          this.$EventBus.$emit("refreshAddress");
          this.getlist();
        }else{
          this.getlist();
        }
      },
      () => {
        loading.close();
      },
      () => {})
    },
    closeDialog() {
      if(this.$refs['formInfo']) { this.$refs['formInfo'].clearValidate() } // 清除验证
      if(this.$refs['formInfo']) { this.$refs['formInfo'].resetFields() } // 重置数据
      this.dialogFormVisibleDelete = false;
      this.inputaddressShow = false;
    },
    AddCard() {
      this.formInfo = JSON.parse(JSON.stringify(this.formInfoCopy));
      this.inputaddressShow = true;
      this.dialogTitle = "Add New Address";
    },
    editCard(val) {
      this.inputaddressShow = true;
      this.dialogTitle = "Edit Address";
      this.formInfo = Object.assign({}, val, {
        isDefault: val.isDefault ? true : false,
        phoneNumber: this.getSeparatorMobile( val.phoneNumber.substring(2) )
      });
    },
    dialogSave() {
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '',
            spinner: 'el-icon-loading',
            background: 'rgba(51, 51, 51, 0.25)'
          });
          this.formInfo.firstName = this.formInfo.firstName.trim();
          this.formInfo.lastName = this.formInfo.lastName.trim();
          this.formInfo.addressLine1 = this.formInfo.addressLine1.trim();
          this.formInfo.addressLine2 = this.formInfo.addressLine2.trim();
          this.formInfo.city = this.formInfo.city.trim();
          this.formInfo.zipCode = this.formInfo.zipCode.trim();
          let data = Object.assign({}, this.formInfo, {
            userId: JSON.parse(localStorage.getItem('USERINFO')).id,
            isDefault: this.formInfo.isDefault ? 1 : 0,
            phoneNumber: '+1' + this.formInfo.phoneNumber.replace(/-/g,'')
          })
          if(this.dialogTitle === 'Add New Address') { // 新增
            addAddressCard(data,() => {
              loading.close();
              this.inputaddressShow = false;
              this.getlist();
              this.$EventBus.$emit("refreshAddress");
            },
            () => {
              loading.close();
            },
            () => {})
          }
          if(this.dialogTitle === 'Edit Address') { // 编辑
            editAddressCard(data,() => {
              loading.close();
              this.inputaddressShow = false;
              this.getlist();
              this.$EventBus.$emit("refreshAddress");
            },
            () => {
              loading.close();
            },
            () => {})
          }
        } else {
          return false;
        }
      });
    },
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
      this.formInfo.phoneNumber = this.getSeparatorMobile(val.phoneNumber);
    }
  },
  created() {
    setTimeout(()=> {
      this.getlist();
    }, 50)
  },
  mounted() {
  }
}
</script>

<style lang="less">
  .el-select-dropdown__item.selected {
    color: #333333 !important;
  }
  .addaddress {
    .dialog-addaddress > .el-dialog {
      background: rgba(255, 255, 255, 0.8);
      width: 640px;
      min-height: 480px;
      margin-top: -240px !important;
      .el-dialog__header {
        padding: 24px 16px 0 16px;
      }
      .el-dialog__body {
        padding-top: 0;
        margin-top: 24px;
        margin-bottom: 24px;
        height: 311px;
        overflow: auto;
      }
    }
    .dialog-delete > .el-dialog {
      // background: #eeeeee;
      margin-top: -112px !important;
      .el-dialog__body {
        padding: 8px 20px 16px 20px;
        text-align: center;
      }
    }
    .addaddress-card {
      cursor: pointer;
      background: #FFFFFF;
      border-radius: 10px;
      height: 56px;
      // line-height: 56px;
      margin-bottom: 16px;
      .addaddress-card-item {
        width: 100%;
        display: inline-flex;
        align-items: center;
        .addaddress-card-left{
          width: calc( 100% - 80px );
          display: inline-flex;
          .addaddress-card-check{
            width: 56px;
            display: none;
            input {
              margin-left: 16px;
              vertical-align: middle;
              height: 56px;
              padding: 10px;
              width: 20px;
            }
          }
          .addaddress-card-info{
            display: inline-block;
            height: 56px;
            width: 100%;
            label {
              display: inline-block;
              height: 56px;
              width: 100%;
              vertical-align: middle;
              span {
                font-weight: 500;
                font-size: 14px;
                color: #333333;
              }
              img {
                height: 24px;
                width: 24px;
                vertical-align: middle;
                padding: 0 16px;
              }
              img.addaddress-card-img {
                width: 38px;
                padding-left: 0;
              }

              .addaddress-card-person{
                width: calc( 100% - 56px );
                display: inline-block;
                vertical-align: middle;
                height: 56px;
                box-sizing: border-box;
                padding: 7px 0;
                & > .addaddress-card-name {
                  height: 18px;
                  display: inline-block;
                  font-weight: bold;
                }
                & > .addaddress-card-default {
                  display: inline-block;
                  height: 18px;
                  width: 50px;
                  font-weight: 400;
                  font-size: 12px;
                  border-radius: 4px;
                  margin-left: 16px;
                  background: #333333;
                  display: inline;
                  color: #FFFFFF;
                  padding: 0 5px;
                }
                & > .addaddress-card-addressinfo {
                  height: 18px;
                  margin-top: 4px;
                  font-weight: 500;
                  max-width: 456px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
              }
            }
          }
         }
        .addaddress-card-delete{
          cursor: pointer;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          height: 56px;
          line-height: 56px;
          width: 80px;
          div {
            height: 30px;
            width: 30px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
            img {
              width: 16px;
              height: 16px;
              vertical-align: middle;
            }
          }
          div:hover {
            background: #eeeeee;
          }
        }
      }
    }
    .addaddress-card-add {
      cursor: pointer;
      background: #FFFFFF;
      border-radius: 10px;
      height: 56px;
      line-height: 56px;
      color: #333333;
      font-weight: 500;
      font-size: 16px;
      img {
        padding: 16px;
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
    }
    .add-pay-btn {
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      width: 100%;
      height: 48px;
      div {
        height: 48px;
        width: 240px;
        background: #333333;
        color: #ffffff;
        border-radius: 24px;
        text-align: center;
        line-height: 48px;
      }
    }
    .opacity-disabled{
      .add-pay-btn();
      opacity: 0.1;
    }
    .addaddress-card-add:active, .add-pay-btn:active {
      opacity: 0.8;
    }
    .dialog-edit {
      .el-dialog {
        height: 640px;
        margin-top: -320px !important;
        .el-dialog__header {
          padding-bottom: 16px;
        }
        .el-dialog__body {
          height: 480px;
          padding-top: 0;
          .addaddress-form {
            input {
              border-radius: 8px;
            }
            .el-select {
              width: 100%;
            }
            .el-checkbox {
              color: #979797;
            }
            .el-checkbox__input.is-checked+.el-checkbox__label {
              color: #979797;
              font-weight: normal;
              border-radius: 7px;
            }
            .el-checkbox__input.is-checked .el-checkbox__inner {
              background-color: #333333;
              border-color: #333333;
            }
            .el-checkbox__input.is-focus .el-checkbox__inner {
              border-color: transparent;
            }
            .el-checkbox__inner:hover {
              border-color: transparent;
            }
            .el-checkbox__label {
              font-weight: normal;
            }
            .el-checkbox__inner {
              border-radius: 7px;
            }
            .input-phone-number {
              .el-input-group__prepend {
                border: 1px solid transparent;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
              }
              & > input {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
              }
            }
            .input-state {
              @color: #333333;
              input::-webkit-input-placeholder {color: @color;} /* WebKit browsers */
              input:-moz-placeholder {color: @color;} /* Mozilla Firefox 4 to 18 */
              input::-moz-placeholder {color: @color;} /* Mozilla Firefox 19+ */
              input:-ms-input-placeholder {color: @color;} /* Internet Explorer 10+ */
              .el-icon-arrow-up:before, .el-icon-circle-close:before {
                color: #333333 !important;
              }
            }
            .el-form-item__label, 
            .el-input-group__append, 
            .el-input-group__prepend,
            .el-input__inner,
            .el-input.is-disabled .el-input__inner {
              color: #333333;
            }
            .input-country {
              & > input {
                color: #000000 !important;
              }
            }
          }
        }
        .el-dialog__footer {
          padding: 24px;
          .dialog-footer {
            .dialog-btntext {
              width: 240px;
              height: 48px;
              display: inline-flex;
              justify-content: center;
              align-items: center;
              filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.15));
            }
            .dialog-btntext-radius {
              border-radius: 24px;
            }
            .dialog-btntext-disabled {
              opacity: 0.1;
            }
          }
        }
      }
    }
  }

</style>