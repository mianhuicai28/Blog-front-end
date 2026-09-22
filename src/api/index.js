import { register, login, getUserInfo, updateInfo } from "./user.js";
import { getAllMessage, postMessage } from "./message.js";
import {
  getAllArticle,
  getPrivateArticle,
  publishArticle,
  getAuthorInfo,
  getArticleDetail,
  deleteArticle,
  updateArticle,
} from "./article.js";
import {
  searchPublicArticleByClass,
  searchPrivateArticleByClass,
  searchByInput,
  searchByTime,
} from "./search.js";
import { getAllComment, addCommentOne, addCommentTwo, deleteComment } from "./comment.js";
export default {
  register,
  login,
  getUserInfo,
  getAllMessage,
  postMessage,
  updateInfo,
  publishArticle,
  getAllArticle,
  getPrivateArticle,
  getAuthorInfo,
  getArticleDetail,
  updateArticle,
  deleteArticle,
  searchPublicArticleByClass,
  searchPrivateArticleByClass,
  searchByInput,
  searchByTime,
  getAllComment,
  addCommentOne,
  addCommentTwo,
  deleteComment,
};
