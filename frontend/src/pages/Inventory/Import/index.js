import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Table,
    Card,
    Button,
    Typography,
    InputNumber,
    Input,
    Modal,
    Form,
    message,
    DatePicker,
    Select
} from 'antd';
import { API_ENDPOINTS } from '../../../common/Constants';
import { Inventory } from '../../../data_object/CommonObject';
import { callApi } from '../../../common/AxiosCallAPI';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title } = Typography;

// const mockIngredients = [
//     { id: 1, name: 'Đường', unit: 'kg' },
//     { id: 2, name: 'Cà phê', unit: 'gói' },
//     { id: 3, name: 'Sữa', unit: 'hộp' },
//     { id: 4, name: 'Trà', unit: 'gói' },
//     { id: 5, name: 'Đá viên', unit: 'kg' },
//     { id: 1, name: 'Cà phê', unit: 'gram' },
//     { id: 2, name: 'Sữa đặc', unit: 'ml' },
//     { id: 3, name: 'Đường', unit: 'gram' },
//     { id: 4, name: 'Trà xanh', unit: 'gram' },
//     { id: 5, name: 'Cà phê', unit: 'gram' },
//     { id: 6, name: 'Sữa đặc', unit: 'ml' },
//     { id: 7, name: 'Đường', unit: 'gram' },
//     { id: 8, name: 'Trà xanh', unit: 'gram' },
//     { id: 9, name: 'Cà phê', unit: 'gram' },
//     { id: 10, name: 'Sữa đặc', unit: 'ml' },
//     { id: 13, name: 'Đường', unit: 'gram' },
//     { id: 14, name: 'Trà xanh', unit: 'gram' },
//     { id: 21, name: 'Cà phê', unit: 'gram' },
//     { id: 22, name: 'Sữa đặc', unit: 'ml' },
//     { id: 23, name: 'Đường', unit: 'gram' },
//     { id: 24, name: 'Trà xanh', unit: 'gram' },
//     { id: 31, name: 'Cà phê', unit: 'gram' },
//     { id: 42, name: 'Sữa đặc', unit: 'ml' },
//     { id: 43, name: 'Đường', unit: 'gram' },
//     { id: 54, name: 'Trà xanh', unit: 'gram' },
//     { id: 61, name: 'Cà phê', unit: 'gram' },
//     { id: 72, name: 'Sữa đặc', unit: 'ml' },
//     { id: 83, name: 'Đường', unit: 'gram' },
//     { id: 94, name: 'Trà xanh', unit: 'gram' },
// ];

const InventoryImport = () => {
    const [ingredients, setIngredients] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [importDate, setImportDate] = useState(dayjs());

    // const [importDate, setImportDate] = useState(dayjs()); // hoặc new Date()
    const [importBy, setImportBy] = useState('');

    const fetchIngredients = async () => {
        try {
            // const data = await callApi(
            //     API_ENDPOINTS.GET_INVENYORY, // URL của bạn
            //     'get', // Phương thức
            //     // { tableId: tableId }, // Query params (nếu có)
            //     (item) => new Inventory(item) // mapper: chuyển dữ liệu về dạng Order
            // );
            // console.table(data);
            //   setOrderedItems(data.orderedItems);
            const res = await axios.get(API_ENDPOINTS.GET_INVENYORY); // ✅ API lấy dữ liệu từ DB
            setIngredients(res.data);
            // setIngredients(data);
            // setData(data);
        } catch (error) {
            console.error('Không lấy được dữ liệu:', error);
        }
    };

    // Fetch data từ backend
    useEffect(() => {
        // fetchMenuItems(API_ENDPOINTS.GET_PRODUCTS, { status: 1, category: null });
        fetchIngredients();
    }, []);


    const handleAddToImport = (ingredient) => {
        if (selectedItems.find((item) => item.id === ingredient.id)) {
            message.warning('Nguyên liệu đã có trong phiếu nhập');
            return;
        }
        setSelectedItems([
            ...selectedItems,
            {
                ...ingredient,
                quantity: 1,
                price: 0,
                amount: 0,
            },
        ]);
    };

    const handleQuantityChange = (value, record) => {
        const updated = selectedItems.map((item) => {
            if (item.id === record.id) {
                const quantity = value;
                return { ...item, quantity, amount: quantity * item.price };
            }
            return item;
        });
        setSelectedItems(updated);
    };

    const handlePriceChange = (value, record) => {
        const updated = selectedItems.map((item) => {
            if (item.id === record.id) {
                const price = value;
                return { ...item, price, amount: price * item.quantity };
            }
            return item;
        });
        setSelectedItems(updated);
    };

    const handleRemove = (id) => {
        setSelectedItems(selectedItems.filter((item) => item.id !== id));
    };

    const columns = [
        {
            title: 'Tên nguyên liệu',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Đơn vị',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(value, record)}
                />
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => (
                <InputNumber
                    min={0}
                    value={record.price}
                    onChange={(value) => handlePriceChange(value, record)}
                />
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => value?.toLocaleString('vi-VN'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Button danger onClick={() => handleRemove(record.id)}>
                    Xóa
                </Button>
            ),
        },
    ];

    const totalAmount = selectedItems.reduce((sum, item) => sum + item.amount, 0);

    const handleCreateNewIngredient = async (values) => {
        const newIngredient = {
            name: values.name,
            unit: values.unit,
            type: values.type,
            quantity: 0,
            alertThreshold: 0, // hoặc giá trị mặc định khác
            status: 'AVAILABLE',
        };
        try {
            const res = await axios.post(API_ENDPOINTS.GET_INVENYORY, newIngredient);
            setIngredients([...ingredients, res.data]);
            message.success('Đã thêm nguyên liệu vào kho');
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Lỗi khi thêm nguyên liệu:', error);
            message.error('Thêm nguyên liệu thất bại');
        }
        // setIngredients([...ingredients, newIngredient]);
        // setIsModalVisible(false);
        // form.resetFields();
        // message.success('Đã thêm nguyên liệu mới');
    };

    const handleSubmitImport = async () => {
        if (selectedItems.length === 0) {
            message.warning('Vui lòng chọn ít nhất một nguyên liệu để nhập kho.');
            return;
        }
        const invalid = selectedItems.some(item => item.price <= 0);
        if (invalid) {
            message.warning('Vui lòng nhập đơn giá hợp lệ cho tất cả nguyên liệu.');
            return;
        }

        const payload = selectedItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            pricePerUnit: item.price,
            // amount: item.amount,
            importDate: importDate.toISOString(),
        }));

        try {
            const url = `${API_ENDPOINTS.POST_IMPORT_INVENTORY}?userName=${encodeURIComponent(importBy || 'Gạo Coffee')}`;
            await axios.post(url, payload);
            message.success('Nhập kho thành công');
            setSelectedItems([]);
        } catch (error) {
            console.error('Lỗi khi nhập kho:', error);
            message.error('Lỗi khi nhập kho');
        }

        // console.log('Ngày nhập:', importDate.format('YYYY-MM-DD HH:mm:ss'));
        // console.log('Danh sách nhập:', selectedItems);
        // console.log('import By:', importBy || 'Gạo Coffee');
        message.success('Phiếu nhập kho đã được xác nhận.');
    };

    return (
        <div style={{ display: 'flex', height: '98vh', padding: 10 }}>
            <div style={{ flex: 1, paddingRight: 10, overflowY: 'auto' }}>
                <Card
                    title="Danh sách nguyên liệu"
                    extra={<Button onClick={() => setIsModalVisible(true)}>+ Thêm mới</Button>}
                >
                    {/* {ingredients.map((ingredient) => (
                        <div
                            key={ingredient.id}
                            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
                        >
                            <span>{ingredient.name} ({ingredient.unit})</span>
                            <span>{ingredient.type.label} </span>
                            <Button size="small" onClick={() => handleAddToImport(ingredient)}>
                                Chọn
                            </Button>
                        </div>
                    ))} */}

                    <Table
                        dataSource={ingredients}
                        rowKey="id"
                        size="small"
                        pagination={false}
                        bordered
                        columns={[
                            {
                                title: 'Tên nguyên liệu',
                                dataIndex: 'name',
                                key: 'name',
                            },
                            {
                                title: 'Đơn vị',
                                dataIndex: 'unit',
                                key: 'unit',
                            },
                            {
                                title: 'Kiểu',
                                // dataIndex: ['type', 'type'], // truy cập type.label
                                dataIndex: 'type',
                                key: 'type',
                                render: (type) => <span>{type}</span>,
                            },
                            {
                                title: 'Thao tác',
                                key: 'action',
                                render: (_, record) => (
                                    <Button size="small" onClick={() => handleAddToImport(record)}>
                                        Chọn
                                    </Button>
                                ),
                            },
                        ]}
                    />
                </Card>
            </div>
            <div style={{ flex: 2, overflowY: 'auto' }}>
                <Card title="Phiếu nhập kho">
                    <div style={{ marginBottom: 16 }}>
                        <span style={{ marginRight: 8 }}>Ngày nhập:</span>
                        <DatePicker
                            showTime
                            value={importDate}
                            onChange={(date) => setImportDate(date)}
                            format="YYYY-MM-DD HH:mm:ss"
                        />

                        <span style={{ margin: '0 8px' }}>Người nhập:</span>
                        <Input
                            placeholder="Nhập tên người nhập"
                            value={importBy}
                            onChange={(e) => setImportBy(e.target.value)}
                            style={{ width: 200 }}
                        />

                        <div style={{ textAlign: 'right', marginTop: 16 }}>
                            <strong>Tổng cộng: {totalAmount.toLocaleString('vi-VN')} VND</strong>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: 16 }}>
                            <Button type="primary" onClick={handleSubmitImport}>Xác nhận nhập kho</Button>
                        </div>
                    </div>


                    <Table
                        dataSource={selectedItems}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                        size="small"
                        bordered
                    />
                    {/* <div style={{ textAlign: 'right', marginTop: 16 }}>
            <strong>Tổng cộng: {totalAmount.toLocaleString('vi-VN')} VND</strong>
          </div>
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button type="primary" onClick={handleSubmitImport}>Xác nhận nhập kho</Button>
          </div> */}
                </Card>
            </div>
            <Modal
                title="Thêm nguyên liệu mới"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateNewIngredient}>
                    <Form.Item
                        name="type"
                        label="Loại"
                        rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                    >
                        <Select placeholder="Chọn loại nguyên liệu">
                            <Select.Option value="NGUYEN_LIEU">Nguyên liệu</Select.Option>
                            <Select.Option value="VAT_DUNG">Dụng cụ</Select.Option>
                            <Select.Option value="KHAC">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="name" label="Tên nguyên liệu" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="unit" label="Đơn vị (Cái, Ký, Hộp, Gói...)" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InventoryImport;
