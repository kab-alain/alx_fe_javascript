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

// ======= Event listeners =======
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotes);
importBtn.addEventListener("click", importQuotes);

// ======= Show a random quote =======
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available. Please add one!</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small><strong>Category:</strong> ${randomQuote.category}</small>
  `;
}

// ======= Create Add Quote form dynamically =======
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  document.body.appendChild(formContainer);

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

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  quoteDisplay.innerHTML = `
    <p style="color:green;">New quote added successfully in <strong>${newQuoteCategory}</strong> category!</p>
  `;
}

// ======= Export Quotes as JSON using Blob =======
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

// ======= Import Quotes using FileReader =======
function importQuotes() {
  const file = importFileInput.files[0];
  if (!file) {
    alert("Please select a file to import!");
    return;
  }

  const reader = new FileReader(); // ✅ FileReader

  reader.onload = function (e) {   // ✅ onload
    try {
      const importedQuotes = JSON.parse(e.target.result); // JSON from file

      if (!Array.isArray(importedQuotes)) throw "Invalid format";

      importedQuotes.forEach(q => {
        if (typeof q.text !== "string" || typeof q.category !== "string") {
          throw "Invalid quote structure";
        }
      });

      // Merge imported quotes
      quotes = quotes.concat(importedQuotes);

      // Save to localStorage
      localStorage.setItem("quotes", JSON.stringify(quotes));

      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (err) {
      alert("Failed to import quotes: " + err);
    }
  };

  reader.readAsText(file); // ✅ readAsText
}

// ======= Initialize =======
createAddQuoteForm();
showRandomQuote();
