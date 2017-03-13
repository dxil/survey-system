import React from "react";
import { Link } from "react-router";
import styles from "./Header.scss";

function Header() {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>问卷管理</h1>
        </div>
    );
}

export default Header;