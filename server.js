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
    },
    {
        type: 'input',
        message: 'Enter the new department',
        name: 'newDepartment'
    },
    [
        {
            type: 'input',
            message: 'Enter the name',
            name: 'newRoleName'
        },
        {
            type: 'input',
            message: 'Enter the salary',
            name: 'newRoleSalary'
        },
        {
            type: 'input',
            message: 'Enter the department',
            name: 'newRoleDeprtment'
        },
    ],
    [
        {
            type: 'input',
            message: 'Enter the first name',
            name: 'newEmpFirst'
        },
        {
            type: 'input',
            message: 'Enter the last name',
            name: 'newEmpLast'
        },
        {
            type: 'input',
            message: 'Enter the role',
            name: 'newEmpRole'
        },
        {
            type: 'input',
            message: 'Enter the manager',
            name: 'newEmpManager'
        },
    ],
    [
        {
            type: 'input',
            message: 'Enter the name of the employee',
            name: 'updateEmp'
        },
        {
            type: 'input',
            message: 'Enter theire role',
            name: 'updateRole'
        },
    ]
]

function init(){
    initPromptUser();
}

function initPromptUser(){
    inquirer
    .prompt(questions[0])
    .then((response)=>{
        // console.log(response.action);
        cases(response.action);
    })
}

function addDepPromptUser(){
    inquirer
    .prompt(questions[1])
    .then((response)=>{
        console.log(response);
    })
}

function addRolePromptUser(){
    inquirer
    .prompt(questions[2])
    .then((response)=>{
        console.log(response);
    })
}

function addEmpPromptUser(){
    inquirer
    .prompt(questions[3])
    .then((response)=>{
        console.log(response);
        })
}

function updateEmpPromptUser(){
    inquirer
    .prompt(questions[4])
    .then((response)=>{
        console.log(response);
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
    addDepPromptUser();
}
function addRole(){
    console.log('add role');
    addRolePromptUser();
}
function addEmp(){
    console.log('add employee');
    addEmpPromptUser();
}
function updateRole(){
    console.log('update role');
    updateEmpPromptUser();
}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  

  init();



  // Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );