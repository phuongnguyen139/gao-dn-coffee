import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Card, Button, Typography, Input, message, InputNumber, Popconfirm, Modal, Space, Radio, Spin, DatePicker } from 'antd';
import { CloseOutlined, ArrowLeftOutlined, SwapOutlined, ShrinkOutlined, CheckOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { callApi } from '../../common/AxiosCallAPI';  // nơi bạn đặt hàm callApi
import { API_ENDPOINTS } from '../../common/Constants';
import { SummaryTransaction, DetailItem } from '../../data_object/CommonObject';
import { formatVND } from '../../common/CommonMethod';

const { RangePicker } = DatePicker;


const Revenue = () => {
    const location = useLocation();
    const navigate = useNavigate();



    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
    const [detailOrder, setDetailOrder] = useState();
    const [orderIdDetail, setOrderIdDetail] = useState();

    const onRangeChange = (dates, dateStrings) => {
        if (dates) {
            const start = dates[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'); // 00:00:00
            const end = dates[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');     // 23:59:59
            setStartDate(start);
            setEndDate(end);
            fetchTransactionSummary(start, end);
        }
    };

    const handleClickDescription = async (record) => {
        setOrderIdDetail(record.orderId);
        try {
            const url = `${API_ENDPOINTS.DETAL_ORDER}?orderId=${record.orderId}`;
            const detailData = await callApi(
                url,
                'get',
                {},
                (item) => new DetailItem(item)
            );
            setIsModalDetailVisible(true);
            setDetailOrder(detailData);
        } catch (error) {
            console.error('Không lấy được dữ liệu bàn:', error);
        }

    }


    const [data, setData] = useState({});
    // Fetch data từ backend
    useEffect(() => {
        const now = new Date();

        const pad = (n) => String(n).padStart(2, '0');
        const yyyy = now.getFullYear();
        const MM = pad(now.getMonth() + 1);
        const dd = pad(now.getDate());
        const HH = pad(now.getHours());
        const mm = pad(now.getMinutes());
        const ss = pad(now.getSeconds());

        const start = `${yyyy}-${MM}-${dd} 00:00:00`;
        const end = `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;

        fetchTransactionSummary(start, end);
    }, []);

    const fetchTransactionSummary = async (startDate, endDate) => {
        try {
            const url = `${API_ENDPOINTS.GET_SUMMARY_TRANSACTION}?startDate=${startDate}&endDate=${endDate}`;
            const data = await callApi(
                url,
                'get',
                {},
                (item) => new SummaryTransaction(item)
            );
            setData(data);
        } catch (error) {
            console.error('Không lấy được dữ liệu bàn:', error);
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
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            // key: 'name',
            render: (_, record) => (
                <a onClick={
                    () =>
                    // 
                    { handleClickDescription(record) }
                }
                >{record.description}
                </a>
            ),
        },
        {
            title: 'Hoá đơn số',
            dataIndex: 'orderId',
            key: 'orderId',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.orderId - b.orderId,
        },
        {
            title: 'Thời gian',
            dataIndex: 'transactionTime',
            key: 'transactionTime',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.transactionTime - b.transactionTime,
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => `${formatVND(text)}`,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Số tiền giảm giá',
            dataIndex: 'discount',
            key: 'discount',
            render: (text) => `${formatVND(text)}`,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.discount - b.discount,
        },
    ];

    // Cột cho danh sách món đã gọi
    const orderDetailColumns = [
        {
            title: 'STT',
            // dataIndex: 'stt',
            key: 'stt',
            width: 1,
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên món',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 90,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            width: 90,
            render: (text) => `${formatVND(text)}`,
        },
        {
            title: 'Thành tiền',
            key: 'total',
            width: 100,
            render: (_, record) => `${(formatVND(record.quantity * record.price))}`,
        },
    ];

    // render ui 
    return (
        <div
            style={{
                display: 'flex',
                height: '98vh',
            }}
        >

            <div
                style={{
                    flex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    // backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '10px',
                    overflow: 'hidden',
                }}
            >
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <h3>Ngày</h3>
                        <RangePicker format="YYYY-MM-DD hh:mm:ss" onChange={onRangeChange} />
                    </div>
                    <Card title={`Chi tiết: `}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Tổng chi:</span>
                                <span>{formatVND(data.totalExpense)}</span>
                                {/* Giá trị giảm giá sẽ được hiển thị ở đây */}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold' }}>
                                <span>Tổng tiền giảm giá:</span>
                                <span>{formatVND(data.totalDiscount)}</span>
                                {/* Giá trị tổng tiền sẽ được hiển thị ở đây */}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold' }}>
                                <span>Doanh thu thực tế:</span>
                                <span>{formatVND(data.totalRevenue)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* BOTTOM: Danh sách món có thể scroll */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <span>Danh sách hoá đơn</span>
                    <Table
                        dataSource={data.transactions}
                        columns={transColumns}
                        pagination={false}
                        size="small"
                        bordered
                        rowKey='orderId'
                        footer={() => ''}
                    />
                </div>
            </div>
            <Modal
                title={`Chi tiết hoá đơn: ${orderIdDetail}`}
                open={isModalDetailVisible}
                onCancel={() => { setIsModalDetailVisible(false); setOrderIdDetail(null) }}
                footer={null}
                width={{
                    // xs: '90%',
                    // sm: '80%',
                    // md: '70%',
                    // lg: '60%',
                    // xl: '50%',
                    xxl: '40%',
                }}
            >
                <Table
                    dataSource={detailOrder}
                    columns={orderDetailColumns}
                    pagination={false}
                    size="small"
                    bordered
                    rowKey='orderId'
                    footer={() => ''}
                />
            </Modal>
        </div>
    );
};
export default Revenue;