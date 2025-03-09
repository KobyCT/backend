const sql = require('../config/pgdb');

const Product = require('./product');

const User = function(user){
   this.uid = user.uid;
   this.firstNameTH = user.firstNameTH;
   this.firstNameEN = user.firstNameEN;
   this.lastNameTH = user.lastNameTH;
   this.lastNameEN = user.lastNameEN;
   this.facultyId = user.facultyId;
   this.facultyNameTH = user.facultyNameTH;
   this.facultyNameEN == user.facultyNameEN;
   this.studentYear = user.studentYear;
   this.studentId = user.studentId;
   this.role = user.role;
};

User.findById = (id,result) =>{
    console.log(id);
    const query = `
    SELECT * FROM users WHERE uid = '${id}';
    `;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('error: ', err);
            result(err,null);
            return;
        }
        if(res.rows.length) {
            console.log('found user: ',res.rows[0]);
            result(null, res.rows[0]);
            return;
        }

        //not found user with the id
        result({kind: 'not_found'},null);
    });
};

User.getAll = (result) => {
    sql.query('SELECT * FROM users;',(err, res)=> {
        if(err){
            console.log('error: ',err);
            result(err, null);
            return;
        }
        console.log('All users: ');
        console.log(res.rows);
        result(null, res.rows);
    });
};

User.create = (newUser, result) => {
    console.log(newUser);

    const {uid,firstNameTH,firstNameEN,lastNameTH,lastNameEN,facultyId,facultyNameTH,facultyNameEN,studentYear,studentId,role} = newUser;
    
    const query = `
    INSERT INTO users (uid,firstNameTH,firstNameEN,lastNameTH,lastNameEN,facultyId,facultyNameTH,facultyNameEN,studentYear,studentId,role)
    VALUES ('${uid}','${firstNameTH}','${firstNameEN}','${lastNameTH}','${lastNameEN}','${facultyId}','${facultyNameTH}','${facultyNameEN}','${studentYear}','${studentId}','${role}')
    RETURNING *;
    `;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('create error: ',err);
            result(err,null);
            return;
        }
        console.log('create user:')
        console.log(res.rows);
        result(null, res.rows);
    });
};



module.exports = User;
