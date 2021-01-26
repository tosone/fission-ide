import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

function iMenu() {
    return (
        <Menu
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            // defaultOpenKeys={['dashboard']}
            mode="inline"
            theme="dark"
        >
            <SubMenu key="dashboard" icon={<MailOutlined />} title="Dashboard" />
            <SubMenu key="functions" icon={<AppstoreOutlined />} title="Functions" />
            <SubMenu key="packages" icon={<SettingOutlined />} title="Packages" />
        </Menu>
    );
}

export default iMenu;
