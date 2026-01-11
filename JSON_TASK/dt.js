var nameInput = document.getElementById("name");
var orderInput = document.getElementById("order");
var productInput = document.getElementById("product");
var StatusBtn = document.getElementById("status");
var maxInput = document.getElementById("max");
console.log("max", maxInput);

var minInput = document.getElementById("min");
var SearchBtn = document.getElementById("search");
var clearBtn = document.getElementById("clear");

var nameFilter = "";
var orderFilter = "";
var statusFilter = "";
var productFilter = "";
var minFilter;
var maxFilter;

const table = new DataTable("#example", {
  ajax: {
    url: "./data.json",
    dataSrc: function (json) {
      let filteredData = json.data;

      if (nameFilter) {
        filteredData = filteredData.filter((item) =>
          item.customer.firstname
            .toLowerCase()
            .includes(nameFilter.toLowerCase())
        );
      }
      if (productFilter) {
        filteredData = filteredData.filter((item) =>
          item.carts.map((items) => items.product_name.includes(productFilter))
        );
      }

      if (orderFilter) {
        filteredData = filteredData.filter((item) =>
          item.order_number
            .toString()
            .toLowerCase()
            .includes(orderFilter.toLowerCase())
        );
      }

      if (maxFilter || minFilter) {
        filteredData = filteredData.filter(
          (item) =>
            minFilter <= parseFloat(item.total) &&
            parseFloat(item.total) <= maxFilter
        );
        console.log("filter", filteredData);
      }
      if (statusFilter === "All") {
        return filteredData;
      }

      if (statusFilter) {
        filteredData = filteredData.filter((item) =>
          item.status.toLowerCase().includes(statusFilter.toLowerCase())
        );
      }
      return filteredData;
    },
  },
  pageLength: 10,
  lengthChange: false,
  columns: [
    {
      className: "dt-control",
      orderable: false,
      data: null,
      defaultContent: "",
    },
    {
      render: function (data, type, row, meta) {
        return meta.settings._iDisplayStart + meta.row + 1;
      },
    },

    { data: "customer.firstname" },

    { data: "customer.lastname" },
    { data: "order_number" },
    { data: "total" },
    { data: "status" },
    { data: "payment_status" },
    { data: "source" },
    { data: "customer.customer_code" },
    { data: "customer.mobile" },
  ],
  order: [[1, "asc"]],
});

nameInput.addEventListener("keyup", function () {
  nameFilter = this.value;
  table.ajax.reload();
});

orderInput.addEventListener("keyup", function () {
  orderFilter = this.value;
  table.ajax.reload();
});

productInput.addEventListener("keyup", function () {
  productFilter = this.value;
  table.ajax.reload();
});

SearchBtn.addEventListener("click", () => {
  minFilter = minInput.value;
  console.log("min", minFilter);

  maxFilter = maxInput.value;
  console.log("max", maxFilter);
  table.ajax.reload();
});

clearBtn.addEventListener("click", () => {
  console.log("clear");
  nameInput.value = "";
  orderInput.value = "";
  productInput.value = "";
  minInput.value = "";
  maxInput.value = "";
});
StatusBtn.addEventListener("click", () => {
  console.log("status", StatusBtn.value);
  statusFilter = StatusBtn.value;
  table.ajax.reload();
});

function format(d) {
  console.log("d", d);

  let loop = d.carts
    .map((item, index) => {
      return `
     
<div class="w-1/4 flex rounded overflow-hidden shadow-lg bg-white m-4"> 
      <img class="w-1/2 h-48 object-cover" src="${item.product_image}" alt="${item.product_name}"> 
      <div class="px-3 py-2"> 
        <div class="font-semibold text-md mb-2">${item.product_name}</div> 
        <p class="text-gray-700 text-base"> Price: $${item.product_price} </p> 
        <p class="text-gray-500 text-sm mt-1"> quantity: ${item.product_quantity} </p> 
      </div> 
    </div>
       
    
    `;
    })
    .join("");
  return `<div class="w-full flex ">${loop}</div>`;
}
table.on("click", "tbody td.dt-control", function (e) {
  let tr = e.target.closest("tr");
  let row = table.row(tr);

  if (row.child.isShown()) {
    row.child.hide();
  } else {
    row.child(format(row.data())).show();
  }
});
