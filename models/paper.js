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
        job: { //String
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        counselBefore: { //String
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        clinicBefore: { // String
            type: DataTypes.INTEGER,
            allowNull: true,
        }, 
        problem: { // String
            type: DataTypes.TEXT,
            allowNull: true,
        },
        symptom: { // String
            type: DataTypes.TEXT,
            allowNull: true,
        },  
        religion: { //String
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        education: { //String
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        livingCondition: { //String
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