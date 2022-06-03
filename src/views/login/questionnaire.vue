<template>
  <div class="questionnaire">
    <div class="questionnaire-header">Tell us a Little</div>
    <div class="questionnaire-headerTwo">About Yourself</div>
    <el-form :model="formInfo" :rules="rules" ref="formInfo" label-width="364px" label-position="top" class="login-form">
      <el-form-item :label="sub.title" :prop="String(index)" v-for="(sub, index) in datalists" :key="sub.questionnaireId">
        <el-select v-model="formInfo[index]" clearable placeholder="Please Select">
          <el-option
            v-for="item in sub.selectList"
            :key="item.option"
            :label="item.context"
            :value="item.option">
            <!-- {'questionnaireId': item.questionnaireId, 'userOption': item.option} -->
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div
      v-if="formInfo[0] && formInfo[1] && formInfo[2]"
      v-loading="loading"
      element-loading-text=""
      element-loading-spinner="el-icon-loading"
      element-loading-background="transparent"
      class="login-continue-active button-userinfo" @click="continueLink(formInfo)">
      {{ loading?'':'Continue' }}
    </div>
    <div v-else class="login-continue">Continue</div>
  </div>
</template>
<script>
import { questionList, questionCommit } from "@/api/login";
export default {
  name: 'Questionnaire',
  components: {
  },
	data() {
		return {
      formInfo: {},
      datalists: [],
      rules: {
      },
      loading: false
    }
  },
  computed: {},
  watch:{},
  methods: {
    getlist() {
      questionList({
        bizType: "regPage",
        size: 3,
        sortNo: 0
      },(res) => {
        this.datalists = res.data.questionnaireList;
        for(let x=0; x<this.datalists.length; x++) {
          this.rules[x] = [{ required: true, message: 'Please select an option', trigger: 'change' }];
        }
      },
      (err) => {
        console.log(err);
      },
      () => {})
    },
    continueLink() {
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          this.loading = true;
          let newParam = [];
          for(let x=0; x<this.datalists.length; x++) {
            for(let y=0; y<this.datalists[x].selectList.length; y++) {
              if(this.datalists[x].selectList[y].option === this.formInfo[x]) {
                newParam.push({
                  questionnaireId: this.datalists[x].selectList[y].questionnaireId,
                  userOption: this.datalists[x].selectList[y].option
                })
              }
            }
          }
          questionCommit({
            userSelect: newParam
          },
          (res) => {
            this.loading = false;
            if(res.success) {
              localStorage.setItem('QUESTIONNAIRE', true);
              let bindshopifyVal = JSON.parse(localStorage.getItem('BINDSHOPIFY'));
              (bindshopifyVal && bindshopifyVal.action)
                ? this.$router.push({path: '/channels'})
                : this.$router.push({path: '/login/setup-store'})

              // let activity_url = localStorage.getItem('ACTIVITYURL');
              // let isShopifyORhasCreateStore = JSON.parse(localStorage.getItem('isShopifyORhasCreateStore'));
              // isShopifyORhasCreateStore
              //   ? this.$router.push({path: '/login/setup-store'})
              //   : (bindshopifyVal && bindshopifyVal.action)
              //     ? this.$router.push({path: '/channels'})
              //     : (activity_url)
              //       ? window.open(activity_url, '_top')
              //       : this.$router.push({path: '/'})
            }
          },
          () => {
            this.loading = false;
          },
          () => {})
        } else {
          return false;
        }
      });
    }
  },
	created() {
    this.getlist();
  },
  mounted() {},
  activated() {}
}
</script>

<style lang="less">
  @import "../../styles/common.less";
  @import "./CommonLogin.less";
  .questionnaire{
    .questionnaire-header {
      font-size: 48px;
      line-height: 43px;
      font-weight: 100;
    }
    .questionnaire-headerTwo {
      font-size: 48px;
      line-height: 43px;
      font-weight: bold;
    }
    .el-icon-loading {
      font-size: 32px;
      font-weight: bold;
    }
    .login-form {
      margin: 0 auto;
      margin-top: 40px;
      width: 480px;
      .el-form-item {
        margin-bottom: 24px;
        font-weight: 500;
        text-align: left;
        .el-form-item__label {
          padding: 0;
        }
        .el-form-item__content {
          margin-top: 8px;
          input {
            width: 480px;
            .common-input();
            font-size: 18px;
            color: #333333;
            height: 56px;
            font-weight: bold;
            background: #EEEEEE;
            border-radius: 8px;
          }
        }
      }
    }
    .login-continue,
    .login-continue-active {
      position: absolute;
    }
    .el-form-item--small .el-form-item__error {
      padding-top: 4px;
    }
  }
</style>