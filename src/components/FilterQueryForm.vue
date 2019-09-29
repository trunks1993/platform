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
      queryFilter: {},
      filterVisible: true,
    };
  },
  watch: {
    queryFilter: {
      handler(val, oVal) {
        this.$emit("queryChange", val);
      },
      deep: true
    },
    filterVisible(val, oVal) {
      this.$emit("handleVisible", val);
    }
  },
  mounted() {
    // console.log(this.$refs.test);
  },
  async created() {
    for (let item of this.model) {
      this.$set(this.queryFilter, item.bindKey, item.bindValue);
      if (item.option && !Array.isArray(item.option)) {
        const res = await getSelectOption(item.option.url);
        item.option = res.map(v => ({
          label: v[item.option.labelKey],
          value: v[item.option.valueKey]
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

    const getTimerPicker = ({ el, elAttr, bindKey, option }) => {
      return (
        <el-date-picker
          v-model={this.queryFilter[bindKey]} {...{ attrs: elAttr }}> 
        </el-date-picker>
      )
    }
    const jsxmap = {
      input: getInput,
      select: getSelect,
      datePicker: getTimerPicker
    };
    const getEL = data => jsxmap[data.el](data);

    return (
      <div class="filter-container" style={{height: this.filterVisible ? '100px' : '25px'}}>
        
        <div class="filter-container-form" style={{display: this.filterVisible ? 'block' : 'none'}}>
          <el-form ref="test" {...{ attrs: this.fAttr }}>
            {this.model.map(item => (
              <el-form-item {...{ attrs: item.fiAttr }}>
                {getEL(item)}
              </el-form-item>
            ))}
          </el-form>
        </div>
        <div class="filter-container-btn" style={{display: this.filterVisible ? 'block' : 'none'}}>
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
                    Object.keys(this.queryFilter).forEach(key => {
                      const typeStr = Object.prototype.toString.call(this.queryFilter[key]);
                      switch(typeStr) {
                        case '[object Array]':
                          this.queryFilter[key] = [];
                        break
                        case '[object Boolean]':
                          this.queryFilter[key] = false;
                        break
                        case '[object Object]':
                          this.queryFilter[key] = {};
                        break
                        default:
                          this.queryFilter[key] = '';
                      }
                    })
                    this.$emit("afterReset");
                  }
                }
              }}
            >
              重置
            </el-button>
          )}
        </div>
        

        <div
          class="filter-container-visible"
          {...{
            on: {
              click: () => {
                this.filterVisible = !this.filterVisible;
              }
            }
          }}
        >
          <i class="el-icon-arrow-down" style={{transform: this.filterVisible ? 'rotate(180deg)' : 'rotate(0deg)'}}/>
        </div>
      </div>
    );
  }
};
</script>
<style lang="scss" scoped>
.filter-container {
  background: url(../assets/images/tabs-search-bg.png);
  background-size: 100% 100%;
  padding-left: 20px;
  display: flex;
  align-items: center;
  position: relative;
  transition: all .5s;
  &-form {
    transition: all .5s;
  }
  &-btn {
    transition: all .5s;
  }

  &-visible {
    position: absolute;
    bottom: -18px;
    left: 50%;
    transform: translate(-50%, 0);
    background: rgba(255,255,255, 0.3);
    width: 50px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 0 0 20px 20px;
    cursor: pointer;
    i {
      display: inline-block;
      transition: all .5s;
    }
  }
}
</style>
<style lang="scss">
.filter-container-form {
  .el-form-item {
    margin-bottom: 0;
    margin-right: 30px;
    &__content {
      min-width: 210px;
    }

    .el-input {
      input {
        width: 210px;
      }
    }
  }
}
</style>