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
                autoIncrement: true,
                primaryKey: true,
            },
            fullname: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
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
            parent_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: { model: 'Parent', key: 'parent_id' },
            },
            driver_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: { model: 'Driver', key: 'driver_id' },
            },
            status: { type: DataTypes.STRING, allowNull: false, unique: false },
        },
        tableConfig,
    )

    return Student
}

export default Student
