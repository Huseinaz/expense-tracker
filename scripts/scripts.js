axios
  .get("https://dull-pink-sockeye-tie.cyclic.app/students/available")
  .then(function (response) {
    var currencies = response.data;
    var currencySelect = document.getElementById("currencyAdd");
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

function openPopup() {
  document.getElementById("popupForm").style.display = "block";
}

function closePopup() {
  document.getElementById("popupForm").style.display = "none";
}

function add(transactionData) {
  var newRow = document.createElement("tr");

  Object.values(transactionData).forEach((value) => {
    var cell = document.createElement("td");
    cell.textContent = value;
    newRow.appendChild(cell);
  });

  var actionsCell = document.createElement("td");
  var editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("button", "edit-button");
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("button", "delete-button");

  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);

  newRow.appendChild(actionsCell);

  var table = document.querySelector("table");
  table.appendChild(newRow);

  localStorage.setItem("tableHtml", table.outerHTML);

  document.getElementById("expenseForm").reset();

  closePopup();
  calculateTotal();
}

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

function populateTableFromStorage() {
  var tableHtml = localStorage.getItem("tableHtml");
  if (tableHtml) {
    var table = document.querySelector("table");
    table.outerHTML = tableHtml;
  }
}

function deleteRow(row) {
  row.remove();
  localStorage.setItem("tableHtml", document.querySelector("table").outerHTML);
  calculateTotal();
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
    var row = event.target.parentNode.parentNode;
    deleteRow(row);
  }
});

document.getElementById("typeFilter").addEventListener("change", filterData);
document
  .getElementById("currencyFilter")
  .addEventListener("change", filterData);
document.getElementById("fromAmount").addEventListener("input", filterData);
document.getElementById("toAmount").addEventListener("input", filterData);

function filterData() {
  var typeFilter = document.getElementById("typeFilter").value.toLowerCase();
  var currencyFilter = document
    .getElementById("currencyFilter")
    .value.toUpperCase();
  var fromAmountFilter = parseFloat(
    document.getElementById("fromAmount").value
  );
  var toAmountFilter = parseFloat(document.getElementById("toAmount").value);

  var table = document.querySelector("table");
  var rows = table.querySelectorAll("tr");

  rows.forEach(function (row) {
    var typeCell = row.querySelector("td:nth-child(1)");
    var nameCell = row.querySelector("td:nth-child(2)");
    var amountCell = row.querySelector("td:nth-child(3)");
    var currencyCell = row.querySelector("td:nth-child(4)");

    if (typeCell && nameCell && amountCell && currencyCell) {
      var type = typeCell.textContent.toLowerCase();
      var currency = currencyCell.textContent.toUpperCase();
      var amount = parseFloat(amountCell.textContent);

      if (
        (!typeFilter || type === typeFilter) &&
        (!currencyFilter || currency === currencyFilter) &&
        (isNaN(fromAmountFilter) || amount >= fromAmountFilter) &&
        (isNaN(toAmountFilter) || amount <= toAmountFilter)
      ) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });
}

function calculateTotal() {
  var total = 0;
  var table = document.querySelector("table");
  var rows = table.querySelectorAll("tr");

  rows.forEach(function (row) {
    var typeCell = row.querySelector("td:nth-child(1)");
    var currencyCell = row.querySelector("td:nth-child(4)");
    var amountCell = row.querySelector("td:nth-child(3)");

    if (typeCell && currencyCell && amountCell) {
      var rowData = {
        type: typeCell.textContent.trim().toLowerCase(),
        currency: currencyCell.textContent.trim().toUpperCase(),
        amount: parseFloat(amountCell.textContent.trim()),
      };

      if (rowData.type === "incomes") {
        if (rowData.currency === "USD") {
          total += rowData.amount;
          document.getElementById("output").textContent =
            "Total: " + total.toFixed(2) + " USD";
        } else {
          axios
            .post("https://dull-pink-sockeye-tie.cyclic.app/students/convert", {
              from: rowData.currency,
              to: "USD",
              amount: rowData.amount,
            })
            .then(function (response) {
              total += response.data;
              document.getElementById("output").textContent =
                "Total: " + total.toFixed(2) + " USD";
            })
            .catch(function (error) {
              console.error("Error exchanging currency:", error);
            });
        }
      }
      if (rowData.type === "expenses") {
        if (rowData.currency === "USD") {
          total -= rowData.amount;
          document.getElementById("output").textContent =
            "Total: " + total.toFixed(2) + " USD";
        } else {
          axios
            .post("https://dull-pink-sockeye-tie.cyclic.app/students/convert", {
              from: rowData.currency,
              to: "USD",
              amount: rowData.amount,
            })
            .then(function (response) {
              total -= response.data;
              document.getElementById("output").textContent =
                "Total: " + total.toFixed(2) + " USD";
            })
            .catch(function (error) {
              console.error("Error exchanging currency:", error);
            });
        }
      }
    }
  });
}

function openPopupWithRowData(row) {
  var cells = row.querySelectorAll("td");
  var entryType = cells[0].textContent.trim().toLowerCase();
  var name = cells[1].textContent.trim();
  var amount = cells[2].textContent.trim();
  var currency = cells[3].textContent.trim().toUpperCase();

  document.getElementById("entryType").value = entryType;
  document.getElementById("name").value = name;
  document.getElementById("amount").value = amount;
  document.getElementById("currencyAdd").value = currency;

  openPopup();
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-button")) {
    var row = event.target.parentNode.parentNode;
    openPopupWithRowData(row);
    deleteRow(row);
  }
});

window.onload = function () {
  populateTableFromStorage();
  calculateTotal();
};
