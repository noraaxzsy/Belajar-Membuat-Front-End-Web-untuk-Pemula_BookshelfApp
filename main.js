const books = [];
const STORAGE_KEY = "bookshelf_app";

//Cek kesediaan localStrorage
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

//Fungsi untuk menambahkan data buku ke localStrorage
function saveBooksToStorage() {
  if (isStorageExist()) {
    const parsedData = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsedData);
  }
}

//Fungsi untuk membuat buku dari localStorage
function loadBooksFromStorage() {
  if (isStorageExist()) {
    const savedBooks = localStorage.getItem(STORAGE_KEY);

    let bookData = JSON.parse(savedBooks);
    if (bookData !== null) {
      for (const book of bookData) {
        books.push(book);
      }
    }
  }
}

//Fungsi Menampilkan Buku
function displayBooks(filterBook = null) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  let booksToShow = filterBook || books;
  booksToShow.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("bookItem");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div class="action_list">
    <button data-testid="bookItemIsCompleteButton" id="buttonCard1" class="buttonCard" onclick="toggleBookStatus(${book.id})">
          <i class="fa-solid ${book.isComplete ? "fa-rotate-left" : "fa-circle-check"}"></i>
          ${book.isComplete ? "Belum selesai" : "Selesai dibaca"}
        </button>
    <button data-testid="bookItemDeleteButton" id="buttonCard2" class="buttonCard" onclick="deleteBook(${book.id})">
          <i class="fa-solid fa-trash"></i> Hapus Buku
    </button>
    <button data-testid="bookItemEditButton" id="buttonCard3" class="buttonCard" onclick="editBook(${book.id})">
          <i class="fa-solid fa-pen-to-square"></i> Edit Buku
    </button>
    </div>
      `;

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

//Fungsi Menambahkan Buku
function addBook(event) {
  event.preventDefault();
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: new Date().getTime(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveBooksToStorage();
  displayBooks();

  document.getElementById("bookForm").reset;
}

//Fungsi Menghapus Buku
function deleteBook(bookId) {
  const bIndex = books.findIndex((book) => book.id === bookId);
  if (bIndex !== -1) {
    books.splice(bIndex, 1);
    saveBooksToStorage();
    displayBooks();
  }
}

//Fungsi Memindahkan Buku Antar Rak
function toggleBookStatus(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage();
    displayBooks();
  }
}

//Fungsi Mengedit Data Buku
let currentEditingBook = null;

function editBook(bookId) {
  currentEditingBook = books.find((book) => book.id === bookId);
  if (currentEditingBook) {
    document.getElementById("editTitle").value = currentEditingBook.title;
    document.getElementById("editAuthor").value = currentEditingBook.author;
    document.getElementById("editYear").value = currentEditingBook.year;
    document.getElementById("editModal").style.display = "block";
  }
}

// Fungsi untuk Menutup Modal
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// Event Listener untuk Form Edit
document.getElementById("editBookForm").addEventListener("submit", function (event) {
  event.preventDefault();

  currentEditingBook.title = document.getElementById("editTitle").value;
  currentEditingBook.author = document.getElementById("editAuthor").value;
  currentEditingBook.year = parseInt(document.getElementById("editYear").value);

  saveBooksToStorage();
  displayBooks();
  closeModal();
});

//Event Listener untuk Load Halaman
document.addEventListener("DOMContentLoaded", function () {
  loadBooksFromStorage();
  displayBooks();
});

document.getElementById("bookForm").addEventListener("submit", addBook);

//Ketika Mencari Buku
document.getElementById("searchBook").addEventListener("submit", function (event) {
  event.preventDefault();
  let search = document.getElementById("searchBookTitle").value.toLowerCase();
  let allBooks = JSON.parse(localStorage.getItem("bookshelf_app")) || [];
  console.log("Data buku dari localStorage:", allBooks);

  if (allBooks.length === 0) {
    return;
  }

  let filterBook = search === "" ? allBooks : allBooks.filter((book) => book.title.toLowerCase().includes(search));
  console.log("Hasil filter:", filterBook);
  displayBooks(filterBook);
});
