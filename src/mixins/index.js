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
      queryApi(this.queryList).then(({ rows, total }) => {
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
      downloadFile(`${baseExpApi}?${paramString}`).then((res) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = 'xxx.xlsx'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    },
  },
};

export { mixin };
