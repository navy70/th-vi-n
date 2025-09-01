/* ===== User & Auth ===== */
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;

function showRegister() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("registerPage").style.display = "block";
}

function showLogin() {
  document.getElementById("loginPage").style.display = "block";
  document.getElementById("registerPage").style.display = "none";
}

function register() {
  const user = document.getElementById("regUser").value;
  const pass = document.getElementById("regPass").value;
  const email = document.getElementById("regEmail").value;
  const phone = document.getElementById("regPhone").value;

  if (!user || !pass) {
    alert("Vui lòng nhập đầy đủ!");
    return;
  }
  if (users.find((u) => u.user === user)) {
    alert("Tên đăng nhập đã tồn tại!");
    return;
  }

  users.push({ user, pass, email, phone });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Đăng ký thành công!");
  showLogin();
}

function login() {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;

  const found = users.find((u) => u.user === user && u.pass === pass);
  if (found) {
    currentUser = found;
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("libraryPage").style.display = "block";
    document.getElementById("welcomeUser").innerText = `Xin chào, ${user}`;
    renderBooks();
  } else {
    alert("Sai tài khoản hoặc mật khẩu!");
  }
}

function logout() {
  currentUser = null;
  document.getElementById("libraryPage").style.display = "none";
  showLogin();
}

/* ===== Books Data ===== */
let books = JSON.parse(localStorage.getItem("books")) || [];

/* ===== Navigation giữa các page ===== */
function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
  document.getElementById(id).style.display = "block";
}

/* ===== Thêm sách ===== */
function toggleForm() {
  const f = document.getElementById("formBox");
  f.style.display = f.style.display === "none" ? "block" : "none";
}

function resetForm() {
  document.querySelectorAll("#formBox input").forEach((el) => (el.value = ""));
}

function saveBook() {
  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const year = document.getElementById("bookYear").value;
  const number = document.getElementById("bookNumber").value;
  const price = document.getElementById("bookPriceInput").value;
  const active = document.getElementById("bookActive").checked;
  const category = document.getElementById("bookCategory").value;
  const imageFile = document.getElementById("bookImage").files[0];

  if (!title || !author) {
    alert("Vui lòng nhập tên và tác giả!");
    return;
  }

  let imageUrl = "";
  if (imageFile) {
    imageUrl = URL.createObjectURL(imageFile);
  }

  books.push({
    title,
    author,
    year,
    number,
    price,
    active,
    category,
    image: imageUrl,
  });
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
  resetForm();
  toggleForm();
}

/* ===== Hiển thị bảng sách ===== */
function renderBooks() {
  const tbody = document.querySelector("#bookTable tbody");
  tbody.innerHTML = "";

  books.forEach((b, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${b.image ? `<img src="${b.image}">` : ""}</td>
      <td>${b.title}</td>
      <td>${b.author}</td>
      <td>${b.year}</td>
      <td>${b.category}</td>
      <td>${b.number}</td>
     <td>${b.price ? Number(b.price).toLocaleString() + " đ" : "0 đ"}</td>
      <td>${b.active ? "Active" : "Inactive"}</td>
      <td><button onclick="deleteBook(${i})">Xóa</button></td>
    `;
    tbody.appendChild(row);
  });
}

function deleteBook(i) {
  books.splice(i, 1);
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
}

/* ===== Tìm sách ===== */
function searchBooks() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const tbody = document.querySelector("#bookTable tbody");
  tbody.innerHTML = "";

  books
    .filter(
      (b) =>
        b.title.toLowerCase().includes(keyword) ||
        b.author.toLowerCase().includes(keyword)
    )
    .forEach((b, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${b.image ? `<img src="${b.image}">` : ""}</td>
          <td>${b.title}</td>
          <td>${b.author}</td>
          <td>${b.year}</td>
          <td>${b.category}</td>
          <td>${b.number}</td>
          <td>${Number(b.price).toLocaleString()} đ</td>
          <td>${b.active ? "Active" : "Inactive"}</td>
          <td><button onclick="deleteBook(${i})">Xóa</button></td>
        `;
      tbody.appendChild(row);
    });
}

/* ===== Mượn sách ===== */
let borrowed = JSON.parse(localStorage.getItem("borrowed")) || [];

function borrowBook() {
  const name = document.getElementById("borrowName").value;
  const phone = document.getElementById("borrowPhone").value;
  const email = document.getElementById("borrowEmail").value;
  const date = document.getElementById("borrowDate").value;
  const title = document.getElementById("borrowTitle").value;

  borrowed.push({ name, phone, email, date, title });
  localStorage.setItem("borrowed", JSON.stringify(borrowed));
  renderBorrowed();
}

function renderBorrowed() {
  const tbody = document.querySelector("#borrowTable tbody");
  tbody.innerHTML = "";
  borrowed.forEach((b, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${b.name}</td>
      <td>${b.phone}</td>
      <td>${b.email}</td>
      <td>${b.date}</td>
      <td>${b.title}</td>
      <td><button onclick="returnBook(${i})">Trả</button></td>
    `;
    tbody.appendChild(row);
  });
}

function returnBook(i) {
  borrowed.splice(i, 1);
  localStorage.setItem("borrowed", JSON.stringify(borrowed));
  renderBorrowed();
}

/* ===== Mua sách ===== */
let purchased = JSON.parse(localStorage.getItem("purchased")) || [];

function buyBook() {
  const name = document.getElementById("buyName").value;
  const phone = document.getElementById("buyPhone").value;
  const email = document.getElementById("buyEmail").value;
  const address = document.getElementById("buyAddress").value;
  const title = document.getElementById("buyTitle").value;

  const found = books.find(
    (b) => b.title.toLowerCase() === title.toLowerCase()
  );
  if (!found) {
    alert("Không tìm thấy sách!");
    return;
  }

  const price = found.price;
  purchased.push({ name, phone, email, address, title, price });
  localStorage.setItem("purchased", JSON.stringify(purchased));
  renderPurchased();

  // tạo QR giả
  document.getElementById("qrImage").src = "background/QR.jpg";
  document.getElementById("qrOverlay").style.display = "flex";
}

function renderPurchased() {
  const tbody = document.querySelector("#buyTable tbody");
  tbody.innerHTML = "";
  purchased.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.phone}</td>
      <td>${p.email}</td>
      <td>${p.address}</td>
      <td>${p.title}</td>
      <td>${Number(p.price).toLocaleString()} đ</td>
      <td><button onclick="deletePurchase(${i})">Xóa</button></td>
    `;
    tbody.appendChild(row);
  });
}

function deletePurchase(i) {
  purchased.splice(i, 1);
  localStorage.setItem("purchased", JSON.stringify(purchased));
  renderPurchased();
}

function closeQR() {
  document.getElementById("qrOverlay").style.display = "none";
}

/* ===== Init ===== */
window.onload = function () {
  renderBooks();
  renderBorrowed();
  renderPurchased();
};
