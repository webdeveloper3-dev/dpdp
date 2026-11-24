/**
 * MySQL Sequelize Connection Instance
 */

const { Sequelize } = require("sequelize");
const config = require("../config");

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: config.db.logging,
    pool: config.db.pool
  });
} else {
  sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
      host: config.db.host,
      port: config.db.port,
      dialect: "mysql",
      logging: config.db.logging,
      pool: config.db.pool,
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    }
  );
}

module.exports = sequelize;
