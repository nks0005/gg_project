const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development'
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.Battlelogs = require('./battlelogs')(sequelize, Sequelize);
db.Eventlogs = require('./eventlogs')(sequelize, Sequelize);
db.Playerlogs = require('./playerlogs')(sequelize, Sequelize);
db.Totallogs = require('./totallogs')(sequelize, Sequelize);

// battlelog 1 : N eventlog

db.Battlelogs.hasMany(db.Eventlogs, { foreignKey: 'battleId', sourceKey: 'battleId', onDelete: "cascade", });
db.Eventlogs.belongsTo(db.Battlelogs, { foreignKey: 'battleId', targetKey: 'battleId', onDelete: "cascade", });

// eventlog 1 : N playerlog

db.Eventlogs.hasMany(db.Playerlogs, { foreignKey: 'eventId', sourceKey: 'eventId', onDelete: "cascade", });
db.Playerlogs.belongsTo(db.Eventlogs, { foreignKey: 'eventId', targetKey: 'eventId', onDelete: "cascade", });


module.exports = db;