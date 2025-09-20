import React, { useState, useEffect } from 'react';
import { Input, Button, message, Tabs } from 'antd';
import axios from 'axios';
import { API_ENDPOINTS } from '../common/Constants';

const SearchAndCategories = ({ onSearch, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_CATEGORIES);
      // setCategories(response.data);
      const tabItems = [
        { categoryId: "0", categoryName: 'Tất cả' }, // key '0' = không chọn danh mục cụ thể
        ...response.data
      ];
      setCategories(tabItems);
      setLoading(false);
    } catch (error) {
      message.error('Lỗi khi tải danh mục');
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    onSearch(value);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };



  return (
    <div style={{ 
      // marginBottom: '16px' 

    }}>
      <Input.Search
        placeholder="Tìm món..."
        allowClear
        // style={{ marginBottom: 8 }}
        onSearch={handleSearch}
        loading={loading}
      />
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {/* <Button
          style={{ marginRight: 2 }}
          type={!selectedCategory ? 'primary' : 'default'}
          onClick={() => handleCategoryClick('0')}
        >
          Tất cả
        </Button> */}
        {/*
        {categories.map(category => (
          <Button
            key={category.categoryId}
            style={{ marginRight: 2 }}
            type={selectedCategory === category.categoryId ? 'primary' : 'default'}
            onClick={() => handleCategoryClick(category.categoryId)}
          >
            {category.categoryName}
          </Button>
        ))} */}
           <Tabs
          activeKey={selectedCategory?.toString()}
          onChange={(key) => handleCategoryClick(parseInt(key))}
          tabPosition="top"
          type="line"
          items={categories.map(category => ({
            label: category.categoryName,
            key: category.categoryId.toString(), // Tabs yêu cầu key là string
          }))}
        />
      </div>

      {/* <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}> */}
        {/* <Button
          style={{ marginRight: 2 }}
          type={!selectedCategory ? 'primary' : 'default'}
          onClick={() => handleCategoryClick('0')}
        >
          Tất cả
        </Button> */}

        {/* {categories.map(category => (
          <Button 
            key={category.categoryId} 
            style={{ marginRight: 2 }}
            type={selectedCategory === category.categoryId ? 'primary' : 'default'}
            onClick={() => handleCategoryClick(category.categoryId)}
          >
            {category.categoryName}
          </Button>
        ))} */}

        {/* <Tabs
          activeKey={selectedCategory?.toString()}
          onChange={(key) => handleCategoryClick(parseInt(key))}
          tabPosition="top"
          type="line"
          items={categories.map(category => ({
            label: category.categoryName,
            key: category.categoryId.toString(), // Tabs yêu cầu key là string
          }))}
        /> */}
      {/* </div> */}
    </div>
  );
};

export default SearchAndCategories;