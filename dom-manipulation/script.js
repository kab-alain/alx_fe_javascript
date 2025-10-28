// Array to store quotes with categories
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

// ✅ Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available. Please add one!</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Using innerHTML to display formatted quote text
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small><strong>Category:</strong> ${randomQuote.category}</small>
  `;
}

// ✅ Function to create the “Add Quote” form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  // Create the form HTML using innerHTML
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  // Append the form to the document
  document.body.appendChild(formContainer);

  // Attach event listener to the dynamically created button
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

// ✅ Function to add a new quote dynamically and update DOM
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

  // Confirm update using innerHTML
  quoteDisplay.innerHTML = `
    <p style="color:green;">New quote added successfully in <strong>${newQuoteCategory}</strong> category!</p>
  `;
}

// ✅ Initialize the page by creating the form
createAddQuoteForm();
