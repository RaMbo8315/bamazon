var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table")
var saveItem = 0;
var saveOrder = 0;
var store = [];
var fullStore = [];
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
  displayStore();
});

displayStore = () => {
  connection.query("SELECT * FROM my_products", (err, res) => {
    if (err) throw err;
    res.map((item) => {
      delete item.department_name;
      delete item.stock_quantity;
    })
    console.log("----------------------------");
    console.log("-* Detailing Supply Store *-");
    console.log("----------------------------");
    console.table(res)
    console.log("----------------------------")
    item()
  })
};

item = () => {
  connection.query("SELECT * FROM my_products", (err, res) => {
    if (err) throw err;
    fullStore = res
  })
  inquirer.prompt([{
    type: "input",
    name: "item",
    message: "Which item would you like to order?(Provide item id)",
    validate: item => {
      if (isNaN(item) || item < 1 || item > fullStore.length) {
        return false || "Please enter a valid ItemId";
      } else {
        return true;
      }
    }
  }, {
    type: "input",
    name: "order",
    message: "How many would you like to order?",
    validate: order => {
      var reg = /^([1-9]+)/;
      return reg.test(order) || "Please enter a whole number greater than 1";
    },
  }]).then((user) => {
    saveItem = parseInt(user.item)
    saveOrder = parseInt(user.order);
    retrieveOrder();
  })
}

retrieveOrder = () => {
  for (var i = 0; i < fullStore.length; i++) {
    if (fullStore[i].item_id === saveItem) {
      selectedItem = fullStore[i];
    }
  }
  if (saveOrder <= selectedItem.stock_quantity) {
    selectedItem.stock_quantity -= saveOrder;
    connection.query(
      "UPDATE my_products  SET ? WHERE ?", [{
          stock_quantity: selectedItem.stock_quantity
        },
        {
          item_id: selectedItem.item_id
        }
      ],
      (err, res) => {
        if (err) throw err;
      });
    if (saveOrder > 1) {
      console.log("--------------------------------------------------------------");
      console.log("   Your Order Summary                          ");
      console.log(`   You've ordered ${saveOrder} units of ${selectedItem.product_name} at $${selectedItem.price} ea`);
      console.log(`   Total Charge of $${saveOrder * selectedItem.price}`);
      console.log("--------------------------------------------------------------");
    } else {
      console.log("--------------------------------------------------------------");
      console.log("   Your Order Summary                          ");
      console.log(`   You've ordered ${saveOrder} unit of ${selectedItem.product_name} at $${selectedItem.price} ea`);
      console.log(`   Total Charge of $${saveOrder * selectedItem.price}`);
      console.log("--------------------------------------------------------------");
    }
    inquirer.prompt([{
      type: "confirm",
      name: "another",
      message: "Would you like to place another order?",
      default: false
    }]).then((user) => {
      if (user.another === true) {
        displayStore();
      } else {
        connection.end();
        process.exit();
      }
    })
  } else {
    console.log("--------------------------------------------------------------------");
    console.log(` Sorry ${saveOrder} units of ${selectedItem.product_name} not in stock! Only ${selectedItem.stock_quantity} units available`)
    console.log("--------------------------------------------------------------------");
    displayStore();
  }
}

