import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('transaction', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    order_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'order',
            key: 'id'
        },
    
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('transaction')
}