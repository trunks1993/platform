/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { downloadFile } from '@/api';

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
      queryApi(this.queryList).then((res) => {
        this.tableDataList = res.rows || res;
        res.total && (this.total = +res.total);
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
    // 带form的弹框关闭方式
    handleFormDlogClose(formName, done) {
      this.$refs[formName].resetFields();
      typeof done === 'function' ? done() : (this[done] = false);
    },
    handleExport(baseExpApi, name) {
      const strArr = Object.entries(this.queryList).map(item => `${item[0]}=${item[1]}`);
      const paramString = strArr.join('&');
      this.$confirm('确定导出所有数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        downloadFile(`${baseExpApi}?${paramString}`).then((res) => {
          const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
          const downloadElement = document.createElement('a');
          const href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          // eslint-disable-next-line prefer-template
          downloadElement.download = name + '.xlsx'; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        });
        this.$message({
          type: 'success',
          message: '导出成功!',
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出',
        });
      });
    },
  },
};

export { mixin };
