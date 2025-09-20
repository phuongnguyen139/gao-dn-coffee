// /src/common/apiConstants.js

export const API_BASE_URL = "http://localhost:8080/";
export const DOMAIN = "spring-boot-app/";
export const PRINT_URL = "http://localhost:8080/spring-boot-app/api/print/receipt";

// Các endpoint cụ thể
export const API_ENDPOINTS = {

  LOGIN: `${API_BASE_URL}${DOMAIN}users/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GET_USER_INFO: `${API_BASE_URL}/user/info`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/update`,
  
  // Thêm các endpoint khác nếu cần

  //TABLE
  GET_TABLES: `${API_BASE_URL}${DOMAIN}api/tables`,


  //Categories
  GET_CATEGORIES: `${API_BASE_URL}${DOMAIN}api/categories/status?status=1`,

  // KHO
  GET_INVENYORY: `${API_BASE_URL}${DOMAIN}api/inventory`,
  POST_IMPORT_INVENTORY: `${API_BASE_URL}${DOMAIN}api/inventory/import`,


  //Products
  GET_PRODUCTS: `${API_BASE_URL}${DOMAIN}api/products`,
  GET_PRODUCTS_BY_CATEGORY: `${API_BASE_URL}${DOMAIN}api/products/by-category`,
  UPDATE_PRODUCT: `${API_BASE_URL}${DOMAIN}api/products`,
  UPDATE_PRODUCT_STATUS: `${API_BASE_URL}${DOMAIN}api/products`,

  //ORDER
  GET_ORDERS: `${API_BASE_URL}${DOMAIN}api/orders/table`,
  CREATE_ORDER: `${API_BASE_URL}${DOMAIN}api/orders`,
  UPDATE_ORDER_ITEMS: `${API_BASE_URL}${DOMAIN}api/orders/update/items`,
  CHECKOUT_ORDERS: `${API_BASE_URL}${DOMAIN}api/orders/checkout`,
  CANCEL_ORDERS: `${API_BASE_URL}${DOMAIN}api/orders/cancel`,
  TRANSFER_TABLE: `${API_BASE_URL}${DOMAIN}api/orders/transfer-table`,
  MERGE_TABLE: `${API_BASE_URL}${DOMAIN}api/orders/merge-items`,
  DETAL_ORDER: `${API_BASE_URL}${DOMAIN}api/orders/detail`,

  //TRANSACTION
  GET_SUMMARY_TRANSACTION:`${API_BASE_URL}${DOMAIN}api/transactions/summary`,
};