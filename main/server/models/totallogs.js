module.exports = (sequelize, DataTypes) => {
    return sequelize.define('totallogs', {

            // id 는 자동으로 생성됨
            A: {
                type: DataTypes.STRING(50),
            },

            B: {
                type: DataTypes.STRING(50),
            },

            C: {
                type: DataTypes.STRING(50),
            },

            D: {
                type: DataTypes.STRING(50),
            },

            E: {
                type: DataTypes.STRING(50),
            },

            win: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },

            lose: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },


        },

        {
            timestamps: true,
            paranoid: true
        });
};