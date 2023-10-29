//imports constructors
const mysql = require('mysql2');
const inquirer = require('inquirer');
// Import and require mysql2


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      port:3306,
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );
  


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
            name: 'newRoleDepartment'
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
        db.query(`INSERT INTO departments SET ?`,{department_name:`${response.newDepartment}`},
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} depertment inserted!\n`);
        }
    )
})
}

async function addRolePromptUser() {
    try {
      const response = await inquirer.prompt(questions[2]);
      console.log(response);
  
      const departmentId = await getDep(response.newRoleDepartment);
  
      db.query(
        `INSERT INTO roles SET ?`,
        {
          role_title: response.newRoleName,
          salary: response.newRoleSalary,
          department_id: departmentId,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} role inserted!\n`);
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

// async function addRolePromptUser(){
//     inquirer
//     .prompt(questions[2])
//     .then((response)=>{
//         console.log(response);
//         db.query(`INSERT INTO roles SET ?`,
//         {role_title:`${response.newRoleName}`,
//         salary:`${response.newRoleSalary}`,
//         department_id: getDep(response.newRoleDepartment)},
//         (err, res) => {
//           if (err) throw err;
//           console.log(`${res.affectedRows} role inserted!\n`);
//         }
//     )
//     })
// }

function addEmpPromptUser(){
    inquirer
    .prompt(questions[3])
    .then((response)=>{
        console.log(response);
        db.query(`INSERT INTO employees SET ?`,{department_name:`${response.newDepartment}`},
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} product inserted!\n`);
        }
    )
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
        default:
            break;
    }
}


function viewDeps(){
    console.log("view deps");
    db.query(`SELECT * FROM departments`,(err,results)=>{
        console.log(results);
    });
    // initPromptUser();
}
function viewRoles(){
    console.log("view roles");
    db.query(`SELECT * FROM roles`,(err,results)=>{
        console.log(results);
    });
    // initPromptUser();
}
function viewEmps(){
    console.log('view employees');
    db.query(`SELECT * FROM employees`,(err,results)=>{
        console.log(results);
    });
    // initPromptUser();
}
function addDep(){
    console.log('add dep');
    addDepPromptUser();
    // initPromptUser();
}
function addRole(){
    console.log('add role');
    addRolePromptUser();
}
function addEmp(){
    console.log('add employee');
    addEmpPromptUser();
    // initPromptUser();
}
function updateRole(){
    console.log('update role');
    updateEmpPromptUser();
    // initPromptUser();
}

function getDep(dep) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM departments`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      let id;
      results.forEach((element) => {
        if (element.department_name === dep) {
          id = element.id;
        //   console.log(id);
        }
        

      });

    //   console.log(id);
    if(id){
      resolve(id);
    }
    else{
        console.log('department not found');
        initPromptUser();
    }
    });
  });
}

init();
