import { tableConfig } from '../utils'
/**
 * Shift Schema
 */
const Shift = (sequelize, DataTypes) => {
    const Shift = sequelize.define(
        'Shift',
        {
            shift_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            shift_name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            start_time: { type: DataTypes.TIME, allowNull: false },
            end_time: { type: DataTypes.TIME, allowNull: false },
            school_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true,
                references: { model: 'School', key: 'school_id' },
            },
        },
        tableConfig,
    )

    return Shift
}

export default Shift
