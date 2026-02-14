
export default class CartItem {
  constructor(product, quantity = 1) {
    this.id = product.id;
    this.name = product.name;
    this.price = Number(product.price) || 0;
    this.img = product.img;
    this.type = product.type;
    this.quantity = quantity;
  }

  total() {
    return this.price * this.quantity;
  }
}