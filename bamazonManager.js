var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table")
var productItem = 0;
var productQuantity = 0;
var products = [];
var lowProducts = [];
var selectedItem = [];

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "toor",
  database: "bamazon"
});

connection.connect((err) => {
  if (err) throw err;
  start();
});

start = () => {
  inquirer.prompt([{
    type: "list",
    name: "action",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
    message: "Which of these would you like to execute?"
  }]).then((user) => {
    switch (user.action) {
      case "View Products for Sale":
        viewProducts()
        break;
      case "View Low Inventory":
        lowInventory()
        break;
      case "Add to Inventory":
        addInventory()
        break;
      case "Add New Product":
        addProduct()
        break;
    }
  })
}

viewProducts = () => {
  connection.query("SELECT * FROM my_products",(err, res) => {
    if (err) throw err;
    products = res;
    console.log("-------------------------------------------------------------");
    console.log("           ***** Detailing Store Inventory *****             ");
    console.log("-------------------------------------------------------------");
    console.table(products)
    console.log("-------------------------------------------------------------")
    start();
  });

}

lowInventory = () => {
  connection.query("SELECT * FROM my_products",(err, res) => {
    if (err) throw err;
    products = res;
    for (var i = 0; i < products.length; i++) {
      if (products[i].stock_quantity < 5) {
        lowProducts.push(products[i])
      }
    }
    console.log("-------------------------------------------------------------");
    console.log("                 ***** Low Inventory *****                   ");
    console.log("-------------------------------------------------------------");
    console.table(lowProducts)
    console.log("-------------------------------------------------------------");
    start();
  })
}

addInventory = () => {
  connection.query("SELECT * FROM my_products",(err, res) => {
    if (err) throw err;
    products = res;
    console.log("-------------------------------------------------------------");
    console.log("                 ***** Add Inventory *****                   ");
    console.log("-------------------------------------------------------------");
    console.table(products);
    console.log("-------------------------------------------------------------");
    inquirer.prompt([{
        type: "input",
        name: "item",
        message: "Which item would you like to add inventory to?(Provide item id)",
        validate: item => {
          if (isNaN(item) || item < 1 || item > products.length) {
            return false || "Please enter a valid ItemId";
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        name: "quantity",
        message: "What quantity would you like to add?",
        validate: quantity => {
          var reg = /^([1-9]+)/;
          return reg.test(quantity) || "Please enter a whole number greater than 1";
        },
      }
    ]).then((user) => {
      productItem = parseInt(user.item);
      productQuantity = parseInt(user.quantity);
      for (var i = 0; i < products.length; i++) {
        if (products[i].item_id === productItem) {
          selectedItem = products[i];
        }
      }
      selectedItem.stock_quantity += productQuantity;
      connection.query(
        "UPDATE my_products  SET ? WHERE ?", [{
            stock_quantity: selectedItem.stock_quantity
          },
          {
            item_id: productItem
          }
        ],
        (err, res) => {
          if (err) throw err;
          console.log("--------------------------------\n" +
            "* Added Inventory Successfully * \n" +
            "--------------------------------")
          start();
        })
    })
  });
}

addProduct = () => {
  inquirer.prompt([{
      type: "input",
      name: "newProduct",
      message: "What's the name of the product?"
    },
    {
      type: "input",
      name: "department",
      message: "Which department is this product located in?",
    },
    {
      type: "input",
      name: "price",
      message: "What would you like to set the price at?",
      validate: price => {
        var reg = /^([1-9]+)/;
        return reg.test(price) || "Please enter a whole number greater than 1";
      }
    },
    {
      type: "input",
      name: "quantity",
      message: "What quantity would you like to add?",
      validate: quantity => {
        var reg = /^([1-9]+)/;
        return reg.test(quantity) || "Please enter a whole number greater than 1";
      }
    }
  ]).then((user) => {
    connection.query(
      "INSERT INTO my_products SET ?", {
        product_name: user.newProduct,

        department_name: user.department,

        price: user.price,

        stock_quantity: user.quantity
      },
      (err, res) => {
        if (err) throw err;
        console.log("------------------------------\n" +
          "* Product Added Successfully * \n" +
          "------------------------------")
        start();
      })
  })
}

