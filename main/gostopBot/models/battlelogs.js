module.exports = (sequelize, DataTypes) => {
    return sequelize.define('battlelogs', {

            // id 는 자동으로 생성됨

            battleId: { // battle id 저장
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