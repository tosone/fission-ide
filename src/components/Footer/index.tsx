import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

function Header() {
    return (
        <Menu
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            mode="inline"
        >
            <SubMenu key="sub1" icon={<MailOutlined />} title="Dashboard" />
            <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Function">
                <Menu.Item key="5">
                </Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
        </Menu>
    );
}

export default Header;
