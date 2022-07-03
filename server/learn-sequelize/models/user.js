module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', { // 테이블 : user

        name: { // 속성 : name
            type: DataTypes.STRING(20), // VARCHAR(20)
            allowNull: false, // NN
            unique: true, // unique
        },

        age: {
            type: DataTypes.INTEGER.UNSIGNED, // int unsigned
            allowNull: false,
        },

        married: {
            type: DataTypes.BOOLEAN, // tinyint. 1byte
            allowNull: false,
        },

        comment: {
            type: DataTypes.TEXT, // text
            allowNull: true,
        },

        created_at: {
            type: DataTypes.DATE, // datetime
            allowNull: false,
            defaultValue: sequelize.literal('now()'),
        },


    }, {
        timestamps: false, // true면 createAt과 updateAt 칼럼을 추가한다. 
    });
};
/*

시퀄라이즈는 알아서 id를 기본 키로 연결하므로, id 컬럼은 적어줄 필요가 없다.
*/