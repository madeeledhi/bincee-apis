import { tableConfig } from '../utils'

/**
 * Announcement Schema
 */
const Announcement = (sequelize, DataTypes) => {
    const Announcement = sequelize.define(
        'Announcement',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            last_updated: {
                type: DataTypes.DATE,
                allowNull: false,
                unique: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false,
            },
            type: { type: DataTypes.STRING, allowNull: true, unique: false },
            school_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
                references: { model: 'School', key: 'school_id' },
            },
        },
        tableConfig,
    )

    return Announcement
}

export default Announcement
