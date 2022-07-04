module.exports = (sequelize, DataTypes) => {
    return sequelize.define('playerlogs', {

        userName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        guildName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        allianceName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        killType: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        damage: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },

        heal: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,

        },

        avgIp: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        mainHand: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },

        offHand: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },

        head: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },

        armor: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },

        shoes: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },

        cape: {
            type: DataTypes.STRING(50),
            allowNull: true,
        }

    }, {
        timestamps: true,
        paranoid: true
    })
}