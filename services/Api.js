
export default class Api {
  constructor() {
    this.baseUrl = "https://696366002d146d9f58d35d2b.mockapi.io/api/MobileAPI";
  }

  
  fetchProducts() {
    return axios({ url: this.baseUrl, method: "GET" });
  }


  fetchProductById(id) {
    return axios({ url: `${this.baseUrl}/${id}`, method: "GET" });
  }

  createProduct(product) {
    return axios({ url: this.baseUrl, method: "POST", data: product });
  }

  updateProduct(id, product) {
    return axios({ url: `${this.baseUrl}/${id}`, method: "PUT", data: product });
  }

  deleteProduct(id) {
    return axios({ url: `${this.baseUrl}/${id}`, method: "DELETE" });
  }
}