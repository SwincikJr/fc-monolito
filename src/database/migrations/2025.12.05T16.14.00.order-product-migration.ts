import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('order_product', {
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
        }
    },
    product_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'product',
            key: 'id'
        }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('order_product')
}