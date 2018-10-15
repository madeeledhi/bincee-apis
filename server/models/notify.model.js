import { tableConfig } from '../utils'

/**
 Notify */
const Notify = (sequelize, DataTypes) => {
    const Notify = sequelize.define(
        'Notify',
        {
            student_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true,
                references: { model: 'Student', key: 'id' },
                primaryKey: true,
            },
            anouncement_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true,
                references: { model: 'Announcement', key: 'id' },
                primaryKey: true,
            },
        },
        tableConfig,
    )

    return Notify
}

export default Notify
