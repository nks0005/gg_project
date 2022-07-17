module.exports = (sequelize, DataTypes) => {
    return sequelize.define('battlelogs', {

            battleId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: true
            },
        },

        {
            timestamps: true,
            paranoid: true
        });
};