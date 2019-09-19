/* eslint-disable no-unused-expressions */
const mixin = {
  data() {
    return {
      total: 0,
      queryList: {
        pageNum: 1,
        pageSize: 10,
      },
      tableDataList: [],
    };
  },
  methods: {
    doQuery(queryApi) {
      queryApi(this.queryList).then(({ rows, total }) => {
        console.log(rows);
        this.tableDataList = rows;
        this.total = +total;
      });
    },
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
    handleExport(baseExpApi) {
      const strArr = Object.entries(this.queryList).map(item => `${item[0]}=${item[1]}`);
      const paramString = strArr.join('&');
      window.location.href = `${baseExpApi}?${paramString}`;
    },
  },
};

export { mixin };
