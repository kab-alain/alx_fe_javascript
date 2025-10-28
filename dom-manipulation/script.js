// Array to store quotes with category
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "The purpose of our lives is to be happy.", category: "Life" },
  { text: "Stay hungry, stay foolish.", category: "Wisdom" }
];

// Select key DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ✅ Event listener for “Show New Quote” button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Please add one!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;
}

// ✅ Function to create the “Add Quote” form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote); // ✅ event listener for quote addition

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer); // adds the form dynamically to the DOM
}

// ✅ Function to add a new quote and update DOM
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both a quote and a category!");
    return;
  }

  // Add new quote to array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Update DOM to confirm addition
  quoteDisplay.textContent = `New quote added in "${newQuoteCategory}" category!`;
}

// ✅ Initialize page
createAddQuoteForm(); // dynamically builds the form on page load
