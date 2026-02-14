import Api from "../services/Api.js";
import Validation from "../models/Validation.js";

const api = new Api();
const validation = new Validation();

const qs = (s) => document.querySelector(s);


const tblBody = qs("#tblProduct");
const searchInput = qs(".input-search");
const loader = qs("#loader");

const modalTitle = qs(".text-heading");
const btnOpenModal = qs('[data-modal-toggle="default-modal"]'); 
const btnHideModal = qs('[data-modal-hide="default-modal"]');
const btnSave = qs("#modal-product-save");


const fId = qs("#modal-product-id");
const fName = qs("#modal-product-name");
const fPrice = qs("#modal-product-price");
const fScreen = qs("#modal-product-screen");
const fBack = qs("#modal-product-backcamera");
const fFront = qs("#modal-product-frontcamera");
const fImg = qs("#modal-product-img");
const fDesc = qs("#modal-product-desc");
const fType = qs("#modal-product-type");


let products = [];
let currentEditingId = null; 


let isOpeningFromEdit = false;


const setLoading = (on) => {
  if (!loader) return;
  loader.style.display = on ? "block" : "none";
};


const openModal = () => btnOpenModal?.click();
const closeModal = () => btnHideModal?.click();

const clearErrors = () => {
  validation.showError("invalidId", "");
  validation.showError("invalidName", "");
  validation.showError("invalidPrice", "");
  validation.showError("invalidScreen", "");
  validation.showError("invalidBackCamera", "");
  validation.showError("invalidFrontCamera", "");
  validation.showError("invalidImg", "");
  validation.showError("invalidDesc", "");
  validation.showError("invalidType", "");
};

const clearModal = () => {
  if (fId) fId.value = "";
  if (fName) fName.value = "";
  if (fPrice) fPrice.value = "";
  if (fScreen) fScreen.value = "";
  if (fBack) fBack.value = "";
  if (fFront) fFront.value = "";
  if (fImg) fImg.value = "";
  if (fDesc) fDesc.value = "";
  if (fType) fType.value = "";
};

const fillModal = (p) => {
  if (fId) fId.value = p.id ?? "";
  if (fName) fName.value = p.name ?? "";
  if (fPrice) fPrice.value = p.price ?? "";
  if (fScreen) fScreen.value = p.screen ?? "";
  if (fBack) fBack.value = p.backCamera ?? "";
  if (fFront) fFront.value = p.frontCamera ?? "";
  if (fImg) fImg.value = p.img ?? "";
  if (fDesc) fDesc.value = p.desc ?? "";
  if (fType) fType.value = p.type ?? "";
};

const readModal = () => ({
  name: fName?.value || "",
  price: fPrice?.value || "",
  screen: fScreen?.value || "",
  backCamera: fBack?.value || "",
  frontCamera: fFront?.value || "",
  img: fImg?.value || "",
  desc: fDesc?.value || "",
  type: fType?.value || "",
});


const validateForm = () => {
  clearErrors();
  const data = readModal();
  let ok = true;

  ok &=
    validation.checkEmpty(data.name, "invalidName", "Tên sản phẩm không được bỏ trống");

  ok &=
    validation.checkEmpty(data.price, "invalidPrice", "Giá không được bỏ trống") &&
    validation.checkNumber(data.price, "invalidPrice", "Giá phải là số");

  ok &=
    validation.checkEmpty(data.screen, "invalidScreen", "Màn hình không được bỏ trống");

  ok &=
    validation.checkEmpty(data.backCamera, "invalidBackCamera", "Camera sau không được bỏ trống");

  ok &=
    validation.checkEmpty(data.frontCamera, "invalidFrontCamera", "Camera trước không được bỏ trống");

  ok &=
    validation.checkEmpty(data.img, "invalidImg", "Hình ảnh không được bỏ trống") &&
    validation.checkUrl(data.img, "invalidImg", "URL phải bắt đầu bằng http/https");

  ok &=
    validation.checkEmpty(data.desc, "invalidDesc", "Mô tả không được bỏ trống");

  ok &=
    validation.checkEmpty(data.type, "invalidType", "Loại máy không được bỏ trống") &&
    validation.checkType(data.type, "invalidType", "Chỉ được iphone hoặc samsung");

  return Boolean(ok);
};


const renderTable = (data) => {
  if (!tblBody) return;

  let html = "";
  data.forEach((p, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${p.name || ""}</td>
        <td>${p.price || ""}</td>
        <td>${p.screen || ""}</td>
        <td>${p.backCamera || ""}</td>
        <td>${p.frontCamera || ""}</td>
        <td><img src="${p.img || ""}" width="50" height="50" style="object-fit:cover;border-radius:6px"/></td>
        <td>${p.desc || ""}</td>
        <td>${p.type || ""}</td>
        <td>
          <button class="btn-edit" data-id="${p.id}">Sửa</button>
          <button class="btn-delete" data-id="${p.id}">Xóa</button>
        </td>
      </tr>
    `;
  });

  tblBody.innerHTML = html;
};

const loadProducts = () => {
  setLoading(true);
  api.fetchProducts()
    .then((res) => {
      products = res.data || [];
      renderTable(products);
    })
    .catch((err) => console.error("fetchProducts error:", err))
    .finally(() => setLoading(false));
};


const startAdd = () => {
  currentEditingId = null;
  clearErrors();
  clearModal();

  if (modalTitle) modalTitle.innerText = "Thêm Sản phẩm";
  if (fId) fId.readOnly = true; // mockapi tự tạo id
};

const startEdit = (id) => {
  currentEditingId = id;
  clearErrors();

  if (modalTitle) modalTitle.innerText = "Cập nhật Sản phẩm";

  setLoading(true);
  api.fetchProductById(id)
    .then((res) => {
      fillModal(res.data);
      if (fId) fId.readOnly = true;

     
      isOpeningFromEdit = true;
      openModal();
      setTimeout(() => { isOpeningFromEdit = false; }, 0);
    })
    .catch((err) => console.error("fetchProductById error:", err))
    .finally(() => setLoading(false));
};

const handleDelete = (id) => {
  if (!confirm("Xác nhận xóa sản phẩm?")) return;
  setLoading(true);
  api.deleteProduct(id)
    .then(loadProducts)
    .catch((err) => console.error("deleteProduct error:", err))
    .finally(() => setLoading(false));
};

const handleSave = () => {
  if (!validateForm()) return;

  const data = readModal();
  const done = () => {
    closeModal();
    loadProducts();
  };

  setLoading(true);

  if (currentEditingId) {
    api.updateProduct(currentEditingId, data)
      .then(done)
      .catch((err) => console.error("updateProduct error:", err))
      .finally(() => setLoading(false));
  } else {
    api.createProduct(data)
      .then(done)
      .catch((err) => console.error("createProduct error:", err))
      .finally(() => setLoading(false));
  }
};


btnOpenModal?.addEventListener("click", () => {
  if (isOpeningFromEdit) return;
  startAdd();
});

btnSave?.addEventListener("click", handleSave);

tblBody?.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".btn-edit");
  const delBtn = e.target.closest(".btn-delete");

  if (editBtn) return startEdit(editBtn.dataset.id);
  if (delBtn) return handleDelete(delBtn.dataset.id);
});

searchInput?.addEventListener("input", (e) => {
  const keyword = e.target.value.trim().toLowerCase();
  if (!keyword) return renderTable(products);

  const filtered = products.filter((p) =>
    String(p.name || "").toLowerCase().includes(keyword)
  );
  renderTable(filtered);
});


loadProducts();
