import { createStore } from "redux";
import rootReducer from "../reducers";

const configure = (initialState) => {
    const store = createStore(rootReducer, initialState, window.devToolsExtension ? window.devToolsExtension() : undefined);
    if (module.hot) {
        module.hot.accept("../reducers", () => { // 热加载
            const nextReducer = require("../reducers");
            store.replaceReducer(nextReducer);
        });
    }
    return store;
}

export default configure;