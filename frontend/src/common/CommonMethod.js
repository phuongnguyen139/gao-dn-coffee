// ===== ĐỊNH DẠNG TIỀN TỆ =====
export const formatVND = (value, fallback = "0 ₫") => {
    if (value == null || value === "") return fallback;
    const num = Number(value);
    return isNaN(num) 
      ? fallback 
      : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };
  
  // ===== ĐỊNH DẠNG SỐ (PHÂN CÁCH HÀNG NGHÌN) =====
  export const formatNumber = (value, fallback = "0") => {
    if (value == null || value === "") return fallback;
    const num = Number(value);
    return isNaN(num) 
      ? fallback 
      : new Intl.NumberFormat("vi-VN").format(num);
  };
  
  // ===== ĐỊNH DẠNG NGÀY THÁNG =====
  export const formatDate = (date, locale = "vi-VN") => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString(locale);
  };
  
  // ===== ĐỊNH DẠNG THỜI GIAN NGẮN (ví dụ: "2 phút trước") =====
  export const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Vừa xong";
    const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    // Logic xử lý hiển thị "X phút trước", "X giờ trước"...
  };
  
  // ===== EXPORT DEFAULT (nếu muốn) =====
  export default {
    formatVND,
    formatNumber,
    formatDate,
    formatTimeAgo,
  };