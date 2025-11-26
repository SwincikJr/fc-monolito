import { Model, Table, PrimaryKey, Column, HasMany } from "sequelize-typescript";
import { OrderProductModel } from "./order-product.model";

@Table({
  tableName: 'order',
  timestamps: false
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false, field: 'client_id' })
  clientId: string;

  @Column({ allowNull: false })
  status: string;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;

  @HasMany(() => OrderProductModel)
  products?: OrderProductModel[]
}