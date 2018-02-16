const moment=require('moment');
const faker=require('faker');
const simpleFixtures=require('simple-fixtures');

var row=[];
for(var i=30;i>0;i--){
    row.push({
        users_count:faker.random.number({min:1,max:10}),
        timestamp:moment().day(-i)
    })
}

exports.seed = knex=> {
  return knex.batchInsert('metrics_users_registered',row,30)

}

/* exports.seed=knex=>{
  knex('metrics_users_registered').insert({
    users_count:faker.random.number({min:1,max:10}),
    timestamp:moment().day(-1).format('DD-MM-YYYY')
  })
} */

/* const registeredUsersFields = {
      users_count: faker.random.number({ min: 1, max: 10 }),
      timestamp: moment()
    };
    
    exports.seed = (knex,Promise) =>{
      return knex.batchInsert(
        'metrics_users_registered',
        simpleFixtures.generateFixtures(registeredUsersFields, 10),10
      )}; */