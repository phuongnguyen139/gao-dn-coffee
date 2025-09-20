// import axios from 'axios';

// /**
//  * Gọi API và ánh xạ kết quả vào object custom
//  * @param {string} url - Đường dẫn API
//  * @param {string} method - Phương thức HTTP: 'get', 'post', 'put', 'delete'
//  * @param {object} [data] - Dữ liệu gửi đi (nếu có)
//  * @param {function} [mapToObject] - Hàm callback ánh xạ dữ liệu (data) -> object
//  * @returns {Promise<any>} - Dữ liệu đã ánh xạ (hoặc raw nếu không có ánh xạ)
//  */
// export const callApi = async (url, method = 'get', data = null, mapToObject = null) => {
//   try {
//     const config = { method, url };
//     if (data && ['post', 'put', 'patch'].includes(method)) {
//       config.data = data;
//     }

//     const response = await axios(config);
//     const res = response.data;

//     if (res.status === 'SUCCESSFUL' && !res.error) {
//       const result = res.data;
//       return mapToObject
//         ? Array.isArray(result)
//           ? result.map(mapToObject)
//           : mapToObject(result)
//         : result;
//     } else {
//       throw new Error(res.mesage || 'Lỗi không xác định');
//     }
//   } catch (err) {
//     console.error('Lỗi API:', err.message);
//     throw err;
//   }
// };

import axios from 'axios';

/**
 * Hàm gọi API chung
 * @param {string} url - URL của API
 * @param {string} method - Phương thức HTTP: 'get', 'post', 'put', 'delete'
 * @param {object} payload - Dữ liệu gửi lên (query param hoặc body)
 * @param {function} mapper - Hàm chuyển đổi object trả về
 * @returns {Promise<any>} - Kết quả trả về sau khi map
 */
// export async function callApi(url, method = 'get', payload = {}, mapper = (x) => x) {
//   try {
//     const config = {
//       method: method.toLowerCase(),
//       url: url,
//     };

//     if (method.toLowerCase() === 'get') {
//       config.params = payload;
//     } else {
//       config.data = payload;
//     }

//     const response = await axios(config);

//     const rawData = response?.data?.data;

//     if (Array.isArray(rawData)) {
//       return rawData.map(mapper);
//     } else if (rawData) {
//       return mapper(rawData);
//     }

//     return null;
//   } catch (error) {
//     console.error('Lỗi khi gọi API:', error);
//     throw error;
//   }
// }

export async function callApi(url, method = 'get', payload = {}, mapper = (x) => x, queryParams = {}) {
  try {
    const config = {
      method: method.toLowerCase(),
      url,
      params: queryParams
    };

    if (method.toLowerCase() === 'get') {
      config.params = { ...config.params, ...payload };
    } else {
      config.data = payload;
    }

    const response = await axios(config);
    const rawData = response?.data?.data;

    if (Array.isArray(rawData)) return rawData.map(mapper);
    if (rawData) return mapper(rawData);
    return null;
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    throw error;
  }
}

