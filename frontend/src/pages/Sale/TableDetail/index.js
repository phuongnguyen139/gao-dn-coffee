import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Card, Button, Typography, Input, message, InputNumber, Popconfirm, Modal, Space, Radio, Spin } from 'antd';
import SearchAndCategories from '../../../components/SearchAndCategories';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../common/Constants';
import { PRINT_URL } from '../../../common/Constants';
import { useNavigate, useLocation } from 'react-router-dom';
import { CloseOutlined, ArrowLeftOutlined, SwapOutlined, ShrinkOutlined, CheckOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { callApi } from '../../../common/AxiosCallAPI';  // nơi bạn đặt hàm callApi
import { Order } from '../../../data_object/Order'; // file ánh xạ DTO → object
import { MenuItem } from '../../../data_object/MenuItem'; // file ánh xạ DTO → object
import { formatVND } from '../../../common/CommonMethod';
import MoveTable from '../../../components/MoveTable';
import { CoffeeTable } from '../../../data_object/CoffeeTable';

const TableDetail = () => {
  const { Text } = Typography;
  const navigate = useNavigate();
  const location = useLocation();
  const tableName = location.state?.tableName; // lấy từ state
  const tableId = location.state?.tableId; // lấy từ state
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orderedItems, setOrderedItems] = useState([
    // { id: 1, name: 'Cà phê sữa', quantity: 2, price: 40000 },
    // { id: 2, name: 'Trà đào', quantity: 1, price: 25000 },
  ]);

  // const [discount, setDiscount] = useState();
  // const [subTotal, setSubTotal] = useState();
  // const [total, setTotal] = useState();

  // var subTotal = data.subTotal;
  // var total = data.total;

  const [customerName, setCustomerName] = useState('');

  const handleInputChange = (e) => {
    setCustomerName(e.target.value);
  };

  const [data, setData] = useState({
    // subTotal: 0,
    // total: 0,
    // discount: 0,
    // feeService: 0,
    // orderedItems: []
  });

  const [isModalPayOpen, setIsModalPayOpen] = useState(false);
  const [openGroupTable, setOpenGroupTable] = useState(false);
  const [openMoveTable, setOppenMoveTable] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  const [customerPay, setCustomerPay] = useState(null); // số tiền khách đưa
  const [discount, setDiscount] = useState(); // số tiền giảm gía trực tiếp
  const [changeAmount, setChangeAmount] = useState(0); // tiền thối lại
  // Xử lý khi nhập số tiền khách đưa
  const onCustomerPayChange = (value) => {
    setCustomerPay(value);
  };

  const onDiscountChange = (value) => {
    setDiscount(value);
  }

  // Tính tiền thối lại mỗi khi khách nhập tiền
  useEffect(() => {
    if (customerPay !== null && !isNaN(customerPay)) {
      const change = customerPay - data.total;
      setChangeAmount(change > 0 ? change : 0);
    } else {
      setChangeAmount(0);
    }
  }, [customerPay, data.total]);
  // Fetch data từ backend
  useEffect(() => {
    fetchMenuItems(API_ENDPOINTS.GET_PRODUCTS, { status: 1, category: null });
    fetchOrderDetail();
  }, []);

  const fetchMenuItems = async (url, { status, categoryId } = {}) => {
    try {
      const params = {};
      if (status) params.status = status;
      // if (categoryId && categoryId !== 'all') params.category = categoryId;
      params.category = categoryId;
      const res = await axios.get(url, { params });
      const data = res.data;
      const mappedItems = data.map((item, index) => new MenuItem(item, index));

      setMenuItems(mappedItems);
      setAllMenuItems(mappedItems);
    } catch (err) {
      console.error('Lỗi lấy sản phẩm:', err);
    }
  };

  const fetchOrderDetail = async () => {
    try {
      const data = await callApi(
        API_ENDPOINTS.GET_ORDERS, // URL của bạn
        'get', // Phương thức
        { tableId: tableId }, // Query params (nếu có)
        (item) => new Order(item) // mapper: chuyển dữ liệu về dạng Order
      );

      setOrderedItems(data.orderedItems);
      setData(data);
    } catch (error) {
      console.error('Không lấy được dữ liệu bàn:', error);
    }
  };

  const callPaidAPI = async () => {
    try {
      const dataResult = await callApi(
        API_ENDPOINTS.CHECKOUT_ORDERS, // URL của bạn
        'post', // Phương thức
        { orderId: data.orderId, discount: discount || 0 }, // Query params (nếu có)
        (item) => new Order(item) // mapper: chuyển dữ liệu về dạng Order
      );
      // setData(dataResult);
      return dataResult;
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
    }
  };

  const callCancelAPI = async () => {
    try {
      const dataResult = await callApi(
        API_ENDPOINTS.CANCEL_ORDERS, // URL của bạn
        'post', // Phương thức
        { orderId: data.orderId }, // Query params (nếu có)
        (item) => new Order(item) // mapper: chuyển dữ liệu về dạng Order
      );
      setData(dataResult);
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
    }
  };
  const createOrder = async (tableId, discountCode, items) => {
    const payload = {
      tableId,
      discountCode,
      items
    };

    try {
      const createdOrder = await callApi(
        API_ENDPOINTS.CREATE_ORDER,
        'post',
        payload,
        (item) => new Order(item)
      );
      return createdOrder;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      return null;
    }
  };



  const updateOrderItems = async (orderId, tableId, items) => {
    try {
      const url = `${API_ENDPOINTS.UPDATE_ORDER_ITEMS}?orderId=${orderId}&tableId=${tableId}`;
      const updatedOrder = await callApi(
        url,
        'put',
        items,
        (item) => new Order(item)
      );
      return updatedOrder;
    } catch (error) {
      console.error("Lỗi khi cập nhật món:", error);
      return null;
    }
  };

  const handleActionAdd = async (record) => {
    const currentItems = data?.orderedItems || [];

    const exists = currentItems.find(item => item.productId === record.productId);
    let updatedItems;

    if (exists) {
      updatedItems = currentItems.map(item =>
        item.productId === record.productId
          ? {
            ...item,
            quantity: item.quantity + 1,
            amount: (item.quantity + 1) * item.price
          }
          : item
      );
    } else {
      updatedItems = [
        ...currentItems,
        {
          productId: record.productId,
          productName: record.productName,
          quantity: 1,
          price: record.price,
          amount: record.price
        }
      ];
    }

    let updatedOrder;

    if (!data.orderId) {
      updatedOrder = await createOrder(tableId, null, updatedItems);
    } else {
      updatedOrder = await updateOrderItems(data.orderId, tableId, updatedItems);
    }

    if (updatedOrder) {
      setData(updatedOrder);
      message.success(`Đã chọn món: ${record.productName}`);
    } else {
      message.error("Không thể thêm món vào đơn hàng.");
    }
  };

  const handleActionDelete = async (record) => {
    // Lọc bỏ món đã chọn
    const updatedItems = data.orderedItems.filter(item => item.productId !== record.productId);

    // Cập nhật data
    let updatedOrder;
    if (data.orderId) {
      updatedOrder = await updateOrderItems(data.orderId, tableId, updatedItems);
      setData(updatedOrder);
    }
    message.warning(`Đã xoá món: ${record.productName}`);
  };

  // xóa món khỏi order
  // const confirm = e => {
  //   message.success('Click on Yes');
  // };

  const cancel = e => {
    // message.info('Không xóa món này!');
  };

  // const confirm = e =>
  const showPayModal = () => {
    setIsModalPayOpen(true);
  };

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // chuyen ban
  const showMoveTableModal = async () => {
    setLoading(true);
    setOppenMoveTable(true);
    try {
      const tableDatas = await callApi(
        API_ENDPOINTS.GET_TABLES, // URL của bạn
        'get', // Phương thức
        {
          status: 0,
          tableId: tableId
        }, // Query params (nếu có)
        (item) => new CoffeeTable(item) // mapper: chuyển dữ liệu về dạng Table
      );
      setTables(tableDatas);
      setLoading(false);
    } catch (error) {
      console.error('Không lấy được dữ liệu bàn:', error);
    }
  };


  // gop ban
  const showGroupTableModal = async () => {
    setLoading(true);
    setOpenGroupTable(true);
    try {
      const tableDatas = await callApi(
        API_ENDPOINTS.GET_TABLES, // URL của bạn
        'get', // Phương thức
        {
          status: 1,
          tableId: tableId
        }, // Query params (nếu có)
        (item) => new CoffeeTable(item) // mapper: chuyển dữ liệu về dạng Table
      );
      setTables(tableDatas);
      setLoading(false);
    } catch (error) {
      console.error('Không lấy được dữ liệu bàn:', error);
    }
  };

  const mergeTables = async (fromOrderId, toOrderId) => {
    try {
      const url = `${API_ENDPOINTS.MERGE_TABLE}?fromOrderId=${fromOrderId}&toOrderId=${toOrderId}`;
      const mergedOrder = await callApi(
        url,
        'put',
        null, // Không có body
        (item) => new Order(item)
      );

      return mergedOrder;
    } catch (error) {
      console.error("Lỗi khi gộp bàn:", error);
      return null;
    }
  };

  const [printValue, setPrintValue] = useState(1);

  const onPrintChange = e => {
    setPrintValue(e.target.value);
  };


  const transferTable = async (orderId, newTableId) => {
    try {
      const url = `${API_ENDPOINTS.TRANSFER_TABLE}?orderId=${orderId}&newTableId=${newTableId}`;
      const transferredOrder = await callApi(
        url,
        'put',
        null, // Không có body
        (item) => new Order(item)
      );

      return transferredOrder;
    } catch (error) {
      console.error("Lỗi khi chuyển bàn:", error);
      return null;
    }
  };


  const handleOk = async () => {
    try {
      let dataResult = await callPaidAPI();        // đợi backend xử lý xong
      try {
        let requestData = {
          tableName: tableName,
          data: dataResult,
          customerName: customerName || "Gao Coffee"
        }
        if (printValue == 2) {
          await axios.post(PRINT_URL, requestData, { timeout: 5000 });
        }
      } catch (error) {
        console.error("In hóa đơn thất bại:", error);
        message.warning("Lỗi khi in hóa đơn!!!");
      }
      message.info("Đã thanh toán !");
      setIsModalPayOpen(false);

      // Delay chuyển trang để đảm bảo Modal đóng trước
      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (error) {
      console.error("Thanh toán thất bại:", error);
      message.error("Không thể thanh toán, vui lòng thử lại.");
    }

  };


  const prinBill = async () => {
    try {
      let requestData = {
        tableName: tableName,
        data: data,
        customerName: customerName || "Gao Coffee"
      }
      await axios.post(PRINT_URL, requestData, { timeout: 5000 });
      message.info("Đã in hoá đơn tạm tính!!!");
    } catch (error) {
      console.error("In hóa đơn thất bại:", error);
      message.warning("Lỗi khi in hóa đơn!!!");
    }
  };

  const handleCancel = () => {
    setIsModalPayOpen(false);
  };


  const handleQuantityChange = async (value, record) => {

    const updatedItems = data.orderedItems.map(item =>
      item.productId === record.productId
        ? {
          ...item,
          quantity: value,
          amount: value * item.price
        }
        : item
    );

    let updatedOrder;
    if (data.orderId) {
      updatedOrder = await updateOrderItems(data.orderId, tableId, updatedItems);
      setData(updatedOrder);
    }

  };

  // Hủy đơn hàng
  const handleCancleOrder = async () => {
    try {
      await callCancelAPI();
      message.info("Đã hủy đơn hàng!!!");
      navigate(`/`);
    }
    catch (error) {
      console.error("Hủy hóa đơn thất bại:", error);
      message.error("Không thể hủy hóa đơn, vui lòng thử lại.");
    }
  };

  // Cột cho menu
  const menuColumns = [
    {
      title: 'STT',
      // dataIndex: 'stt',
      key: 'stt',
      width: 1,
      render: (text, record, index) => index + 1,
    },
    // {
    //     title: 'Id',
    //     dataIndex: 'id',
    //     key: 'id',
    // },
    {
      title: 'Tên món',
      dataIndex: 'productName',
      // key: 'name',
      render: (_, record) => (
        <a onClick={() => handleShowRecipe(record)}>{record.productName}</a>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 1,
      // render: (text) => `${text.toLocaleString()}đ`,
      render: (text) => `${formatVND(text)}`,
    },

    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 1,
      render: (_, record) => ( // `record` chứa dữ liệu của hàng hiện tại
        <>
          {/* <Button style={{ marginRight: 8 }}
            color="primary" variant="outlined" 
            onClick={() => handleActionAdd(record)} // Xử lý khi click
          >
            Xem CT
          </Button> */}
          <Button
            color="primary" variant="outlined"
            onClick={() => handleActionAdd(record)} // Xử lý khi click
          >
            Thêm
          </Button>

        </>
      ),
    },
  ];

  // Cột cho danh sách món đã gọi
  const orderColumns = [
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
      width: 1,
      render: (_, record) => ( // `record` chứa dữ liệu của hàng hiện tại
        <InputNumber
          min={1}
          value={record.quantity}
          // onChange={(value) => handleQuantityChange(value, record)}
          onChange={(value) => {
            if (value) handleQuantityChange(value, record); // Chỉ gọi nếu value hợp lệ
          }}

          onBlur={(e) => {
            if (!e.target.value) {
              // Nếu người dùng xoá hết => reset lại 1
              handleQuantityChange(1, record);
            }
          }}
        >

        </InputNumber>
      ),
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
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 90,
      render: (_, record) => ( // `record` chứa dữ liệu của hàng hiện tại
        <Popconfirm
          title="Bạn có thực sự muốn xóa món này?"
          // description="Bạn có thực sự muốn xóa món này?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          // onConfirm={confirm}
          onConfirm={() => handleActionDelete(record)}  // Gọi khi nhấn "Yes"
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <Button
            color="danger" variant="outlined"
          // onClick={() => handleActionDelete(record)} // Xử lý khi click
          >
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Trong component cha
  const handleSearch = (searchValue) => {
    // Gọi API hoặc filter dữ liệu dựa trên searchValue
    if (!searchValue) {
      // Nếu input rỗng => reset lại danh sách gốc
      setMenuItems(allMenuItems); // `allMenuItems` là danh sách gốc từ API
    } else {
      const filtered = allMenuItems.filter(item =>
        item.productName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setMenuItems(filtered);
    }
  };

  // Xử lý khi nhấn vào chọn danh mục mặt hàng
  const handleCategorySelect = (categoryId) => {
    // Gọi API hoặc filter dữ liệu dựa trên categoryId
    fetchMenuItems(API_ENDPOINTS.GET_PRODUCTS_BY_CATEGORY, { status: 1, categoryId: categoryId });
  };

  // Xử lý khi nhấn vào button thoát
  const handleExitClick = () => {
    navigate(`/`);
  };

  // Xử lý khi nhấn vào tên món hàng hiển thị công thức và cách làm món đó
  const handleShowRecipe = (record) => {
    setSelectedDish(record);
    setIsModalVisible(true);
  };

  // Xử lý khi nhấn vào bàn
  const handleMoveTableClick = async (table) => {
    await transferTable(data.orderId, table.tableId);
    navigate(`/`);
  };

  // Xử lý khi nhấn vào bàn
  const handleGroupTableClick = async (table) => {
    // navigate(`/table/${table.id}`, { state: { tableName: table.name , tableId: table.id } });
    await mergeTables(data.orderId, table.orderId);
    navigate(`/`);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '98vh',
        // backgroundColor: '#f0f2f5',
        // padding: '16px',
      }}
    >
      {/* VÙNG TRÁI */}
      <div
        style={{
          flex: 1,
          //   marginRight: '16px',
          display: 'flex',
          flexDirection: 'column',
          //   backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '10px',
          overflow: 'hidden',
        }}
      >
        {/* TOP: Tìm kiếm & filter */}
        <div style={{ marginBottom: '16px' }}>
          <SearchAndCategories
            onSearch={handleSearch}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        {/* BOTTOM: Danh sách món có thể scroll */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Card title={'Danh sách món'}>
            <Table
              dataSource={menuItems}
              columns={menuColumns}
              pagination={false}
              size="small"
              bordered
              rowKey='productId'
            />
          </Card>
        </div>
      </div>

      {/* VÙNG PHẢI */}
      <div
        style={{
          flex: 2,
          //   backgroundColor: '#fff',
          //   borderRadius: '8px',
          //   padding: '16px',
          // marginRight: '16px',
          display: 'flex',
          flexDirection: 'column',
          // backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '10px',
          overflow: 'hidden',
        }}
      >
        {/* TOP: Tìm kiếm & filter */}
        <div style={{ marginBottom: '16px' }}>
          <Card title={`Chi tiết: ${tableName}`}>
            <div style={{ marginBottom: '16px' }}>
              {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Số bàn:</span> */}
              {/* <span>{tableNumber}</span>  */}
              {/* Giá trị số bàn sẽ được hiển thị ở đây */}
              {/* </div> */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Thành tiền:</span>
                <span>{formatVND((data.subTotal))}</span>
                {/* <span>{(subTotal).toLocaleString()}đ</span>  */}
                {/* Giá trị thành tiền sẽ được hiển thị ở đây */}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Phí dịch vụ:</span>
                <span>{formatVND((data.feeService))}</span>
                {/* Giá trị giảm giá sẽ được hiển thị ở đây */}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Giảm giá:</span>
                <span>{formatVND((data.discount))}</span>
                {/* Giá trị giảm giá sẽ được hiển thị ở đây */}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold' }}>
                <span>Tổng tiền thanh toán:</span>
                <span> {formatVND((data.total))}</span>
                {/* Giá trị tổng tiền sẽ được hiển thị ở đây */}
              </div>
              {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold' }}>
                <span>Khách hàng</span>
                <Input placeholder="Tên khách hàng..." style={{ width: '85%' }} />
              </div> */}
              <Row>
                <Col span={3}><span>Khách hàng</span></Col>
                <Col span={21}><Input placeholder="Tên khách hàng..." onChange={handleInputChange} /></Col>
              </Row>
            </div>
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <Button style={{ marginRight: 8 }} type="primary" ghost icon={<SwapOutlined />} disabled={!data.orderId} onClick={showMoveTableModal}>Chuyển bàn</Button>
              <Button style={{ marginRight: 8 }} type="primary" ghost icon={<ShrinkOutlined />} disabled={!data.orderId} onClick={showGroupTableModal}>Gộp bàn</Button>
              <Button color="cyan" variant="solid" style={{ marginRight: 8 }} icon={<CheckOutlined />} onClick={showPayModal} disabled={!data.orderId}> Thanh toán</Button>
              <Popconfirm
                title="Hủy hóa đơn này?"
                // description="Bạn có thực sự muốn xóa món này?"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                // onConfirm={confirm}
                disabled={!data.orderId}
                onConfirm={() => handleCancleOrder()}  // Gọi khi nhấn "Yes"
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button style={{ marginRight: 8 }} type="primary" danger ghost icon={<CloseOutlined />} disabled={!data.orderId}>Hủy bàn</Button>
              </Popconfirm>
              <Button style={{ marginRight: 8 }} onClick={handleExitClick} type="primary" danger ghost icon={<ArrowLeftOutlined />}>Thoát</Button>
            </div>
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', marginTop: 10 }}>
              <Button style={{ marginRight: 8 }} type="primary" ghost icon={<SwapOutlined />} disabled={!data.orderId} onClick={prinBill}>In hóa đơn tạm tính</Button>
            </div>
          </Card>
        </div>

        {/* BOTTOM: Danh sách món có thể scroll */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          <Table
            // dataSource={orderedItems}
            dataSource={data.orderedItems}
            columns={orderColumns}
            pagination={false}
            size="small"
            bordered
            rowKey='productId'
            footer={() => ''}
          />
        </div>


        {/* <h3>Chi tiết bàn (placeholder)</h3> */}
      </div>
      <Modal
        title="Thanh Toán"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalPayOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p> */}
        <Text strong>Tổng tiền: </Text>
        <Text type="danger" style={{ fontSize: 18 }}>{formatVND(data.total)} </Text>
        <br />
        <Text strong>Số tiền khách đưa:</Text>
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          value={customerPay}
          onChange={onCustomerPayChange}
          placeholder="Nhập số tiền khách đưa"
        />
        <Text strong>Giảm giá tiền mặt:</Text>
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          value={discount}
          onChange={onDiscountChange}
          placeholder="Nhập số tiền giảm"
        />
        <br />
        <Text strong>Tiền thối lại:</Text>
        <br />
        <Text type="success" style={{ fontSize: 18 }}>{formatVND(changeAmount)} </Text>
        <br />

        <Radio.Group
          onChange={onPrintChange}
          value={printValue}
          options={[
            {
              value: 1,
              // className: 'option-1',
              label: "Thanh toán và không in hóa đơn",
            },
            {
              value: 2,
              className: 'option-2',
              label: "Thanh toán và in hóa đơn",
            }
          ]}
        />

      </Modal>

      {/* modale gộp bàn */}
      <Modal
        title="Gộp bàn?"
        centered
        open={openGroupTable}
        // onOk={() => setOpenGroupTable(false)}
        onCancel={() => setOpenGroupTable(false)}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
      >
        {loading ? (
          <Spin />
        ) : tables ? (
          <div>
            <MoveTable tables={tables} onTableClick={handleGroupTableClick} isMove={false} />
          </div>
        ) : (
          <p>Không có dữ liệu.</p>
        )}


        {/* <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p> */}
      </Modal>

      {/* modale chuyển bàn */}
      <Modal
        title="Chuyển đến bàn?"
        centered
        open={openMoveTable}
        // onOk={() => setOppenMoveTable(false)}
        onCancel={() => setOppenMoveTable(false)}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
      >
        {loading ? (
          <Spin />
        ) : tables ? (
          <div>
            <MoveTable tables={tables} onTableClick={handleMoveTableClick} isMove={true} />
          </div>
        ) : (
          <p>Không có dữ liệu.</p>
        )}
      </Modal>

      <Modal
        title={`Công thức & Cách làm: ${selectedDish?.productName}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <p><strong>Nguyên liệu:</strong></p>
        {Array.isArray(selectedDish?.recipes) && selectedDish.recipes.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>#</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tên nguyên liệu</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Số lượng</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              {selectedDish.recipes.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.ingredients}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có dữ liệu nguyên liệu.</p>
        )}

        <p><strong>Cách làm:</strong></p>
        <p>{selectedDish?.description || 'Chưa có hướng dẫn cụ thể.'}</p>
      </Modal>
    </div>


  );
};

export default TableDetail;
