export default class Validation {
  showError(spanId, message) {
    const el = document.getElementById(spanId);
    if (el) el.innerText = message || "";
  }

  checkEmpty(value, spanId, message) {
    const ok = String(value || "").trim() !== "";
    this.showError(spanId, ok ? "" : message);
    return ok;
  }

  checkNumber(value, spanId, message) {
    const ok = value !== "" && !Number.isNaN(Number(value));
    this.showError(spanId, ok ? "" : message);
    return ok;
  }

  checkType(value, spanId, message) {
    const t = String(value || "").trim().toLowerCase();
    const ok = t === "iphone" || t === "samsung";
    this.showError(spanId, ok ? "" : message);
    return ok;
  }

  checkUrl(value, spanId, message) {
    const v = String(value || "").trim();
    // check đơn giản: bắt đầu http
    const ok = v.startsWith("http://") || v.startsWith("https://");
    this.showError(spanId, ok ? "" : message);
    return ok;
  }
}