import request from '@/utils/request';

// export default (username, password) => request({
//   url: '/user/login',
//   method: 'post',
//   params: {
//     username,
//     password,
//   },
// });

export const login = params => request({
  url: '/cas/login',
  method: 'post',
  params,
});
// 获取用户菜单
export const getMenuTree = () => request({
  url: '/v1/menu/listById',
  method: 'get',
});
// 获取用户权限
export const getUserInfo = () => request({
  url: '/v1/api/user/SysUser/user',
  method: 'get',
});
// 获取用户管理列表
export const getSysUserList = params => request({
  url: '/v1/api/user/SysUser/list',
  method: 'get',
  params,
});
// 获取用户管理部门树
export const getSysDeptTreeData = params => request({
  url: '/v1/api/dept/SysDept/treeData',
  method: 'get',
  params,
});
// 获取角色管理列表
export const getSysRoleList = params => request({
  url: '/v1/role/list',
  method: 'get',
  params,
});
// 查询岗位管理列表
export const queryGwPage = params => request({
  url: '/v1/manage/post/queryByPage',
  method: 'get',
  params,
});
// 删除岗位管理列表
export const deleteGwPage = params => request({
  url: '/v1/manage/post/delete',
  method: 'delete',
  params,
});
// 导出岗位管理列表
export const exportGwPage = params => request({
  url: '/v1/manage/post/exportExcel',
  method: 'get',
  params,
});
// 编辑岗位管理列表
export const editorGwPage = params => request({
  url: '/v1/manage/post/update/{postCode}',
  method: 'put',
  params,
});
// 新增岗位管理列表
export const addGwPage = params => request({
  url: '/v1/manage/post/insert',
  method: 'post',
  params,
});
//查询字典管理列表
export const queryDictPage = params => request({
  url: '/v1/manage/post/insert',
  method: 'post',
  params,
});