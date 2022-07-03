module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comment', {

        comment: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('now()'),
        },

    }, {
        timestamps: false,
    });
};
// commenter 컬럼이 없다.=> 시퀄라이즈 자체에서 관계를 따로 정의할 수 있다. index.js