import { tableConfig } from '../utils/dbUtils'
/**
 * Student Schema
 */
const Student = (sequelize, DataTypes) => {
    const Student = sequelize.define(
        'Student',
        {
            student_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: { model: 'User', key: 'id' },
            },
            fullname: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            phone_no: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            email: { type: DataTypes.STRING, allowNull: false, unique: false },
            lat: { type: DataTypes.DOUBLE, allowNull: false, unique: false },
            lng: { type: DataTypes.DOUBLE, allowNull: false, unique: false },
            driver: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                references: { model: 'Driver', key: 'driver_id' },
            },
        },
        tableConfig,
    )

    return Student
}

export default Student
