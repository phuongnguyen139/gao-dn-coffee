export class MenuItem {
  constructor(dto, index = 0) {
    this.key = dto.productId;
    this.productId = dto.productId;
    this.productName = dto.productName;
    this.description = dto.description;
    this.price = dto.price;
    this.categoryId = dto.categoryId;
    this.quantity = 1;
    this.index = index + 1;

    // Thêm thông tin nguyên liệu và hướng dẫn
    // this.ingredients = dto.ingredients || 'Sữa đặc, cà phê, test';      // Có thể là chuỗi hoặc mảng
    this.instructions = dto.instructions || 'Trộn tất cả lại và đem ra, sạch sẽ gọn gàng';    // Có thể là chuỗi

    this.recipes = (dto.recipes || []).map(item => ({
      // productId: item.productId,
      // productName: item.productName,
      // quantity: item.quantity,
      // price: item.price,
      // amount: item.amount,
      ingredients: item.ingredientName,
      quantity:item.quantity,
      unit:item.unit
    }));
  }
}
