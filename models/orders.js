const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    order_name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      primaryKey: true
    },
    order_createdon: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    order_total_qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_subtotal: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    order_discount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    order_tax: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    order_total_due: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    order_address: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    order_phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    order_city: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    order_status: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    order_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'orders',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "orders_pkey",
        unique: true,
        fields: [
          { name: "order_name" },
        ]
      },
    ]
  });
};
