module.exports = (sequelize, DataTypes)=>(
    sequelize.define('case',  {
        counselor_id:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        // hasPaper:{ // 상담 접수지 제출여부
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        //     defaultValue: false,
        // },
        paper_id:{ // 상담 접수지 제출 시 id 저장
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status:{ // 진행상황
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        totalCase:{ // 총 상담회차
            type: DataTypes.INTEGER,
            allowNull: false
        },
        usedCase:{ // 현재까지 완료한 회차
            type:DataTypes.INTEGER,
            allowNull: false, 
            defaultValue: 0
        },
        // discountRate:{
        //     type:DataTypes.INTEGER,
        //     allowNull: false,
        //     defaultValue :0
        // },
        totalPrice:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        nextCase:{
            type: DataTypes.DATE,
            allowNull: true,
        },
        expireDate:{ // 만료일 = 결제일로부터 ~
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: true, //생성일(결제일), 수정일 기록 
        paranoid: true, //삭제일기록(복구용)
    })
);