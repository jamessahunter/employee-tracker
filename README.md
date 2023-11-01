# Employee Tracker

## Technology Used

| Technology         | Resource URL                                    |
| -------------------|:-----------------------------------------------:|
| JavaScript         | [https://www.w3schools.com/js/default.asp](https://www.w3schools.com/js/default.asp) |
| Node.js | [https://nodejs.org](https://nodejs.org/en)
| NPM | [https://www.npmjs.com/](https://www.npmjs.com/) |

## Description

[Link to Walkthough Video](https://drive.google.com/file/d/1FFnByhKrpve4iF8xlZE6kQm1NZ0pG7yy/view)

 This project allows the user to add or view items in tables that are contained in a database. The user does this by being prompted and selecting an option. Once an option is selected the program runs a query on the SQL database that was created. The queries allowed the user to view the information that is in a table, add to the table, or update part of the table. This was done by using the npm package mysql2. Mysql2 also host the server that the user is interacting with. This also uses the npm library of inquirer to prompt the user in the command line and record the users answer. This project taught me about how to create a database and table in sql and how tables can be linked together using foreign keys.

## Installation

 To install download all the files from the repository.
 Once downloaded navigate to that directory in the command line and enter `nmp i`.
 In the command line go to the mysql shell using `mysql -u root -p` and enter your password
 Once in the shell copy and paste the contents of schema.sql into the command line
 Once done type `quit` to get out of the shell

## Usage

 To use type `npm start`
 
![Usage Example](./assets/Employee%20Tracker.gif)

## Learning Points

Learned about SQL and how touse mySQL and interact with the data base it creates

## Author Info

### James Hunter
* [LinkedIn](https://www.linkedin.com/in/james-hunter123/)
* [Github](https://github.com/jamessahunter)