import { tableConfig } from '../utils'

/**
 * Bus Schema
 */
const Bus = (sequelize, DataTypes) => {
    const Bus = sequelize.define(
        'Bus',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            registeration_no: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false,
            },
            school_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true,
                references: { model: 'School', key: 'school_id' },
            },
        },
        tableConfig,
    )

    return Bus
}

export default Bus
