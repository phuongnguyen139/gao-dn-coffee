import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Row, Col, Table, Card, Button, Typography, message, InputNumber, Popconfirm, Modal, Space, Radio, Spin, DatePicker,
    Cascader,
    Form,
    Input,
    Select,
    Switch,
    TreeSelect,
} from 'antd';
import { CloseOutlined, ArrowLeftOutlined, SwapOutlined, ShrinkOutlined, CheckOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { callApi } from '../../common/AxiosCallAPI';  // nơi bạn đặt hàm callApi
import { API_ENDPOINTS } from '../../common/Constants';
import { Product } from '../../data_object/CommonObject';

import { formatVND } from '../../common/CommonMethod';
const { RangePicker } = DatePicker;



const Products = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingRecipe, setLoadingRecipe] = useState(false);
    const [loadingStop, setLoadingStop] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [categories, setCategories] = useState([]);
    const fetchCategories = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.GET_CATEGORIES);
            return response.data;
        } catch (error) {
            message.error('Lỗi khi tải danh mục');
        }
    };

    const [data, setData] = useState([]);
    const [product, setProduct] = useState({});
    const [isModalEditProduct, setIsModalEditProduct] = useState(false);

    useEffect(() => {
        fetchMenuItems(API_ENDPOINTS.GET_PRODUCTS, { status: null, category: null });
    }, []);

    const fetchMenuItems = async (url, { status, categoryId } = {}) => {
        try {
            // fetchCategories();
            const params = {};
            // if (status) 
            params.status = status;
            if (categoryId && categoryId !== 'all') params.category = categoryId;
            const res = await axios.get(url, { params });
            const data = res.data;
            const mappedItems = data.map((item, index) => new Product(item));
            setData(mappedItems);
        } catch (err) {
            console.error('Lỗi lấy sản phẩm:', err);
        }
    };

    // handleClickName show modla edit 
    const handleClickName = async (record) => {
        setProduct(record);
        const resCates = await fetchCategories();
        setCategories(resCates);
        form.setFieldsValue(record); // ✅ set dữ liệu form từ record
        setIsModalEditProduct(true);
    };



    // const onFormLayoutChange = ({ }) => {
    //     alert('change');
    // };

    const handleUpdateProduct = async () => {
        try {
            const updatedValues = await form.validateFields(); // ✅ lấy toàn bộ dữ liệu đã nhập
            const payload = { ...product, ...updatedValues };  // kết hợp nếu muốn giữ thêm thuộc tính cũ
            setLoadingUpdate(true);
            await axios.put(`${API_ENDPOINTS.UPDATE_PRODUCT}/${product.productId}`, payload);
            message.success('Cập nhật sản phẩm thành công');
            setIsModalEditProduct(false);
            fetchMenuItems(API_ENDPOINTS.GET_PRODUCTS);
        } catch (error) {
            message.error('Lỗi khi cập nhật sản phẩm');
        } finally {
            setLoadingUpdate(false);
        }
    };

    const handlePauseProduct = async () => {
        setLoadingStop(true);
        try {
            await axios.put(`${API_ENDPOINTS.UPDATE_PRODUCT_STATUS}/${product.productId}`, { status: 0 });
            message.success('Đã tạm dừng bán');
            setIsModalEditProduct(false);
            fetchMenuItems(API_ENDPOINTS.GET_PRODUCTS);
        } catch (error) {
            message.error('Lỗi khi tạm dừng bán');
        } finally {
            setLoadingStop(false);
        }
    };

    const handleDeleteProduct = async () => {
        setLoadingDelete(true);
        try {
            await axios.delete(`${API_ENDPOINTS.DELETE_PRODUCT}/${product.productId}`);
            message.success('Đã xoá sản phẩm');
            setIsModalEditProduct(false);
            fetchMenuItems(API_ENDPOINTS.GET_PRODUCTS);
        } catch (error) {
            message.error('Lỗi khi xoá sản phẩm');
        } finally {
            setLoadingDelete(false);
        }
    };

    // Cột cho menu
    const transColumns = [
        {
            title: 'STT',
            // dataIndex: 'stt',
            key: 'stt',
            width: 1,
            render: (text, record, index) => index + 1,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.stt - b.stt,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            // key: 'name',
            render: (_, record) => (
                <a onClick={
                    () =>
                    // 
                    { handleClickName(record) }
                }
                >{record.productName}
                </a>
            ),
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.productName - b.productName,
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'productId',
            key: 'productId',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.productId - b.productId,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.description - b.description,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `${formatVND(text)}`,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Danh mục',
            dataIndex: 'categoryName',
            key: 'categoryName',
            // render: (text) => `${formatVND(text)}`,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.categoryName - b.categoryName,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            // render: (text) => `${formatVND(text)}`,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.status - b.status,
        },
    ];



    return (

        <div
            style={{
                // display: 'flex',
                height: '98vh',
            }}
        >
            <div
                style={{
                    // flex: 2,
                    // display: 'flex',
                    flexDirection: 'column',
                    // backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '10px',
                    overflow: 'hidden',
                }}
            >
                {/* BOTTOM: Danh sách món có thể scroll */}
                {/* <div style={{
                    // flex: 1, 
                    overflowY: 'auto'
                }}> */}
                <div style={{ maxHeight: '94vh', overflow: 'auto' }}>
                    <span>Danh sách sản phẩm</span>
                    <Table
                        dataSource={data}
                        columns={transColumns}
                        pagination={false}
                        size="small"
                        bordered
                        rowKey='productId'
                        footer={() => ''}
                    />
                </div>
            </div>
            <Modal
                title={`Chi tiết sản phẩm: ${product.productName} | Mã ${product.productId}`}
                open={isModalEditProduct}
                onCancel={() => {
                    setIsModalEditProduct(false);
                    // setOrderIdDetail(null) 
                }}
                footer={null}
                width={{
                    // xs: '90%',
                    // sm: '80%',
                    // md: '70%',
                    // lg: '60%',
                    // xl: '50%',
                    xxl: '60%',
                }}
            >
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onValuesChange={(changedValues, allValues) => {
                        setProduct(prev => ({ ...prev, ...changedValues }));
                    }}
                    style={{ maxWidth: '100%' }}
                >
                    <Form.Item label="Tên sản phẩm" name="productName">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Loại danh mục" name="categoryId">
                        <Select
                            options={categories.map(cat => ({
                                label: cat.categoryName,
                                value: cat.categoryId
                            }))}
                            placeholder="Chọn danh mục"
                        />
                    </Form.Item>

                    <Form.Item label="Đơn giá" name="price">
                        <InputNumber style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item>
                        <Popconfirm
                            title="Xác nhận cập nhật thông tin món này?"
                            onConfirm={handleUpdateProduct}
                            okText="Cập nhật"
                            cancelText="Đóng"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button type="primary">Cập nhật thông tin</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="Chức năng đang phát triển!!!"
                            // onConfirm={handleDeleteProduct}
                            // okText="Ngừng"
                            cancelText="Đóng"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button type="primary" ghost>Cập nhật công thức</Button>
                        </Popconfirm>
                        {/* <Popconfirm
                            title="Xác nhận ngừng bán món này?"
                            onConfirm={handleDeleteProduct}
                            okText="Ngừng"
                            cancelText="Hủy"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button type="primary" danger ghost>Tạm dừng bán</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="Xác nhận xoá món?"
                            onConfirm={handleDeleteProduct}
                            okText="Xoá"
                            cancelText="Hủy"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button danger loading={loadingDelete}>Xoá món</Button>
                        </Popconfirm> */}
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
}

export default Products;