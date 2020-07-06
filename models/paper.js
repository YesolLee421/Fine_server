module.exports = (sequelize, DataTypes)=>(
    sequelize.define('paper',  {
        gender: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: -1
        },
        birth_year: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        job: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: -1
        },
        counselBefore: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: -1
        },
        clinicBefore: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: -1
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
            defaultValue: -1
        },
        education: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: -1
        },
        livingCondition: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: -1
        },
        isMarried: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: -1
        },
        hasMate: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: -1
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