// Order.js
export function Order(dto) {
    this.orderId = dto.orderId;
    this.tableId = dto.tableId;
    // this.discount = dto.discount;
    this.totalDiscountAmount = dto.totalDiscountAmount || 0;
    // this.totalDiscountAmount = dto.totalDiscountAmount;
    this.feeService = dto.feeService || 0;
    this.subTotal = dto.subTotal || 0;
    this.total = dto.total || 0;
    // this.checkInTime = dto.checkInTime ? new Date(dto.checkInTime) : null;
    // this.checkOutTime = dto.checkOutTime ? new Date(dto.checkOutTime) : null;

    this.checkInTime = dto.checkInTime ? dto.checkInTime : null;
    this.checkOutTime = dto.checkOutTime ? dto.checkOutTime : null;
    this.status = dto.status;
    this.orderedItems = (dto.orderedItems || []).map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        amount: item.amount,
    }));
}
