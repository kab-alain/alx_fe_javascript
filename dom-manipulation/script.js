// ======= Load quotes from localStorage or use default =======
let quotes = [];

if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
} else {
  quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
    { text: "The purpose of our lives is to be happy.", category: "Life" },
    { text: "Stay hungry, stay foolish.", category: "Wisdom" }
  ];
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ======= Select DOM elements =======
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportQuotesBtn");
const importBtn = document.getElementById("importQuotesBtn");
const importFileInput = document.getElementById("importQuotesFile");
const categoryFilter = document.getElementById("categoryFilter");

// ======= Event listeners =======
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotes);
importBtn.addEventListener("click", importQuotes);
categoryFilter.addEventListener("change", filterQuotes);

// ======= Initialize =======
createAddQuoteForm();
populateCategories();
restoreFilter();
showRandomQuote();

// ======= Show random quote (respecting current filter) =======
function showRandomQuote() {
  let filteredQuotes = getFilteredQuotes();

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available for this category.</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small><strong>Category:</strong> ${randomQuote.category}</small>
  `;
}

// ======= Filter quotes by selected category =======
function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "all") return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

// ======= Update displayed quote when filter changes =======
function filterQuotes() {
  // Save selected filter to localStorage
  localStorage.setItem("lastFilter", categoryFilter.value);
  showRandomQuote();
}

// ======= Populate category dropdown dynamically =======
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))]; // unique categories
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`; // reset

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// ======= Restore last selected filter from localStorage =======
function restoreFilter() {
  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

// ======= Create Add Quote form dynamically =======
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

// ======= Add a new quote =======
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both a quote and a category!");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);

  // Save to localStorage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Update category dropdown in real-time
  populateCategories();

  // Show new quote
  quoteDisplay.innerHTML = `<p style="color:green;">New quote added in <strong>${newQuoteCategory}</strong> category!</p>`;
}

// ======= Export Quotes =======
function exportQuotes() {
  if (quotes.length === 0) {
    alert("No quotes to export!");
    return;
  }

  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ======= Import Quotes =======
function importQuotes() {
  const file = importFileInput.files[0];
  if (!file) {
    alert("Please select a file to import!");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) throw "Invalid format";
      importedQuotes.forEach(q => {
        if (typeof q.text !== "string" || typeof q.category !== "string") {
          throw "Invalid quote structure";
        }
      });

      quotes = quotes.concat(importedQuotes);
      localStorage.setItem("quotes", JSON.stringify(quotes));

      // Update categories and filter
      populateCategories();
      restoreFilter();

      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (err) {
      alert("Failed to import quotes: " + err);
    }
  };

  reader.readAsText(file);
}
