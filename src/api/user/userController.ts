import request from '@/services/request'

/** 编辑个人信息 */
export async function editUser(body: UserAPI.UserEditRequest) {
  return request<UserAPI.BaseResponseBoolean>('/user/edit', {
    method: 'POST',
    data: body,
  })
}

/** 获取当前登录用户 */
export async function getLoginUser() {
  return request<UserAPI.BaseResponseLoginUserVO>('/user/get/login', {
    method: 'GET',
  })
}

/** 根据ID获取用户视图对象 */
export async function getUserVoById(params: UserAPI.getUserVOByIdParams) {
  return request<UserAPI.BaseResponseUserVO>('/user/get/vo', {
    method: 'GET',
    params,
  })
}

/** 批量获取用户视图对象 */
export async function getUserVoByIds(params: UserAPI.getUserVOByIdsParams) {
  return request<UserAPI.BaseResponseListUserVO>('/user/get/vo/batch', {
    method: 'GET',
    params,
  })
}

/** 分页获取用户封装列表 */
export async function listUserVoByPage(body: UserAPI.UserQueryRequest) {
  return request<UserAPI.BaseResponsePageUserVO>('/user/list/page/vo', {
    method: 'POST',
    data: body,
  })
}

/** 微信小程序登录 */
export async function userLoginByMa(body: UserAPI.UserMaLoginRequest) {
  return request<UserAPI.BaseResponseLoginUserVO>('/user/login/ma', {
    method: 'POST',
    data: body,
  })
}

/** 用户注销 */
export async function userLogout() {
  return request<UserAPI.BaseResponseBoolean>('/user/logout', {
    method: 'POST',
  })
}
