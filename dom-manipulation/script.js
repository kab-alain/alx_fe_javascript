// ======= Load quotes from localStorage or use default =======
let quotes = [];

// Check if quotes exist in localStorage
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
} else {
  // Default quotes
  quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
    { text: "The purpose of our lives is to be happy.", category: "Life" },
    { text: "Stay hungry, stay foolish.", category: "Wisdom" }
  ];
  // Save default quotes to localStorage
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ======= Select DOM elements =======
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ======= Event listener for "Show New Quote" button =======
newQuoteBtn.addEventListener("click", showRandomQuote);

// ======= Function to show a random quote =======
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

// ======= Function to create the "Add Quote" form dynamically =======
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

// ======= Function to add a new quote =======
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both a quote and a category!");
    return;
  }

  // Add new quote to array
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);

  // Save updated quotes array to localStorage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Update DOM with confirmation
  quoteDisplay.innerHTML = `
    <p style="color:green;">New quote added successfully in <strong>${newQuoteCategory}</strong> category!</p>
  `;
}

// ======= Initialize page =======
createAddQuoteForm();
showRandomQuote(); // display a random quote on page load
