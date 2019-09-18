/* eslint-disable no-unused-expressions */
const mixin = {
  data() {
    return {
      total: 0,
      queryList: {
        pageNum: 1,
        pageSize: 6,
      },
    };
  },
  methods: {
    handleFilter(queryFilter, afterHandler) {
      Object.assign(this.queryList, queryFilter);
      afterHandler && afterHandler();
    },
    handleSizeChange(size, afterHandler) {
      this.queryList.pageSize = size;
      afterHandler && afterHandler();
    },
    handleCurrentChange(current, afterHandler) {
      this.queryList.pageNum = current;
      afterHandler && afterHandler();
    },
  },
};

export { mixin };
