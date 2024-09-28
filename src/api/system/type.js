/*updateDataupdateById
角色管理相关的API请求函数
*/
import request from "@/utils/request";

const api_name = "/admin/dynamicType";

export default {
  /*
  获取分页列表
  */
  getPageList(page, size, searchObj) {
    return request({
      url: `${api_name}/list/${page}/${size}`,
      method: "get",
      data: searchObj,
      //   params: page,
    });
  },

  updateById(type) {
    return request({
      url: `${api_name}/info`,
      method: "put",
      data: type,
    });
  },

  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: "get",
      //   data: searchObj,
      //   params: page,
    });
  },

  save(type) {
    return request({
      url: `${api_name}/add`,
      method: "post",
      data: type,
    });
  },

  getAllCount(){
    return request({
      url: `${api_name}/getall`,
      method: "get",
    });
  }
};
