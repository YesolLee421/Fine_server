'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development'; // production
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// 테이블 객체 선언
db.User = require('./user')(sequelize, Sequelize);
db.Counselor = require('./counselor')(sequelize, Sequelize);
db.Paper = require('./paper')(sequelize, Sequelize);
db.Case = require('./case')(sequelize, Sequelize);
db.Message = require('./message')(sequelize, Sequelize);

// user- paper 일대일
db.User.hasOne(db.Paper, {
  foreignKey: 'fk_user_uid', sourceKey:'user_uid',
  onDelete: 'CASCADE',
});
db.Paper.belongsTo(db.User,{
  foreignKey: 'fk_user_uid', sourceKey:'user_uid',
  onDelete: 'CASCADE',
});

// user-case 일대다
db.User.hasMany(db.Case, {
  foreignKey: 'fk_user_uid', sourceKey:'user_uid',
  onDelete: 'CASCADE',
});
db.Case.belongsTo(db.User, {
  foreignKey: 'fk_user_uid', sourceKey:'user_uid',
  onDelete: 'CASCADE',
});

// case-message 일대다
db.Case.hasMany(db.Message, {
  foreignKey: 'fk_case_id', sourceKey:'id',
  onDelete: 'CASCADE',
});
db.Message.belongsTo(db.Case, {
  foreignKey: 'fk_case_id', sourceKey:'id',
  onDelete: 'CASCADE',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
