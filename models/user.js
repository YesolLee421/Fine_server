module.exports = (sequelize, DataTypes)=>(
    sequelize.define('user',  {
        user_uid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        }, 
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            //unique: true,
        }, 
        nickname: {
            type: DataTypes.STRING(20), 
            allowNull: true,
        }, 
        password: {
            type: DataTypes.STRING,
            allowNull: true, //카카오일시 필수가 아니어도되니 false
        },
        provider: { // 추후 kakao passport고려
            type: DataTypes.STRING(20), 
            allowNull: false,
            defaultValue: 'local'
        }, 
        snsId: { // sns사용자아이디
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: { // 1=관리자, 2=전문상담사, 3=일반사용자
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        hasPaper: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);