export function SummaryTransaction(dto){
    this.totalRevenue = dto.totalRevenue;
    this.totalExpense = dto.totalExpense;
    this.totalDiscount = dto.totalDiscount;
    this.transactions = (dto.transactions || []).map(item => ({
        transactionId: item.transactionId,
        orderId: item.orderId,
        description: item.description,
        amount: item.amount,
        discount: item.discount,
        transactionTime:item.transactionTime
    }));
}

// Detail items of the a order
export function DetailItem(dto){
    this.itemId = dto.itemId;
    // this.orderId = dto.orderId;
    this.productName = dto.productName;
    this.quantity = dto.quantity;
    this.price = dto.price;
    this.amount = dto.amount;
}


// Detail items of the a order
export function Product(dto){
      this.productId = dto.productId;
      this.productName = dto.productName;
      this.name = dto.productName;
      this.description = dto.description || 'Chưa có mô tả';
      this.price = dto.price;
      this.categoryId = dto.categoryId;
      this.status = dto.status || '';
      this.categoryName = dto.categoryName;
}

// Detail items of the a order
export function Inventory(dto){
      this.id = dto.id;
      this.name = dto.name;
      this.type = dto.type;
}