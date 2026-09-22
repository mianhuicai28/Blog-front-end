import request from "../utils/request.js";
// 获取所有评论
export const getAllComment = (data) => {
  return request({
    method: "post",
    url: "/comment/getAllComment",
    data,
  });
};
// 添加评论（1）
export const addCommentOne = (data) => {
  return request({
    method: "post",
    url: "/comment/addCommentOne",
    data,
  });
};
// 添加评论（2）
export const addCommentTwo = (data) => {
  return request({
    method: "post",
    url: "/comment/addCommentTwo",
    data,
  });
};
export const deleteComment = (data) => {
  return request({ method: "post", url: "/comment/deleteComment", data });
};
