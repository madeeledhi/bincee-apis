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
            registration_no: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false,
            },
            driver_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true,
                references: { model: 'Driver', key: 'driver_id' },
            },
        },
        tableConfig,
    )

    return Bus
}

export default Bus
