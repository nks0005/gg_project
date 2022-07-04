module.exports = (sequelize, DataTypes) => {
    return sequelize.define('equiments', {

    }, {
        timestamps: true,
        paranoid: true
    })
}