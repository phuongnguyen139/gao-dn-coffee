
import React from 'react';
import { Button, Space , Popconfirm} from 'antd';

const MoveTable = ({ tables, onTableClick, isMove }) => {
  return (
    <Space wrap>
      {tables.map((table) => (
        <Popconfirm
          title={isMove ? "Chuyển đến bàn này?" : "Gộp vào bàn này?"}
          // description="Bạn có thực sự muốn xóa món này?"
          // icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          // onConfirm={confirm}
          // disabled={!data.orderId}
          onConfirm={() => onTableClick(table)}  // Gọi khi nhấn "Yes"
          // onCancel={cancel}
          okText="Yes"
          cancelText="No"
          key={table.tableId}
        >
          <Button
            key={table.tableId}
            type="default"
            style={{
              width: 130,
              height: 70,
              backgroundColor: table.status === '1' ? '#002140' : '#596481',
              color: table.status === '1' ? '#fff' : '#000',
              border: '1px solid #d9d9d9',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
            }}
            // onClick={() => onTableClick(table)}
          >
            {table.name}
            <div style={{ fontSize: 12, marginTop: 4 }}>
              {/* {table.itemCount} món */}
            </div>
          </Button>
        </Popconfirm>
        
      ))}
    </Space>
  );
};

export default MoveTable;
