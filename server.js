//imports constructors
const mysql = require('mysql2');
const inquirer = require('inquirer');
var Table = require('cli-table');

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
  

//questions to prompt user
const questions=[
    {
        type: 'list',
        message: 'Choose what you would like to do:',
        name: 'action',
        choices:['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee','update an employee role',
        'update a manager', 'view employees by manager','view employees by department','delete a department, role, employee','view budget of department','exit']
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
    ],
    {
      type: 'list',
      message: 'Select the Manger',
      name: 'empByMan',
      choices:[]
    },
    {
      type: 'list',
      message: 'Select the Department',
      name: 'byDep',
      choices:[]
    },
    [
      {
        type: 'list',
        message: 'Select the employee',
        name: 'Emp',
        choices:[]
      },
      {
        type: 'list',
        message: 'Select the Manger',
        name: 'Man',
        choices:[]
      },
    ],
    [
      {
        type: 'list',
        message: 'Select from where you wan to delete',
        name: 'deleteFrom',
        choices:['departments','roles','employees']
      },
      {
          type: 'list',
          message: '',
          name: 'deleteChoice',
          choices:[]
      },
    ]
    
]

//initial function to prompt user
function init(){
    initPromptUser();
}
//prompts user with first question
function initPromptUser(){
    inquirer
    .prompt(questions[0])
    .then((response)=>{
        //calls cases function with response
        cases(response.action);
    })
}

//function for response
function cases(response){
  //swtich case for each response
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
      case 'update a manager':
          updateMan();
          break;
      case 'view employees by manager':
          viewEmpsByMan();
          break;
      case 'view employees by department':
          viewEmpsByDep();
          break;
      case 'delete a department, role, employee':
          userDelete();
          break;
      case 'view budget of department':
          viewBudget();
          break;
      default:
          break;
  }
}

//functions to call other functions
function addDep(){
  addDepPromptUser().then(() => {
    initPromptUser();
  });
}
function addRole(){
addRolePromptUser().then(() => {
  initPromptUser();
});
}
function addEmp(){
addEmpPromptUser().then(() => {
  initPromptUser();
});
}
function updateRole(){
updateEmpPromptUser().then(() => {
  initPromptUser();
});
}

function updateMan(){
updateManPromptUser().then(()=>{
initPromptUser();
})
}

function userDelete(){
deletePromptUser().then(()=>{
initPromptUser();
})
}

//function to view all the departments
function viewDeps(){
//queries the database for all departments
  db.query(`SELECT * FROM departments`,(err,results)=>{
      //calls the display table function with results of the query
      new Promise((resolve) => {
        displayTable(['ID','Department'],results);
        resolve();
      }).then(() => {
        //prompts user after table is displayed
        initPromptUser();
      });
  });
}

//function to view all roles
function viewRoles(){
// query to see all roles with department name instead of id
  db.query(`SELECT role_title, roles.id, department_name, salary
            FROM roles
            JOIN departments ON departments.id=roles.department_id`,
            (err,results)=>{
      new Promise((resolve) => {
        displayTable(['Role', 'Role ID', 'Department','Salary'],results);
        resolve();
      }).then(() => {
        initPromptUser();
      });
  });

}

//function to see all employees
function viewEmps(){
//query to see employees name roles departments and managers
//does this by joining tables where the ids match between tables
  db.query(`
    SELECT e.id, e.first_name, e.last_name, r.role_title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) 
    FROM employees e
    JOIN roles r ON r.id = e.role_id
    JOIN departments d ON d.id = r.department_id
    LEFT JOIN employees m ON m.id = e.manager_id;`,
     (err, results) => {
    if (err) {
      console.error(err);
    } else {
      new Promise((resolve) => {
        displayTable(['Employee ID', 'First', 'Last', 'Role' ,'Department', 'Salary', 'Manager'],results);
        resolve();
      }).then(() => {
        initPromptUser();
      });
    }
  });
}
//function to prompt user for the department
function addDepPromptUser(){
    return inquirer
    .prompt(questions[1])
    .then((response)=>{
      //insertes the response into the departments table
        db.query(`INSERT INTO departments SET ?`,{department_name:`${response.newDepartment}`},
        (err, res) => {
          if (err) throw err;
          })
    })
}
//function to prompt user for new role
async function addRolePromptUser() {
    try {
      //gets all deparmtnts for deps table
      questions[2][2].choices = await getInfo('deps');
      //prompts user
      const response = await inquirer.prompt(questions[2]);
      //gets the department id
      const departmentId = await getMatch(response.newRoleDepartment,'dep');
      //inserts response into roles table
      db.query(
        `INSERT INTO roles SET ?`,
        {
          role_title: response.newRoleName,
          salary: response.newRoleSalary,
          department_id: departmentId,
        },
        (err, res) => {
          if (err) throw err;
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

//function to add an employee
async function addEmpPromptUser(){
    
    try {
        //gets roles and maagers
        questions[3][2].choices= await getInfo('roles');
        questions[3][3].choices= await getInfo('man');
        const response = await inquirer.prompt(questions[3]);
        // gets role id and manager id
        const roleId =await getMatch(response.newEmpRole,'role');
        let managerId=null;
        if(response.newEmpManager!=='None'){
          managerId =await getMatch(response.newEmpManager,'emp');
        }
        //inserts response into employee table
        db.query(`INSERT INTO employees SET ?`,
        {
            first_name: response.newEmpFirst,
            last_name: response.newEmpLast,
            role_id: roleId,
            manager_id: managerId,
        },
        (err, res) => {
          if (err) throw err;
          
        }
    );
    
    } catch (err){
        console.error(err);
    }
    
}
//function to update an employee role
async function updateEmpPromptUser(){
  try {
    //gets eomployees and roles
    questions[4][0].choices= await getInfo('update');
    questions[4][1].choices= await getInfo('roles');
    const response = await inquirer.prompt(questions[4])
    //gets role and employee id
    const roleId =await getMatch(response.updateRole,'role');
    const empId= await getMatch(response.updateEmp,'emp');
    //udaptes the role for that employee
    db.query(`UPDATE employees SET ? WHERE ?`,
    [
      {
        role_id: roleId,
      },
      {
        id: empId,
      },
    ],
    (err, res) => {
      if (err) throw err;
    }
    );
  } catch (err){
      console.error(err);
  }
}

//function to update manager
async function updateManPromptUser(){
  try {
    //gets list of managers and employees
    questions[7][0].choices= await getInfo('update');
    questions[7][1].choices= await getInfo('man');
    const response = await inquirer.prompt(questions[7])
    //gets the matching ids for employee and manager
    const empId =await getMatch(response.Emp,'emp');
    let managerId=null;
    if(response.newEmpManager!=='None'){
      managerId =await getMatch(response.Man,'emp');
    }
    //updates the mangers on specified employee
    db.query(`UPDATE employees SET ? WHERE ?`,
    [
      {
        // managerId
        manager_id: managerId,
      },
      {
        id: empId,
      },
    ],
    (err, res) => {
      if (err) throw err;
    }
    );
  } catch (err){
      console.error(err);
  }
}

//gets employee by manages
async function viewEmpsByMan(){
  try {
    //gets managers
  questions[5].choices= await getInfo('man');
  const response = await inquirer.prompt(questions[5])
  const manId= await getMatch(response.empByMan,'emp');
  //based on ID joins the employee table with itself where the manager matches the id
  db.query(`
    SELECT CONCAT(e.first_name, ' ', e.last_name) 
    FROM employees e
    JOIN employees m ON m.id = e.manager_id
    WHERE e.manager_id=?;`,
    [manId],
     (err, results) => {
    if (err) {
      console.error(err);
    } else {
      new Promise((resolve) => {
        displayTable(['Employee'],results);
        resolve();
      }).then(() => {
        initPromptUser();
      });
    }
  });
}catch (err){
  console.error(err);
}

}

//gets all employees by department
async function viewEmpsByDep(){
  try {
    //gets departments
  questions[6].choices= await getInfo('deps');
  const response = await inquirer.prompt(questions[6])
  const depId= await getMatch(response.byDep,'dep');
    //joins employees where the match the department
  db.query(`
    SELECT CONCAT(e.first_name, ' ', e.last_name)
    FROM employees e
    JOIN roles r ON r.id = e.role_id
    JOIN departments d ON d.id = r.department_id
    WHERE d.id=?`,
    [depId],
     (err, results) => {
    if (err) {
      console.error(err);
    } else {
      new Promise((resolve) => {
        displayTable(['Employee'],results);
        resolve();
      }).then(() => {
        initPromptUser();
      });
    }
  });
}catch (err){
  console.error(err);
}
}

//function to delete a dep, role ,employee
async function deletePromptUser(){
  try {
    //checks what table to delete from
    let choice='';
    const response1 = await inquirer.prompt(questions[8][0])
    if(response1.deleteFrom==='departments'){
      questions[8][1].choices= await getInfo('deps');
      questions[8][1].message='Select a department to delete';
      choice='dep';
    }else if(response1.deleteFrom==='roles'){
      questions[8][1].choices= await getInfo('roles');
      questions[8][1].message='Select a role to delete'
      choice='role';
    }else{
      questions[8][1].choices= await getInfo('emps');
      questions[8][1].message='Select an employee to delete'
      choice='emp';
    }
    const response2 = await inquirer.prompt(questions[8][1])

    const Id =await getMatch(response2.deleteChoice,choice);
    //deletes from specified table at certain id
    db.query(`DELETE FROM ${response1.deleteFrom} WHERE id=?`,
    [
      Id
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

//function to view budget of a department
async function viewBudget(){
  try {
    console.log('view budget by department');
    questions[6].choices= await getInfo('deps');
    const response = await inquirer.prompt(questions[6])
    const depId= await getMatch(response.byDep,'dep');
    //gets the department
    //sums all the salaries for that department
    db.query(`
      SELECT SUM(salary) AS Total_Salary
      FROM roles
      WHERE department_id=?`,
      [depId],
       (err, results) => {
      if (err) {
        console.error(err);
      } else {
        new Promise((resolve) => {
          displayTable(['Total Budget'],results);
          resolve();
        }).then(() => {
          initPromptUser();
        });
      }
    });
  }catch (err){
    console.error(err);
  }
}

//function to display a nice table in console
//use npm cli-table
//takes input of an array of column titles and the results of the db.query
function displayTable(Array,res) {
  let columnWidths=[];
  for (let i=0; i<Array.length; i++){
    columnWidths.push(15);
  }
  var table = new Table({
    head: Array,
    colWidths: columnWidths
});
//pushes the results into an array
for (let i = 0; i < res.length; i++) {
  const row = [];
  for (const key in res[i]) {
    if(res[i][key]===null){
      row.push('');
    }else{
    row.push(res[i][key]);
    }
  }
  table.push(row);
}

console.log(table.toString());
}

//function to get all deps,roles or employees
function getInfo(table){
  let table_name;
  let column;
  const info=[];
  //checks which table to pull from
  if(table==='deps'){
    table_name='departments';
    column='department_name';
  }else if(table==='roles'){
    table_name='roles';
    column='role_title';
  }else if(table==='emps'||table==='update'){
    table_name='employees';
    column='first_name, last_name';
  }else if(table==='man'){
    info.push('None');
    table_name='employees';
    column='first_name, last_name';
  }
  return new Promise((resolve, reject) => {
    //pulls data from query based on table
    db.query(`SELECT ${column} FROM ${table_name}`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      //pushes results into an array
      results.forEach((element) => {
        if(table==='emps'|| table==='update' || table==='man'){
          info.push(`${element.first_name} ${element.last_name}`)
        }else{
          info.push(element[column])
        }
      });
      resolve(info);
    });
  });
}

//function to get the matching id of a dep, role ,employee
function getMatch(match,data){
  let column;
  //checks what info to match
  if(data==='dep'){
    table_name='departments';
    column='department_name';
  }else if(data==='role'){
    table_name='roles';
    column='role_title';
  }else if(data==='emp'){
    table_name='employees';
    column='first_name, last_name';
  }
  return new Promise((resolve, reject) => {
    //queries the database based on info required
    db.query(`SELECT * FROM ${table_name}`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      let id;
      //checks for match for each employees
      results.forEach((element) => {
        if(data==='emp'){
          if (`${element.first_name} ${element.last_name}` === match) {
            id = element.id;
          }
        }
        else{
          if (element[column] === match) {
            id = element.id;
          }
        }
      });
      resolve(id);
    });
  });
}

//calls initial function
init();