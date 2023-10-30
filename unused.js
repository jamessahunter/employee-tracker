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