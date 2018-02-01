var mysql = require("mysql");
var Table = require('cli-table2');
var inquirer = require("inquirer");

var idArray = [];

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayOptions();
});

function displayOptions() {
    inquirer
    .prompt([
    {
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
    ])
    .then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
              viewProducts();
              displayOptions();
              break;
    
            case "View Low Inventory":
              viewLowInventory();
              break;
    
            case "Add to Inventory":
              addInventory();
              break;
    
            case "Add New Product":
              addProduct();
              break;
          }
    });
};

function viewProducts() {
    var table = new Table({
        head: ['ID', 'Product', 'Department', 'Price', 'Stock Quantity']
      , colWidths: [4, 20, 12, 7, 16]
    });
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
      connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            table.push(
                [ res[i].item_id , res[i].product_name, res[i].department_name, "$" + res[i].price , res[i].stock_quantity ]
            );
            var item = i+1;
            idArray.push(item.toString());
        }
        console.log("\n");
        console.log(table.toString());
      });
};

function viewLowInventory(){
    var table = new Table({
        head: ['ID', 'Product', 'Department', 'Price', 'Stock Quantity']
      , colWidths: [4, 20, 12, 7, 16]
    });
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 6";
      connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            table.push(
                [ res[i].item_id , res[i].product_name, res[i].department_name, "$" + res[i].price , res[i].stock_quantity ]
            );
            var item = i+1;
            idArray.push(item.toString());
        }
        console.log("\n");
        console.log(table.toString());
      });
      displayOptions();
};

function addInventory(){
    viewProducts();
    inquirer
    .prompt([
    {
      name: "id",
      type: "input",
      message: "Please type the ID of the product you would like to restock:"
    },{
        name: "quantity",
        type: "input",
        message: "How many would you like to add to inventory?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    }
    ])
    .then(function(answer) {
        var ID = answer.id;
        var restock = answer.quantity;

        if (idArray.indexOf(answer.id) !== -1) {
            console.log("Updating...\n");
            var query = connection.query(
              "UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?",
              [
                restock
                ,
                {
                    item_id: ID
                }
              ],
              function(err, res) {
                console.log("Product updated!\n");
                
              });
        } else {
            console.log("No item " + answer.id + " is available. Please choose an ID from the list.");
        }
        viewProducts();
    });
    return
};

function addProduct(){
    inquirer
    .prompt([
    {
        name: "product",
        type: "input",
        message: "What is the name of the product you are adding?"
    },{
        name: "department",
        type: "input",
        message: "What department is this product for?"
    },{
        name: "price",
        type: "input",
        message: "How much will this product sell for?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    },{
        name: "quantity",
        type: "input",
        message: "How many would you like to add to inventory?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    }
    ])
    .then(function(answer) {
        var query = connection.query(
            "INSERT INTO products SET ?;",
            {
                product_name: answer.product,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            },
            function(err, res) {
              console.log("Item added to inventory! \n");
              viewProducts();
            }
          );
    });
};
