module.exports = (sequelize, DataTypes)=>(
    sequelize.define('counselor',  {
        user_uid: { //user에서 생성한 uid 그대로 넣기
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        }, 
        name_formal: { // 실명
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        gender: { // 상담사 성별
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1 //1=여성, 2=남성, 3=기타
        },
        description:{ // 간단 한줄 소개
            type: DataTypes.TEXT,
            allowNull: true
        },
        picture: { //프로필 사진 경로
            type: DataTypes.STRING(50),
            allowNull: true
        },
        isVerified:{ // 전문 상담사 인증
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false
        },
        intro_1:{ // 소개1
            type: DataTypes.TEXT,
            allowNull: true
        },
        intro_2:{ // 소개2
            type: DataTypes.TEXT,
            allowNull: true
        },
        intro_3:{ //소개3
            type: DataTypes.TEXT,
            allowNull: true
        },
        certificate:{ //자격사항
            type: DataTypes.TEXT,
            allowNull: true
        },
        career:{ //경력
            type: DataTypes.TEXT,
            allowNull: true
        }
        ,
        education:{ //학력
            type: DataTypes.TEXT,
            allowNull: true
        },
        time_prefered:{ //선호하는 시간대 (json)
            type: DataTypes.TEXT,
            allowNull: true
        },
        price:{ //회기 당 가격
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 20000
        },
        discount_4w:{ //4주 프로그램 할인율
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        discount_10w:{ //10주 프로그램 할인율
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        bank_account:{ //은행계좌 (json)
            type: DataTypes.STRING(50),
            allowNull: true
        },
        count:{ // 총 상담횟수
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);