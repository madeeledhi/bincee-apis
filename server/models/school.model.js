import { tableConfig } from '../utils'
/**
 * School Admin Schema
 */
const School = (sequelize, DataTypes) => {
    const School = sequelize.define(
        'School',
        {
            school_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: { model: 'User', key: 'id' },
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            phone_no: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            licenses: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
            },
            lat: { type: DataTypes.DOUBLE, allowNull: true, unique: false },
            lng: { type: DataTypes.DOUBLE, allowNull: true, unique: false },
        },
        tableConfig,
    )

    return School
}

export default School
