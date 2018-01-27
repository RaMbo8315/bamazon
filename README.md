# bamazon

A command-line store utilizing a mySQL database

## Description

This is a command-line app that interacts with mySQL to retrtieve information 
from a database to display a list of items for a user to purchase by iputing 
an item id and the quantity they would like to purchase. There is also manager 
side to the app which allows a manager to view products for sale, view low inventory, add 
inventory, and add new inventory.

### How it works

When the app is ran a connection to mySQL is made and a a function is called displaying 
the store utilizing the console.table npm package. Using the inquirer package the customer 
is asked to input the item id of the product they would like to purchase and how much of the product
of the product they like like. Once the order is completed the products quantity is updated in the 
database. On the manager side when view products is selected a query is made to the database 
and the store is displayed. View low inventory displays only the products whose quantity is lower than five.
Add inventory will take in managers input to select an item and the quantity they would like to 
add to the products inventory, when collected a query is made to update the database. 
Add new product ask the manager for the name of the product, the department the product 
is located in, the price, and how much of the product they like to add. The information is 
stored then a query is made to update the database. 

## Built With 

* Javascript
* Nodejs
* MySQL package
* Inquirer package
* console.table package

### Video Demonstrating How it Works

[![Bamazon Store](https://youtu.be/g_9WW2PddMQ)](https://youtu.be/g_9WW2PddMQ)

## Authors

* **Henry Urena** - *Initial work* - [Constructor-hangman](https://github.com/RaMbo8315/constructor-hangman)

