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
        choices:['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee','update an employee role','exit']
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
            type: 'list',
            message: 'Select the department',
            name: 'newRoleDepartment',
            choices:[]
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
            type: 'list',
            message: 'Select the role',
            name: 'newEmpRole',
            choices: []
        },
        {
            type: 'list',
            message: 'Select a manager',
            name: 'newEmpManager',
            choices:[]
        },
    ],
    [
        {
            type: 'list',
            message: 'Select the employee',
            name: 'updateEmp',
            choices:[]
        },
        {
            type: 'list',
            message: 'Select the new role',
            name: 'updateRole',
            choices:[]
        },
    ]
]

// console.log(questions[2][1]);

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
          })
    })
}

async function addRolePromptUser() {
    try {
      questions[2][2].choices = await getDeps();
      const response = await inquirer.prompt(questions[2]);
      console.log(response);
      const departmentId = await getDepMatch(response.newRoleDepartment);
  
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


async function addEmpPromptUser(){
    
    try {

        questions[3][2].choices= await getRoles();
        questions[3][3].choices= await getMans();
        const response = await inquirer.prompt(questions[3])
        const roleId =await getRoleMatch(response.newEmpRole);
        const managerId =await getManMatch(response.newEmpManager);
        db.query(`INSERT INTO employees SET ?`,
        {
            first_name: response.newEmpFirst,
            last_name: response.newEmpLast,
            role_id: roleId,
            manager_id: managerId,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} product inserted!\n`);
        }
    );
    
    } catch (err){
        console.error(err);
    }
    
}

async function updateEmpPromptUser(){
  try {

    questions[4][0].choices= await getMans();
    questions[4][1].choices= await getRoles();
    const response = await inquirer.prompt(questions[4])
    const roleId =await getRoleMatch(response.updateRole);
    const empId= await getManMatch(response.updateEmp);
    // empName=response.updateEmp.split(" ");
    console.log(response);
    db.query(`UPDATE employees SET ? WHERE ?`,
    [
      {
        role_id: roleId,
        // manager_id: managerId,
      },
      {
        id: empId,
      },
    ],
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} product inserted!\n`);
    }
);

} catch (err){
    console.error(err);
}

}

async function cases(response){
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
        // console.table(results,['id','department_name']);
        displayTable(results);
    });
    // initPromptUser();
}
function viewRoles(){
    console.log("view roles");
    db.query(`SELECT * FROM roles`,(err,results)=>{
        // console.table(results);
        displayTable(results)
    });
    // initPromptUser();
}
function viewEmps(){
    console.log('view employees');
    db.query(`
      SELECT *
      FROM employees
      LEFT JOIN roles ON employees.role_id = roles.id
      UNION
      SELECT *
      FROM employees
      RIGHT JOIN roles ON employees.role_id = roles.id
    `, (err, results) => {
      if (err) {
        console.error(err);
      } else {
        displayTable(results);
      }
    });
    // db.query(`SELECT * FROM employees
    // FULL OUTER JOIN roles
    // ON employees.role_id = roles.id`,(err,results)=>{
    //     console.table(results);
    // });
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

function displayTable(data) {
  const columns = Object.keys(data[0]);
  const tableData = data.map(obj => columns.map(col => obj[col]));
  
  console.log(columns.join('\t'));
  tableData.forEach(row => console.log(row.join('\t')));
}



function getDeps() {
  return new Promise((resolve, reject) => {
    db.query(`SELECT department_name FROM departments`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      const deps=[]
      results.forEach((element) => {
        deps.push(element.department_name)
      });
      console.log(deps);
      resolve(deps);

    });
  });
}

function getDepMatch(dep) {
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
        addRolePromptUser();
    }
    });
  });
}

function getRoles() {
  return new Promise((resolve, reject) => {
    db.query(`SELECT role_title FROM roles`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      // console.log(results);
      const roles=[]
      results.forEach((element) => {
        roles.push(element.role_title)
      });
      // console.log(roles);
      resolve(roles);

    });
  });
}


function getRoleMatch(role){
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM roles`, (err, results) => {
          if (err) {
            reject(err);
            return;
          }
    
          let id;
        //   console.log(results);
          results.forEach((element) => {
            // console.log(element)
            if (element.role_title === role) {
              id = element.id;
            //   console.log(id);
            }
          });
        //   console.log(id);
        if(id){
          resolve(id);
        }
        else{
            console.log('role not found');
            addEmpPromptUser();
        }
        });
      });
}

function getMans() {
  return new Promise((resolve, reject) => {
    db.query(`SELECT first_name, last_name FROM employees`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      // console.log(results);
      const mans=['None'];
      results.forEach((element) => {
        mans.push(`${element.first_name} ${element.last_name}`);
      });
      // console.log(mans);
      resolve(mans);

    });
  });
}

function getManMatch(manager){
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM employees`, (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          let id;
          results.forEach((element) => {
            // console.log(element)
            if (`${element.first_name} ${element.last_name}` === manager) {
              id = element.id;
            //   console.log(id);
            }
          });
          console.log(id);
          resolve(id);
        });
      });
}


init();
