// import {
//     Row, Col, Table, Card, Button, Typography, message, InputNumber, Popconfirm, Modal, Space, Radio, Spin, DatePicker,
//     Cascader,
//     Form,
//     Input,
//     Select,
//     Switch,
//     TreeSelect,
// } from 'antd';
// const InventoryExport = () => {


//     return (

//         <div
//             style={{
//                 // display: 'flex',
//                 height: '98vh',
//             }}
//         >
//             <div
//                 style={{
//                     // flex: 2,
//                     // display: 'flex',
//                     flexDirection: 'column',
//                     // backgroundColor: '#fff',
//                     borderRadius: '8px',
//                     padding: '10px',
//                     overflow: 'hidden',
//                 }}
//             >
//                 {/* BOTTOM: Danh sách món có thể scroll */}
//                 {/* <div style={{
//                     // flex: 1, 
//                     overflowY: 'auto'
//                 }}> */}
//                 <div style={{ maxHeight: '94vh', overflow: 'auto' }}>
//                     <span>Danh sách sản phẩm</span>
//                     <Table
//                     // dataSource={data}
//                     // columns={transColumns}
//                     // pagination={false}
//                     // size="small"
//                     // bordered
//                     // rowKey='productId'
//                     // footer={() => ''}
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// };

// export default InventoryExport;

import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  message,
  InputNumber,
  Form,
  Input,
  Select,
  Table,
  Spin,
} from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const InventoryExport = () => {
  const [form] = Form.useForm();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Optional: dữ liệu lịch sử nhập kho gần nhất
  const [importLogs, setImportLogs] = useState([]);

  // Gọi API lấy danh sách nguyên liệu
  const fetchIngredients = async () => {
    try {
      const res = await axios.get('/api/inventory/items'); // Bạn cần tạo API này
      setIngredients(res.data);
    } catch (err) {
      message.error('Không thể lấy danh sách nguyên liệu');
    }
  };

  const fetchImportLogs = async () => {
    try {
      const res = await axios.get('/api/inventory/logs/latest'); // Optional API
      setImportLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchImportLogs();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('/api/inventory/import', values);
      message.success('Nhập kho thành công');
      form.resetFields();
      fetchImportLogs();
    } catch (error) {
      message.error('Lỗi khi nhập kho');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', height: '100vh', overflow: 'auto' }}>
      <Card title="Nhập kho nguyên liệu" bordered={false}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Nguyên liệu"
                name="ingredientId"
                rules={[{ required: true, message: 'Chọn nguyên liệu' }]}
              >
                <Select placeholder="Chọn nguyên liệu">
                  {ingredients.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name} ({item.unit})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Số lượng nhập"
                name="quantityChange"
                rules={[{ required: true, message: 'Nhập số lượng' }]}
              >
                <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item label="Ghi chú" name="note">
                <Input placeholder="Ví dụ: Nhập thêm do sắp hết" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Nhập kho
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="Lịch sử nhập gần đây"
        style={{ marginTop: 24 }}
        bordered={false}
      >
        <Table
          size="small"
          dataSource={importLogs}
          rowKey="logId"
          columns={[
            {
              title: 'Nguyên liệu',
              dataIndex: 'ingredientName',
              key: 'ingredientName',
            },
            {
              title: 'Số lượng',
              dataIndex: 'quantityChange',
              key: 'quantityChange',
            },
            {
              title: 'Ghi chú',
              dataIndex: 'note',
              key: 'note',
            },
            {
              title: 'Thời gian',
              dataIndex: 'logTime',
              key: 'logTime',
            },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default InventoryExport;
