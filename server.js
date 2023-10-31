//imports constructors
const mysql = require('mysql2');
const inquirer = require('inquirer');
var Table = require('cli-table');
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
    return inquirer
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
      questions[2][2].choices = await getInfo('deps');
      const response = await inquirer.prompt(questions[2]);
      // console.log(response.newRoleDepartment);
      const departmentId = await getMatch(response.newRoleDepartment,'dep');
  
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

        questions[3][2].choices= await getInfo('roles');
        questions[3][3].choices= await getInfo('man');
        const response = await inquirer.prompt(questions[3])
        const roleId =await getMatch(response.newEmpRole,'role');
        let managerId=null;
        if(response.newEmpManager!=='None'){
          managerId =await getMatch(response.newEmpManager,'emp');
        }

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

    questions[4][0].choices= await getInfo('update');
    questions[4][1].choices= await getInfo('roles');
    const response = await inquirer.prompt(questions[4])
    const roleId =await getMatch(response.updateRole,'role');
    // console.log("role works")
    const empId= await getMatch(response.updateEmp,'emp');
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

async function updateManPromptUser(){
  try {

    questions[7][0].choices= await getInfo('update');
    questions[7][1].choices= await getInfo('man');
    const response = await inquirer.prompt(questions[7])
    const empId =await getMatch(response.Emp,'emp');
    // console.log("role works")
    let managerId=null;
    if(response.newEmpManager!=='None'){
      managerId =await getMatch(response.Man,'emp');
    }
    // empName=response.updateEmp.split(" ");
    console.log(response);
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
      console.log(`${res.affectedRows} product inserted!\n`);
    }
    );
  } catch (err){
      console.error(err);
  }
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


function viewDeps(){
    console.log("view deps");
    db.query(`SELECT * FROM departments`,(err,results)=>{
        // console.table(results,['id','department_name']);
        new Promise((resolve) => {
          displayTable(['ID','Department'],results);
          resolve();
        }).then(() => {
          initPromptUser();
        });
    });
    // initPromptUser();
}
function viewRoles(){
    console.log("view roles");
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
function viewEmps(){
    console.log('view employees');
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

async function viewEmpsByMan(){
  try {
  console.log('view employees by manager');
  questions[5].choices= await getInfo('man');
  const response = await inquirer.prompt(questions[5])
  const manId= await getMatch(response.empByMan,'emp');
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

async function viewEmpsByDep(){
  try {
  console.log('view employees by department');
  questions[6].choices= await getInfo('deps');
  const response = await inquirer.prompt(questions[6])
  const depId= await getMatch(response.byDep,'dep');
  console.log(depId)
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

async function deletePromptUser(){
  try {
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

    // console.log(response);
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

async function viewBudget(){
  try {
    console.log('view budget by department');
    questions[6].choices= await getInfo('deps');
    const response = await inquirer.prompt(questions[6])
    const depId= await getMatch(response.byDep,'dep');
    console.log(depId)
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


function addDep(){
    console.log('add dep');
      addDepPromptUser().then(() => {
        initPromptUser();
      });
}
function addRole(){
    console.log('add role');
    addRolePromptUser().then(() => {
      initPromptUser();
    });
}
function addEmp(){
    console.log('add employee');
    addEmpPromptUser().then(() => {
      initPromptUser();
    });
}
function updateRole(){
    console.log('update role');
    updateEmpPromptUser().then(() => {
      initPromptUser();
    });
}

function updateMan(){
  console.log('update manger');
  updateManPromptUser().then(()=>{
    initPromptUser();
  })
}

function userDelete(){
  console.log('delete');
  deletePromptUser().then(()=>{
    initPromptUser();
  })
}

function displayTable(Array,res) {
  let columnWidths=[];
  for (let i=0; i<Array.length; i++){
    columnWidths.push(15);
  }
  var table = new Table({
    //You can name these table heads chicken if you'd like. They are simply the headers for a table we're putting our data in
    head: Array,
    //These are just the width of the columns. Only mess with these if you want to change the cosmetics of our response
    colWidths: columnWidths
});

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
// console.log(table);
console.log(table.toString());
}

function getInfo(table){
  let table_name;
  let column;
  const info=[];
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
    db.query(`SELECT ${column} FROM ${table_name}`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
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

function getMatch(match,data){
  let column;
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
    db.query(`SELECT * FROM ${table_name}`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      let id;
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




init();
