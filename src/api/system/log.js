/*updateDataupdateById
角色管理相关的API请求函数
*/
import request from "@/utils/request";

const api_name = "/admin/log";

export default {
    getLogList( page, size) {
        return request({
            url: `${api_name}/list/${page}/${size}`,
            method: "get",
        });
    }
};