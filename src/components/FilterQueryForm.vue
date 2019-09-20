<script>
export default {
  props: {
    resetBtnVisible: {
      type: Boolean,
      default: true
    },
    searchBtnVisible: {
      type: Boolean,
      default: true
    },
    fAttr: {
      type: Object
    },
    model: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      queryFilter: {}
    }
  },
  created() {
  },
  render() {
    const getEl = ({el, elAttr, bindKey, option}) => {
      let elDom = '';
      switch(el) {
        case 'select':
          elDom = (
            <el-select v-model={this.queryFilter[bindKey]}>
              {
                option.map(item => {
                  return <el-option {...{attrs: item}}></el-option>
                })
              }
            </el-select>
          );
        break;
        default:
          elDom = <el-input v-model={this.queryFilter[bindKey]}/>
      }
      return elDom
    }
    return (
      <div class="filter-container">
        <el-form {...{attrs: this.fAttr}}>
          {
            this.model.map(item => (
              <el-form-item {...{attrs: item.fiAttr}}>
                {getEl(item)}
              </el-form-item>
            ))
          }
          <el-form-item>
            {this.searchBtnVisible && <el-button type="primary" {...{on: {'click': () => { this.$emit('afterFilter', this.queryFilter) } } }}>查询</el-button> }
            {this.resetBtnVisible && <el-button type="primary" {...{on: {'click': () => { this.$emit('afterReset') } } }}>重置</el-button> }
          </el-form-item>
        </el-form>
      </div>
    );
  }
};
</script>
<style lang="scss" scoped>
.filter-container {
  height: 159px;
  background: url(../assets/images/tabs-search-bg.png);
  background-size: 100% 100%;
  padding: 20px;
}
</style>