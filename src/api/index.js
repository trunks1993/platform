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
// 新增角色管理列表
export const putRoleAdd = params => request({
  url: '/v1/role/add',
  method: 'put',
  params,
});
// 修改角色管理列表
export const putRoleEdit = params => request({
  url: '/v1/role/edit',
  method: 'put',
  params,
});
// 搜索菜单管理列表
export const getMenuList = params => request({
  url: '/v1/menu/list',
  method: 'get',
  params,
});
// 根据条件搜索菜单管理列表
export const getQueryByList = params => request({
  url: '/v1/menu/queryByList',
  method: 'get',
  params,
});
// 新增菜单管理列表
export const putMenuAdd = params => request({
  url: '/v1/menu/add',
  method: 'put',
  params,
});
// 修改菜单管理列表
export const putMenuEdit = params => request({
  url: '/v1/menu/edit',
  method: 'put',
  params,
});
// 删除菜单管理列表
export const getMenuDelete = params => request({
  url: '/v1/menu/delete',
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
  url: '/v1/manage/post/list',
  method: 'get',
  params,
});
// 删除部门管理列表
export const deleteSysDeptRomove = params => request({
  url: '/v1/api/dept/SysDept/remove',
  method: 'delete',
  params,
});
// 修改部门管理列表
export const putSysDeptEdit = params => request({
  url: '/v1/api/dept/SysDept/edit',
  method: 'put',
  params,
});

// 删除岗位管理列表
export const deleteGwPage = params => request({
  url: '/v1/manage/post/remove',
  method: 'delete',
  params,
});
// 编辑岗位管理列表
export const editorGwPage = params => request({
  url: '/v1/manage/post/edit/{postCode}',
  method: 'put',
  params,
});
// 新增岗位管理列表
export const addGwPage = params => request({
  url: '/v1/manage/post/add',
  method: 'post',
  params,
});
// 查询字典管理列表
export const queryDictPage = params => request({
  url: '/v1/dictionaries/dictType/list',
  method: 'get',
  params,
});
// 编辑字典管理列表
export const editorDictPage = params => request({
  url: '/v1/dictionaries/dictType/edit/{dictId}',
  method: 'put',
  params,
});
// 新增字典管理列表
export const addDictPage = params => request({
  url: '/v1/dictionaries/dictType/add',
  method: 'post',
  params,
});
// 删除字典管理列表
export const deleteDictPage = params => request({
  url: '/v1/dictionaries/dictType/remove',
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
// 查询操作日志列表的操作类型条件
export const selectTypePage = params => request({
  url: '/v1/dictionaries/dictData/selectByDictType',
  method: 'get',
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
  method: 'put',
  params,
});
// 导出
export const downloadFile = url => request({
  url,
  method: 'get',
  responseType: 'blob',
});
// 新增字典数据管理列表
export const addDicDatePage = params => request({
  url: '/v1/dictionaries/dictData/add',
  method: 'post',
  params,
});
// 编辑字典数据管理列表
export const editorDicDatePage = params => request({
  url: '/v1/dictionaries/dictData/edit/{dictCode}',
  method: 'put',
  params,
});
// 查询字典数据管理列表
export const queryDicDatePage = params => request({
  url: '/v1/dictionaries/dictData/list',
  method: 'get',
  params,
});
// 删除字典数据管理列表
export const deleteDicDatePage = params => request({
  url: '/v1/dictionaries/dictData/remove',
  method: 'delete',
  params,
});
