module.exports = (sequelize, DataTypes) => {
    return sequelize.define('eventlogs', {

        eventId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: true
        },

        partyMemberCount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        killArea: {
            type: DataTypes.STRING(20),
            allowNull: false,
        }

    }, {
        timestamps: true,
        paranoid: true
    });
};