const express = require('express');// used for routing

var mysql = require('mysql');

const app = express();// instance of server is created
const port = 8080;//run on this port
const path = require('path');
app.listen(port, function () {                          // connecting to a server
    console.log(`Listening on port ${port}...`);
});

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "northwind"
});

connection.connect(function (err) {                // connecting to DBMS
    if (err) throw err;
    console.log("Connected!");
}); 

/*app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'login.html'));
});


app.get('/xyz', function (req, res) {
    res.send('abyuhcihijjnm');
});

app.get('/abc', function (req, res) {
    res.send('This is Lab 11');
});

app.get('/query', function (req, res) {          // Request to create table Students in northwind database
    let sql = "SELECT FIRSTNAME,LASTNAME FROM EMPLOYEES";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});*/

app.get('/query1', function (req, res) {          // Request to create table Students in northwind database
    let sql = "Select ProductName, UnitPrice from Products where unitprice > 10 and unitprice < 20 ";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});


/*app.get('/Task1', function (req, res) {          // Request to create table Students in northwind database
    let sql = "SELECT categories.CategoryName, AVG(Products.UnitPrice) AS AvgUnitPrice FROM Products INNER JOIN Categories ON Products.CategoryID = Categories.CategoryID GROUP BY categories.CategoryName Limit 5;";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/Task2', function (req, res) {          // Request to create table Students in northwind database
    let sql = "SELECT DISTINCT Customers.CompanyName FROM Customers JOIN Orders ON Customers.CustomerID = Orders.CustomerID WHERE Orders.OrderDate >= '1996-01-01' AND Orders.OrderDate < '1997-01-01' ORDER BY Customers.CompanyName;";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/Task3', function (req, res) {          // Request to create table Students in northwind database
    let sql = "SELECT LastName, FirstName FROM Employees WHERE LastName LIKE 'S%' ORDER BY LastName, FirstName;";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/Task4', function (req, res) {          // Request to create table Students in northwind database
    let sql = "SELECT Products.ProductName, Suppliers.CompanyName AS SupplierName, Suppliers.ContactName AS SupplierContactName FROM Products JOIN Suppliers ON Products.SupplierID = Suppliers.SupplierID WHERe Products.Discontinued = 1;";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});*/
