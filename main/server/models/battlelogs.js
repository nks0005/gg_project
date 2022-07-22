module.exports = (sequelize, DataTypes) => {
    return sequelize.define('battlelogs', {

            // id 는 자동으로 생성됨

            battleId: { // battle id 저장
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: true
            },

            totalKills: { // 전체 킬 수
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },

            totalPlayers: { // 전체 플레이어 수
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },

            logTime: { // 종료 시간
                type: DataTypes.DATE,
                allowNull: false,
            },

            send: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },

            checktotal: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },

            ten: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            }

        },

        {
            timestamps: true,
            paranoid: true
        });
};