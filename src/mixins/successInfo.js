
const success = {
  methods: {
    // 创建订阅成功提示
    createdSuccessInfo(res) {
      var div = (
        <div class="self">
          <div class="img-box"></div>
          <div>
            <div class="title">
              <span>{res.title}</span>
            </div>
            <div class="tip">
              <span>{res.tip}</span>
            </div>
          </div>
        </div>
      );
      this.$notify({
        customClass: "seft-notify",
        dangerouslyUseHTMLString: true,
        showClose: false,
        duration: 3000,
        message: div,
      });
    },
    customImgCreatedSuccessInfo(res) {
      var div = (
        <div class="self">
          <div class="img-box custom">
            <img style={res.selfStyle?res.selfStyle:''} src={res.icon}></img>
          </div>
          <div>
            <div class="title">
              <span>{res.title}</span>
            </div>
            <div class="tip">
              <span>{res.tip}</span>
            </div>
          </div>
        </div>
      );
      this.$notify({
        customClass: "seft-notify",
        dangerouslyUseHTMLString: true,
        showClose: false,
        duration: 3000,
        message: div,
      });
    },
    // 创建添加默认合集成功提示
    createdAddDefaultCollectionSuccessInfo(res,changefun,product,cms,classify) {
      // 活动页面导出不需要按钮按钮，正常的需要Change按钮，分类页面需要一个view按钮来打开导出的合集页面
      const viewText = (<div class='change'>
        <span class='changeSpan' onClick={View}>View</span>
      </div>)
      const changeText = (<div class='change'>
        <span class='changeSpan' onClick={change}>Change</span>
      </div>)
      let renderText,classifyText = '';
      if(classify) {
        classifyText = <div class='classifyText'>Added {res.ids.length} products to Collection</div> 
        renderText = product.length===1?viewText:''
      }else if(cms) {
        renderText = ''
      }else {
        renderText = changeText
      }
      const className = ['tip',classify?'classify':'']
      var div = (
        <div class="self">
          <div class="img-box"></div>
          <div class='success-content'>
            <div class="title">
              <span>{res.title}</span>
            </div>
            {classifyText}
            <div class={className}>
              <span class='collcetion-name'>{res.tip}</span>
              {renderText}
            </div>
          </div>
        </div>
      );
      var defaultAdd =  this.$notify({
        customClass: "default-add-collection",
        dangerouslyUseHTMLString: true,
        showClose: false,
        duration: 5000,
        message: div,
      });
      function change() {
        defaultAdd.close()
        changefun(product)
      }
      function View() {
        defaultAdd.close()
        changefun(product,res.tip)
      }
    },
    // 创建添加合集成功提示
    createdCollectionSuccessInfo(res) {
      var div = (
        <div class="self">
          <div class="img-box"></div>
          <div>
            <div class="title">
              <span>{res.title}</span>
            </div>
            <div class="tip">
              <span>{res.tip}</span>
            </div>
          </div>
        </div>
      );
      this.$notify({
        customClass: "add-collection-multiple",
        dangerouslyUseHTMLString: true,
        showClose: false,
        duration: 3000,
        message: div,
      });
    },
  }
}
export default success