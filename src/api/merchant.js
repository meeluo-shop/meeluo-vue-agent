import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/agent/merchant/list",
    method: "get",
    params: data,
  });
}

export function getDetail(id) {
  return request({
    url: `/agent/merchant/detail/${id}`,
    method: "get",
  });
}

export function doActive(id) {
  return request({
    url: `/agent/merchant/active/${id}`,
    method: "put",
  });
}

export function doCreate(data) {
  return request({
    url: "/agent/merchant/create",
    method: "post",
    data,
  });
}

export function doEdit(id, data) {
  return request({
    url: `/agent/merchant/update/${id}`,
    method: "put",
    data,
  });
}
