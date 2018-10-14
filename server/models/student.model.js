import { tableConfig } from '../utils'
/**
 * Student Schema
 */
const Student = (sequelize, DataTypes) => {
    const Student = sequelize.define(
        'Student',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            fullname: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            status: { type: DataTypes.STRING, allowNull: false, unique: false },
            parent_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: { model: 'Parent', key: 'parent_id' },
            },
            grade: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                references: { model: 'Grade', key: 'grade_id' },
            },
            shift: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                references: { model: 'Shift', key: 'shift_id' },
            },
            driver_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: { model: 'Driver', key: 'driver_id' },
            },
        },
        tableConfig,
    )

    return Student
}

export default Student
