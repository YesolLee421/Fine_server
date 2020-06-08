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
        problem: { // array
            type: DataTypes.TEXT,
            allowNull: true,
        },
        symptom: { // array
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
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        hasMate: { 
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        family: { // array
            type: DataTypes.TEXT,
            allowNull: true,
        },
        request: {
            type: DataTypes.TEXT,
            allowNull: true
        }     
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);