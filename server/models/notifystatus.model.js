import { tableConfig } from '../utils'
/**
 * School Admin Schema
 */
const NotifyStatus = (sequelize, DataTypes) => {
    const NotifyStatus = sequelize.define(
        'NotifyStatus',
        {
            parent_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                unique: false,
                references: { model: 'Parent', key: 'parent_id' },
            },
            announcement_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                unique: false,
                references: { model: 'Announcement', key: 'id' },
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: false,
            },
        },
        tableConfig,
    )

    return NotifyStatus
}

export default NotifyStatus
