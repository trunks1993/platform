const menuEnum = {
  M: '目录',
  C: '菜单',
  F: '按钮',
};

const getMenuTypeName = str => menuEnum[str];

// eslint-disable-next-line import/prefer-default-export
export { getMenuTypeName };
