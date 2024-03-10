// Axios request to fetch currency data
axios
  .get("https://rich-erin-angler-hem.cyclic.app/students/available")
  .then(function (response) {
    var currencies = response.data;
    var currencySelect = document.getElementById("currency");
    var currencyFilterSelect = document.getElementById("currencyFilter");
    

    currencies.forEach(function (currency) {
      var option1 = document.createElement("option");
      option1.value = currency.code;
      option1.textContent = currency.code;
      currencySelect.appendChild(option1);

      var option2 = document.createElement("option");
      option2.value = currency.code;
      option2.textContent = currency.code;
      currencyFilterSelect.appendChild(option2);
    });
  })
  .catch(function (error) {
    console.error("Error fetching currency data:", error);
  });

// Function to open the popup form
function openPopup() {
  document.getElementById("popupForm").style.display = "block";
}

// Function to close the popup form
function closePopup() {
  document.getElementById("popupForm").style.display = "none";
}

function add(transactionData) {
  // Create a new table row for the added transaction
  var newRow = document.createElement("tr");

  // Create table cells for each data point
  Object.values(transactionData).forEach((value) => {
    var cell = document.createElement("td");
    cell.textContent = value;
    newRow.appendChild(cell);
  });

  // Create action buttons cell
  var actionsCell = document.createElement("td");
  var editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("button", "edit-button");
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("button", "delete-button");

  // Append buttons to actions cell
  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);

  // Append the actions cell to the new row
  newRow.appendChild(actionsCell);

  // Append the new row to the table
  var table = document.querySelector("table");
  table.appendChild(newRow);

  // Save the HTML content of the table to localStorage
  localStorage.setItem("tableHtml", table.outerHTML);

  // Reset the form fields
  document.getElementById('expenseForm').reset();

  // Close the popup after adding the transaction
  closePopup();
}

// Event listener for the form submission
document
  .getElementById("expenseForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const transactionData = {};
    formData.forEach((value, key) => {
      transactionData[key] = value;
    });
    add(transactionData);
  });

// Function to populate the table with data from localStorage
function populateTableFromStorage() {
  var tableHtml = localStorage.getItem("tableHtml");
  if (tableHtml) {
    var table = document.querySelector("table");
    table.outerHTML = tableHtml;
  }
}

// Populate the table when the page loads
window.onload = function () {
  populateTableFromStorage();
};

// Function to delete a row from the table and localStorage
function deleteRow(row) {
  // Remove the row from the table
  row.remove();

  // Save the updated HTML content of the table to localStorage
  localStorage.setItem("tableHtml", document.querySelector("table").outerHTML);
}

// Event listener for the delete button
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
    // Get the parent row of the delete button
    var row = event.target.parentNode.parentNode;

    // Delete the row from the table and localStorage
    deleteRow(row);
  }
});

document.getElementById("type").addEventListener("change", filterData);
document.getElementById("currency").addEventListener("change", filterData);
document.getElementById("fromAmount").addEventListener("input", filterData);
document.getElementById("toAmount").addEventListener("input", filterData);


function filterData() {
    var table = document.querySelector("table");
    var rows = table.querySelectorAll("tr");

    rows.forEach(function(row) {
        var typeCell = row.querySelector("td:nth-child(1)");
        var currencyCell = row.querySelector("td:nth-child(4)");
        var amountCell = row.querySelector("td:nth-child(3)");

        // Retrieve filter values from input fields
        var selectedType = document.getElementById("type").value.toLowerCase();
        var selectedCurrency = document.getElementById("currency").value.toUpperCase();
        var fromAmount = parseFloat(document.getElementById("fromAmount").value);
        var toAmount = parseFloat(document.getElementById("toAmount").value);

        // Check each input field for null value and apply filter accordingly
        if ((!selectedType || typeCell.textContent.toLowerCase() === selectedType) &&
            (!selectedCurrency || currencyCell.textContent.toUpperCase() === selectedCurrency) &&
            (isNaN(fromAmount) || parseFloat(amountCell.textContent) >= fromAmount) &&
            (isNaN(toAmount) || parseFloat(amountCell.textContent) <= toAmount)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
  

