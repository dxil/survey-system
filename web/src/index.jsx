import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import { App } from  "./views";
import configure from "./store/configure";

const store = configure;

// 将路由更新到浏览器历史记录里
const history = syncHistoryWithStore(hashHistory, store);