import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import { App, Home, Edit } from  "./views";
import configure from "./store/configure";

const store = configure();

// 将路由更新到浏览器历史记录里
const history = syncHistoryWithStore(hashHistory, store);

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Home} />
                <Route path="edit" component={Edit} />
                {/*<Route path="fill" component={App} />*/}
                {/*<Route path="check" component={App} />*/}
            </Route>
        </Router>
    </Provider>,
    document.getElementById("root")
);