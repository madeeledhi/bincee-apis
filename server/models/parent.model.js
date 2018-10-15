import { tableConfig } from '../utils'
/**
 * Student Schema
 */
const Parent = (sequelize, DataTypes) => {
    const Parent = sequelize.define(
        'Parent',
        {
            parent_id: {
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
            address: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            email: { type: DataTypes.STRING, allowNull: false, unique: false },
            lat: { type: DataTypes.DOUBLE, allowNull: true, unique: false },
            lng: { type: DataTypes.DOUBLE, allowNull: true, unique: false },
            status: { type: DataTypes.STRING, allowNull: false, unique: false },
            photo: { type: DataTypes.STRING, allowNull: false, unique: false },
            school_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: { model: 'School', key: 'school_id' },
            },
        },
        tableConfig,
    )

    return Parent
}

export default Parent
