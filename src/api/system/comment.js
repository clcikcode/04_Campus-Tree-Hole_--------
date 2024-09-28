/*updateDataupdateById
角色管理相关的API请求函数
*/
import request from "@/utils/request";

const api_name = "/admin/dynamicComment";

export default {
  /*
  获取角色分页列表(带搜索)
  */
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/list/${page}/${limit}`,
      method: "post",
      data: searchObj,
    });
  },

  /*
  批量删除
  */
  batchRemove(idList) {
    return request({
      url: `${api_name}/deleteBatch`,
      method: `delete`,
      data: idList,
    });
  },
  /*
  根据ID删除角色
  */
  removeById(id) {
    return request({
      url: `${api_name}/delete/${id}`,
      method: "delete",
    });
  },

  /*
  根据id修改角色
  */
  updateById(role) {
    return request({
      url: `${api_name}/info`,
      method: "put",
      data: role,
    });
  },
  /*
  根据ID获取角色
  */
  getById(id) {
    return request({
      url: `${api_name}/info/${id}`,
      method: "get",
    });
  },
};