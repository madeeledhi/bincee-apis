import { tableConfig } from '../utils'
/**
 * Leaves Schema
 */
const Leaves = (sequelize, DataTypes) => {
    const Leaves = sequelize.define(
        'Leaves',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            from_date: {
                type: DataTypes.DATE,
                allowNull: false,
                unique: false,
            },
            to_date: { type: DataTypes.DATE, allowNull: false, unique: false },
            comment: {type: DataTypes.STRING, alowNull: true, unique: false },
            student_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: { model: 'Student', key: 'id' },
            },
            school_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: { model: 'School', key: 'school_id' },
            },
        },
        tableConfig,
    )

    return Leaves
}

export default Leaves
