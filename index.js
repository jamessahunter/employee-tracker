//imports constructors
const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const questions=[
    {
        type: 'list',
        message: 'Choose what you would like to do:',
        name: 'action',
        choices:['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee','update an employee role']
    }
]

function init(){
    promptUser();
}

function promptUser(){
    inquirer
    .prompt(questions)
    .then((response)=>{
        // console.log(response.action);
        cases(response.action);
    })
}

function cases(response){
    // console.log('works');
    switch(response){
        case 'view all departments':
            viewDeps();
            break;
        case 'view all roles':
            viewRoles();
            break;
        case 'view all employees':
            viewEmps();
            break;
        case 'add a department':
            addDep();
            break;
        case 'add a role':
            addRole();
            break;
        case 'add an employee':
            addEmp();
            break;
        case 'update an employee role':
            updateRole();
            break;
    }
}


function viewDeps(){
    console.log("view deps");
}
function viewRoles(){
    console.log("view roles");
}
function viewEmps(){
    console.log('view employees');
}
function addDep(){
    console.log('add dep');
}
function addRole(){
    console.log('add role');
}
function addEmp(){
    console.log('add employee');
}
function updateRole(){
    console.log('update role');
}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  

init();

