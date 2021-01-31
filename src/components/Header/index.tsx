import React from "react";

import { Menu } from 'antd';

import './index.css';

function Header() {
    return (
        <React.Fragment>
            <div className="logo" />
            <div className="title">Fission</div>
            <Menu theme="dark" mode="horizontal">
                <Menu.Item key="setting" style={{ float: "right" }}>Setting</Menu.Item>
            </Menu>
        </React.Fragment>
    );
}

export default Header;
