// ======= Constants =======
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock server API

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

// ======= DOM Elements =======
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportQuotesBtn");
const importBtn = document.getElementById("importQuotesBtn");
const importFileInput = document.getElementById("importQuotesFile");
const categoryFilter = document.getElementById("categoryFilter");
const manualSyncBtn = document.getElementById("manualSyncBtn");

// ======= Event Listeners =======
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotes);
importBtn.addEventListener("click", importQuotes);
categoryFilter.addEventListener("change", filterQuotes);
if (manualSyncBtn) manualSyncBtn.addEventListener("click", syncQuotesWithServer);

// ======= Initialize =======
createAddQuoteForm();
populateCategories();
restoreFilter();
showRandomQuote();

// ======= Show Random Quote (filtered) =======
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

// ======= Filter Quotes =======
function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "all") return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

function filterQuotes() {
  localStorage.setItem("lastFilter", categoryFilter.value);
  showRandomQuote();
}

// ======= Populate Categories =======
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// ======= Restore Last Selected Filter =======
function restoreFilter() {
  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) categoryFilter.value = lastFilter;
}

// ======= Add Quote Form =======
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

// ======= Add New Quote =======
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both a quote and a category!");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategories();
  showRandomQuote();

  // Send new quote to server
  sendQuoteToServer(newQuote);
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
        if (typeof q.text !== "string" || typeof q.category !== "string") throw "Invalid quote structure";
      });

      quotes = quotes.concat(importedQuotes);
      localStorage.setItem("quotes", JSON.stringify(quotes));

      populateCategories();
      restoreFilter();
      showRandomQuote();

      showNotification("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import quotes: " + err);
    }
  };

  reader.readAsText(file);
}

// ======= Fetch Quotes From Server =======
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate server quotes format
    const serverQuotes = serverData.slice(0, 10).map(post => ({
      text: post.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (err) {
    console.error("Failed to fetch quotes from server:", err);
    return [];
  }
}

// ======= Sync quotes with server =======
async function syncQuotesWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  let mergedQuotes = [...quotes];

  serverQuotes.forEach(serverQuote => {
    const exists = mergedQuotes.some(q => q.text === serverQuote.text && q.category === serverQuote.category);
    if (!exists) mergedQuotes.push(serverQuote);
  });

  if (mergedQuotes.length > quotes.length) {
    quotes = mergedQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    showNotification("New quotes synced from server!");
    showRandomQuote();
  }
}

// ======= Send a new quote to server (POST) =======
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    if (!response.ok) throw new Error("Failed to send quote to server");

    const data = await response.json();
    console.log("Quote sent to server successfully:", data);
    showNotification("Quote synced to server!");
  } catch (err) {
    console.error("Error sending quote to server:", err);
  }
}

// ======= Periodic Server Sync =======
setInterval(syncQuotesWithServer, 60000); // every 60 seconds

// ======= Notification =======
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.padding = "15px";
  notification.style.backgroundColor = "#1a73e8";
  notification.style.color = "#fff";
  notification.style.borderRadius = "8px";
  notification.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  notification.style.zIndex = "1000";
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}
