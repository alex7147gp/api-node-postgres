const { Model, DataTypes, Sequelize } = require('sequelize');


const { CATEGORY_TABLE } = require('./category.model')


const ORDER_TABLE = 'order';

const OrderSchema = {
  	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER
	},
    customerId: {
        field: 'customer_id',
		allowNull: false,
		type: DataTypes.INTEGER,
		unique: true,
		references: {
			model: CUSTOMER_TABLE,
            key: 'id'
		},
    }
	createdAt: {
		sllowNull: false,
		type: DataTypes.DATE,
		field: 'create_at',
		defaultValue: Sequelize.NOW
	},
	total: {
      type: DataTypes.VIRTUAL,
      get() {
      	if (this.items.length > 0) {
          return this.items.reduce((total, item) => {
          	return total + (item.price * item.OrderProduct.amount);
          }, 0); 
      	}
      	return 0;
      }
	}
}

class Order extends Model {
	static associate(models) {
		this.belongsTo(models.Customer, {as: 'customer'});
		this.belongsToMany(models.Product, {
          as: 'items',
          through: models.OrderProduct,
          foreignKey: 'orderId',
          otherKey: 'productId'
		})
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: ORDER_TABLE,
			modelName: 'Order',
			timestamps: false
		}
	}
}



module.exports = { ORDER_TABLE, OrderSchema, Order };