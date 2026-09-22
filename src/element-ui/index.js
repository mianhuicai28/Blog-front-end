import Vue from "vue";
import {
  Alert,
  Backtop,
  Button,
  Divider,
  Empty,
  Input,
  Loading,
  Menu,
  MenuItem,
  MenuItemGroup,
  MessageBox,
  Option,
  Pagination,
  Popconfirm,
  Select,
  Submenu,
  Table,
  TableColumn,
  Tag,
} from "element-ui";

[
  Alert,
  Backtop,
  Button,
  Divider,
  Empty,
  Input,
  Menu,
  MenuItem,
  MenuItemGroup,
  Option,
  Pagination,
  Popconfirm,
  Select,
  Submenu,
  Table,
  TableColumn,
  Tag,
].forEach((component) => Vue.use(component));

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$confirm = MessageBox.confirm;
