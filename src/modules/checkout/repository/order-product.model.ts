import { Model, Table, Column, ForeignKey, PrimaryKey } from "sequelize-typescript";
import { OrderModel } from "./order.model";

@Table({
  tableName: 'order_product',
  timestamps: false
})
export class OrderProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;
  
  @Column({ allowNull: false, field: 'order_id' })
  @ForeignKey(() => OrderModel)
  orderId: string;

  @Column({ allowNull: false, field: 'product_id' })
  productId: string;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}