module.exports = (sequelize, DataTypes)=>(
    sequelize.define('message',  {
        // case와 일대다 관계 형성
        // msg_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     unique: true,
        //     primaryKey: true,
        // },
        sender_uid:{
            type: DataTypes.STRING,
            allowNull: false
        },
        receiver_uid:{
            type: DataTypes.STRING,
            allowNull: false
        },
        content:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        message_file:{
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);