import React from 'react';
import { Button, Space } from 'antd';

const TableList = ({ tables, onTableClick }) => {
  return (
    <Space wrap>
      {tables.map((table) => (
        <Button
          key={table.tableId}
          type="default"
          style={{
            width: 130,
            height: 70,
            backgroundColor: table.status === '1' ? 'rgb(73 197 158)' : 'rgb(222 228 244)',
            color: table.status === '1' ? '#fff' : '#000',
            border: '1px solid rgb(38, 6, 245)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
          onClick={() => onTableClick(table)}
        >
          {table.name}
          <div style={{ fontSize: 12, marginTop: 4 }}>
            {/* {table.itemCount} món */}
          </div>
        </Button>
      ))}
    </Space>
  );
};

export default TableList;
