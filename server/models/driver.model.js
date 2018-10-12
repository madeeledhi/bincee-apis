import { tableConfig } from '../utils/dbUtils'
/**
 * Driver Schema
 */
const Driver = (sequelize, DataTypes) => {
    const Driver = sequelize.define(
        'Driver',
        {
            driver_id: {
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
            bus_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                references: { model: 'Bus', key: 'id' },
            },
        },
        tableConfig,
    )

    return Driver
}

export default Driver
