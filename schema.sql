-- CREATE THE bamazon DATABASE, IF IT DOES NOT ALREADY EXIST
DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

-- CREATE A TABLE FOR THE PRODUCTS
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

-- ADD 10 ITEMS TO THE PRODUCTS DATABASE
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("coffee", "cafe", 2, 100),
    ("tea", "cafe", 1, 50),
    ("hotChocolate", "cafe", 2, 25),
    ("espresso", "cafe", 3, 200),
    ("water", "cafe", 0, 100),

    ("muffin", "bakery", 3, 100),
    ("cookie", "bakery", 1, 100),
    ("croissant", "bakery", 3, 100),
    ("cupcake", "bakery", 2, 100),
    ("brownie", "bakery", 4, 100);
