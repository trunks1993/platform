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
// 添加用户管理数据
export const getSysUserAdd = params => request({
  url: '/v1/api/user/SysUser/add',
  method: 'post',
  params,
});
// 删除用户管理列表
export const deleteUserGwPage = params => request({
  url: '/v1/api/user/SysUser/remove',
  method: 'delete',
  params,
});
// 修改用户管理列表
export const putUserEdit = params => request({
  url: '/v1/api/user/SysUser/edit',
  method: 'put',
  params,
});
// 重置用户管理密码
export const postresetPwd = params => request({
  url: '/v1/api/user/SysUser/resetPwd',
  method: 'post',
  params,
});
// 获取角色管理列表
export const getSysRoleList = params => request({
  url: '/v1/role/list',
  method: 'get',
  params,
});
// 删除角色管理列表
export const deleteRoleGwPage = params => request({
  url: '/v1/role/delete',
  method: 'delete',
  params,
});
// 搜索部门管理信息
export const searchSysDeptList = params => request({
  url: '/v1/api/dept/SysDept/list',
  method: 'get',
  params,
});
// 添加部门管理列表
export const postSysDeptAdd = params => request({
  url: '/v1/api/dept/SysDept/add',
  method: 'post',
  params,
});
// 查询岗位管理列表
export const queryGwPage = params => request({
  url: '/v1/manage/post/queryByPage',
  method: 'get',
  params,
});
// 修改岗位管理列表
export const putSysDeptEdit = params => request({
  url: '/v1/api/dept/SysDept/edit',
  method: 'put',
  params,
});
// 删除部门管理列表
export const deleteSysDeptRomove = params => request({
  url: '/v1/api/dept/SysDept/remove',
  method: 'delete',
  params,
});
// 删除岗位管理列表
export const deleteGwPage = params => request({
  url: '/v1/manage/post/delete',
  method: 'delete',
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
// 查询字典管理列表
export const queryDictPage = params => request({
  url: '/v1/dictionaries/dictType/queryByPage',
  method: 'get',
  params,
});
// 编辑字典管理列表
export const editorDictPage = params => request({
  url: '/v1/dictionaries/dictType/update/{dictId}',
  method: 'put',
  params,
});
// 新增字典管理列表
export const addDictPage = params => request({
  url: '/v1/dictionaries/dictType/insert',
  method: 'post',
  params,
});
// 删除字典管理列表
export const deleteDictPage = params => request({
  url: '/v1/dictionaries/dictType/delete',
  method: 'delete',
  params,
});
// 查询操作日志列表
export const queryOperLPage = params => request({
  url: '/v1/operLog/list',
  method: 'get',
  params,
});
// 删除操作日志列表
export const deleteOperLPage = params => request({
  url: '/v1/operLog/remove',
  method: 'delete',
  params,
});
// 清空操作日志列表
export const clearOperLPage = params => request({
  url: '/v1/operLog/clean',
  method: 'post',
  params,
});
// 查询登录日志列表
export const queryLoginPage = params => request({
  url: '/v1/logininfor/list',
  method: 'get',
  params,
});
// 删除登录日志列表
export const deleteLoginPage = params => request({
  url: '/v1/logininfor/remove',
  method: 'delete',
  params,
});
// 清空登录日志列表
export const clearLoginPage = params => request({
  url: '/v1/logininfor/clean',
  method: 'post',
  params,
});
