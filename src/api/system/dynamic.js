/*updateDataupdateById
角色管理相关的API请求函数
*/
import request from "@/utils/request";

const api_name = "/admin/dynamic";

export default {
  getAll(page, limit, searchObj) {
    return request({
      url: `${api_name}/list/${page}/${limit}`,
      method: "post",
      // data: assginRoleVo,
      data: searchObj,
    });
  },

  removeById(id) {
    return request({
      url: `${api_name}/delete/${id}`,
      method: "delete",
    });
  },

  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: "get",
    });
  },

  getTodaydynamicCount() {
    return request({
      url: `${api_name}/today`,
      method: "get",
    });
  },

  getAllCount() {
    return request({
      url: `${api_name}/count`,
      method: "get",
    });
  },

  getmonthdynamicCount() {
    return request({
      url: `${api_name}/month`,
      method: "get",
    });
  },
  getTodayUser() {
    return request({
      url: "/admin/system/index/today",
      method: "get",
    });
  },
  getAllUserCount() {
    return request({
      url: "/admin/system/index/total",
      method: "get",
    });
  },
  getMonthUserCount() {
    return request({
      url: "/admin/system/index/month",
      method: "get",
    });
  }
};


