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
  displayStock();
});

function displayStock() {
    var table = new Table({
        head: ['ID', 'Product', 'Price']
      , colWidths: [4, 20, 7]
    });
    var query = "SELECT item_id, product_name, price FROM products";
      connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            table.push(
                [ res[i].item_id , res[i].product_name, "$" + res[i].price ]
            );
            var item = i+1;
            idArray.push(item.toString());
        }
        console.log("\n");
        console.log(table.toString());
      });
      makePurchace();
};

function makePurchace() {
  inquirer
    .prompt([
    {
      name: "id",
      type: "input",
      message: "Please type the ID of the product you would like to buy:"
    },{
        name: "quantity",
        type: "input",
        message: "How many would you like?",
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
        var requested = answer.quantity;

        if (idArray.indexOf(answer.id) !== -1) {
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { item_id: ID }, function(err, res) {
                var available = res[0].stock_quantity;
                var item = res[0].product_name;
                var cost = res[0].price;
                if (available < requested){
                    console.log("I'm sorry. We don't have " + requested + " " + item + "(s) left.");
                    makePurchace();
                    return
                } else {
                    console.log("You chose to buy: " + item + " x " + requested + ".");
                    reduceInventory(ID, requested, available);
                    console.log("Your total is $" + cost * requested + ".");
                }
            });
        } else {
            console.log("No item " + answer.id + " is available. Please choose an ID from the list.");
            makePurchace();
        }
    });
};

function reduceInventory(id, numSold, numStock) {
    console.log("Processing your purchase...\n");
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: numStock - numSold
        },
        {
          item_id: id
        }
      ],
      function(err, res) {
        console.log("Purchase complete! \n");
      }
    );
  }