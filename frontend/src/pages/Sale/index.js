import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TableList from '../../components/TableList';
import { callApi } from '../../common/AxiosCallAPI';  // nơi bạn đặt hàm callApi
import { CoffeeTable } from '../../data_object/CoffeeTable'; // file ánh xạ DTO → object
import { API_ENDPOINTS } from '../../common/Constants'; // file ánh xạ DTO → object

const Sale = () => {

    const [tables, setTables] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    // Xử lý khi nhấn vào bàn
    const handleTableClick = (table) => {
        navigate(`/table/${table.tableId}`, { state: { tableName: table.name, tableId: table.tableId } });
    };

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await callApi(
                    API_ENDPOINTS.GET_TABLES, // URL của bạn
                    'get', // Phương thức
                    {}, // Query params (nếu có)
                    (item) => new CoffeeTable(item) // mapper: chuyển dữ liệu về dạng Table
                );
                setTables(data);
            } catch (error) {
                console.error('Không lấy được dữ liệu bàn:', error);
            }
        };

        fetchTables();
    }, [location.state]);

    return (
        <div>
            {/* <h2>Bán hàng</h2> */}
            <TableList tables={tables} onTableClick={handleTableClick} />
        </div>
    );
};
export default Sale;