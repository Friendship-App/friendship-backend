const moment=require('moment');
const faker=require('faker');
const simpleFixtures=require('simple-fixtures');

var row=[];
for(var i=29;i>=0;i--){
    row.push({
        timestamp:moment().subtract(i,'days')
    })
}

exports.seed = knex=> {
  return knex.batchInsert('metrics_users_registered',row,30)

}