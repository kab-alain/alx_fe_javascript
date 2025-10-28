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

// ======= Event listeners =======
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotes);

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

  // ✅ Save to localStorage
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

  // ✅ Create JSON string
  const dataStr = JSON.stringify(quotes, null, 2);

  // ✅ Create a Blob with MIME type application/json
  const blob = new Blob([dataStr], { type: "application/json" });

  // Create a temporary link to download the file
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  // Clean up the object URL
  URL.revokeObjectURL(url);
}

// ======= Initialize =======
createAddQuoteForm();
showRandomQuote();
