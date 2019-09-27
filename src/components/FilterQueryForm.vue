<script>
import { getSelectOption } from "@/api";
import _ from "lodash";

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
    };
  },
  watch: {
    queryFilter: {
      handler(val, oVal) {
        this.$emit('queryChange', val);
      },
      deep: true,
    }
  },
  async created() {
    for (let item of this.model) {
      this.$set(this.queryFilter, item.bindKey, item.bindValue);
      if (item.option && !Array.isArray(item.option)) {
        const res = await getSelectOption(item.option.url);
        item.option = res.map(v => ({
          label: v[item.option.labelKey],
          value: v[item.option.valueKey],
        }));
      }
    }
  },
  render() {
    const getInput = ({ el, elAttr, bindKey, option }) => (
      <el-input v-model={this.queryFilter[bindKey]} />
    );

    const getSelect = ({ el, elAttr, bindKey, option }) => {
      return (
        <el-select v-model={this.queryFilter[bindKey]}>
          {Array.isArray(option) &&
            option.map(item => <el-option {...{ attrs: item }}></el-option>)}
        </el-select>
      );
    };

    const jsxmap = {
      input: getInput,
      select: getSelect
    };

    const getEL = data => jsxmap[data.el](data);

    return (
      <div class="filter-container">
        <el-form {...{ attrs: this.fAttr }}>
          {this.model.map(item => (
            <el-form-item {...{ attrs: item.fiAttr }}>
              {getEL(item)}
            </el-form-item>
          ))}
          <el-form-item>
            {this.searchBtnVisible && (
              <el-button
                type="primary"
                {...{
                  on: {
                    click: () => {
                      this.$emit("afterFilter", this.queryFilter);
                    }
                  }
                }}
              >
                查询
              </el-button>
            )}
            {this.resetBtnVisible && (
              <el-button
                type="primary"
                {...{
                  on: {
                    click: () => {
                      this.$emit("afterReset");
                    }
                  }
                }}
              >
                重置
              </el-button>
            )}
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