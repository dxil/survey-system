import React, { Component, PropTypes } from "react";
import { Header, Main } from "../";
import styles from "./App.scss";
import "../../styles/reset.css";

function App({ children }) {
    console.log('aa'+children)
    return (
        <div className={styles.container}>
            <Header />
            <Main>
                {children}
            </Main>
        </div>
    );
}

App.propTypes = {
    children: PropTypes.element.isRequired
};

// class App extends Component {
//     constructor(props){
//         super(props)
//     }
//     render() {
//         const { actions, dialog, children } = this.props
//         return (
//             <div className={styles.container}>
//                 <Header />
//                 <div className={styles.main}>
//                     {children}
//                 </div>
//             </div>
//         )
//     }
// }

export default App;