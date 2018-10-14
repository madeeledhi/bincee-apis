import { tableConfig } from '../utils'
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
            status: { type: DataTypes.STRING, allowNull: false, unique: false },
            phone_no: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
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

    return Driver
}

export default Driver
