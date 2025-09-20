import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ConfigProvider, theme, App as AntdApp } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider
    theme={{
      // algorithm: theme.darkAlgorithm,
    }}
  >
    <AntdApp> {/* 👈 Thêm dòng này */}
      <App />
    </AntdApp> {/* 👈 Và đóng lại ở đây */}
  </ConfigProvider>
);
