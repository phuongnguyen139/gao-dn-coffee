import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom'; // ⚡ Thêm Outlet và useNavigate
import DashboardMenu from '../components/DashboardMenu';

const { Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // ⚡

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClick = (e) => {
    navigate(e.key); // ⚡ dùng navigate
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className='logo' style={{ color: 'white', textAlign: 'center', padding: 16 }}>Gao Coffee</div>
        <DashboardMenu onClick={handleClick} /> {/* ⚡ Truyền onClick */}
      </Sider>
      <Layout>
        <Content
          style={{
            margin: '5px',
            height: 'calc(100vh - 32px)', // bỏ header
          }}
        >
          <div
            id="main-container"
            style={{
              padding: 5,
              height: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxSizing: 'border-box',
            }}
          >
            <Outlet /> {/* ⚡ nội dung trang sẽ nằm đây */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
