import React from 'react';
import { Menu } from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  DownloadOutlined,
  DollarOutlined,
  CaretRightOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';

const DashboardMenu = ({ onClick }) => {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['/']}
      onClick={onClick} // ⚡ truyền từ layout
      items={[
        {
          key: '/',
          icon: <CaretRightOutlined />,
          label: 'Bán hàng',
        },
        {
          key: '/revenue',
          icon: <DollarOutlined />,
          label: 'Doanh thu',
        },
        {
          key: '/products',
          icon: <DollarOutlined />,
          label: 'Mặt hàng',
        },
        {
          key: '/orders',
          icon: <VideoCameraOutlined />,
          label: 'Đơn hàng',
        },
        {
          key: '/inventory',
          icon: <FolderOpenOutlined />,
          label: 'Kho',
          children: [
            { key: '/inventory-import', label: 'Nhập kho', icon: <DownloadOutlined /> },
            { key: '/inventory-export', label: 'Xuất kho', icon: <UploadOutlined /> },
          ]
        },
        {
          key: '/staff',
          icon: <UserOutlined />,
          label: 'Nhân viên',
        },
        {
          key: '/reports',
          icon: <UserOutlined />,
          label: 'Báo cáo',

        },
        {
          key: '/customers',
          icon: <UserOutlined />,
          label: 'Khách hàng',
        },
      ]}
    />
  );
};

export default DashboardMenu;
