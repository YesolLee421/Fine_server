module.exports = (sequelize, DataTypes)=>(
    sequelize.define('paper',  {
        gender: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        birth_year: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        job: { 
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        counselBefore: { 
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        clinicBefore: { 
            type: DataTypes.INTEGER,
            allowNull: true,
        }, 
        problem: { 
            type: DataTypes.TEXT,
            allowNull: true,
        },
        symptom: { 
            type: DataTypes.TEXT,
            allowNull: true,
        },  
        religion: { 
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        education: { 
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        livingCondition: { 
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isMarried: { 
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        hasMate: { 
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        family: { // String
            type: DataTypes.TEXT,
            allowNull: true,
        },
        request: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }     
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);