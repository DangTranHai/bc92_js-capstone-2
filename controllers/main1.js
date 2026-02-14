import Api from "../services/Api.js";
import CartItem from "../models/CartItem.js";

const api = new Api();

const qs = (s) => document.querySelector(s);

let products = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// ====== RENDER PRODUCTS ======
function renderProducts(list) {
  const container = document.querySelector("#userProducts");
  if (!container) return;

  let html = "";
  list.forEach((p) => {
    const name = p.name || "";
    const type = (p.type === "iphone" || p.type === "samsung") ? p.type : "";
    const desc = (p.desc && !String(p.desc).includes("Invalid faker method")) ? p.desc : "";
    const price = Number(p.price) || 0;

    // img phải là url hợp lệ, không thì dùng ảnh local
    const img =
      (p.img && (p.img.startsWith("http://") || p.img.startsWith("https://")))
        ? p.img
        : "../img/iphone.png";

    html += `
      <div class="cardPhone text-center">
        <img src="${img}" class="mx-auto mb-4" alt="${name}" />
        <h3 class="cardPhone__title">${name}</h3>
        <p class="cardPhone__text">${type}</p>
        ${desc ? `<p class="text-gray-500 text-sm mb-2">${desc}</p>` : ""}
        <p class="price">${price.toLocaleString("vi-VN")}đ</p>
        <button class="btnPhone-shadow btn-add-cart" data-id="${p.id}">
          <i class="fa fa-cart-plus"></i> Mua
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ====== FILTER ======
function applyFilter() {
  const select = qs("#typeFilter");
  if (!select) return renderProducts(products);

  const type = select.value;
  if (type === "all") return renderProducts(products);

  const filtered = products.filter((p) => p.type === type);
  renderProducts(filtered);
}


function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {

  document.getElementById("cartCount").innerText = cart.reduce(
  (sum, item) => sum + item.quantity,
  0
);
  const tbody = qs("#tblCartBody");
  const totalEl = qs("#cartTotal");

  if (!tbody || !totalEl) return;

  let html = "";
  let total = 0;

  cart.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    html += `
      <tr>
        <td>${item.name}</td>
        <td>${item.price.toLocaleString()}đ</td>
        <td>
          <button class="btn-dec" data-id="${item.id}">-</button>
          ${item.quantity}
          <button class="btn-inc" data-id="${item.id}">+</button>
        </td>
        <td>${lineTotal.toLocaleString()}đ</td>
        <td><button class="btn-remove" data-id="${item.id}">X</button></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  totalEl.innerText = total.toLocaleString() + "đ";
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const index = cart.findIndex((c) => c.id === id);

  if (index === -1) {
    cart.push(new CartItem(product, 1));
  } else {
    cart[index].quantity += 1;
  }

  saveCart();
  renderCart();
}

function incQty(id) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.quantity += 1;
  saveCart();
  renderCart();
}

function decQty(id) {
  const index = cart.findIndex((c) => c.id === id);
  if (index === -1) return;

  cart[index].quantity -= 1;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((c) => c.id !== id);
  saveCart();
  renderCart();
}

function checkout() {
  cart = [];
  saveCart();
  renderCart();
}


document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".btn-add-cart");
  if (addBtn) return addToCart(addBtn.dataset.id);

  const incBtn = e.target.closest(".btn-inc");
  if (incBtn) return incQty(incBtn.dataset.id);

  const decBtn = e.target.closest(".btn-dec");
  if (decBtn) return decQty(decBtn.dataset.id);

  const rmBtn = e.target.closest(".btn-remove");
  if (rmBtn) return removeItem(rmBtn.dataset.id);

  const checkoutBtn = e.target.closest("#btnCheckout");
  if (checkoutBtn) return checkout();
});

document.addEventListener("change", (e) => {
  if (e.target.id === "typeFilter") {
    applyFilter();
  }
});


api.fetchProducts()
  .then((res) => {
    products = res.data;
    renderProducts(products);
    renderCart();
  })
  .catch((err) => console.error(err));



const cartToggle = document.getElementById("cartToggle");
const cartDropdown = document.getElementById("cartDropdown");

cartToggle.addEventListener("click", () => {
  cartDropdown.classList.toggle("hidden");
});


document.addEventListener("click", (e) => {
  if (!cartDropdown.contains(e.target) && !cartToggle.contains(e.target)) {
    cartDropdown.classList.add("hidden");
  }
});