import models from "../models/indexModels";

const checkoutOrder = async (req, res) => {
  // get data carts
  const { cart_id } = req.params;
  const cart = await req.context.models.carts.findByPk(cart_id);

  // get data user
  const { cart_user_id } = cart.dataValues;
  const user = await req.context.models.users.findByPk(cart_user_id);

  // get data line items by cart_id
  const lineItems = await req.context.models.line_items.findAll({
    where: {
      lite_cart_id: cart_id
    }
  })

  // destructuring object, varTax and varDisc in percent %
  const { address, city } = req.body;
  const varDisc = req.body.varDisc || 0;
  const varTax = req.body.varTax || 0;
  const { user_id, user_phone } = user.dataValues;
  let orderDate = new Date();
  let total_qty = 0;
  let subtotal = 0;

  lineItems.forEach(el => {
    total_qty += el.dataValues.lite_qty;
    subtotal += parseInt(el.dataValues.lite_total_price);
  });

  const discount = subtotal * varDisc / 100;
  const tax = (subtotal - discount) * varTax / 100;
  const total_due = (subtotal - discount) + tax;

  try {
    const order = await req.context.models.orders.create({
      order_createdon: orderDate,
      order_total_qty: total_qty,
      order_subtotal: subtotal,
      order_discount: discount,
      order_tax: tax,
      order_total_due: total_due,
      order_address: address,
      order_phone: user_phone,
      order_city: city,
      order_status: "ORDERED",
      order_user_id: user_id
    })

    await req.context.models.line_items.update(
      {
        lite_status: "ORDERED",
        lite_order_name: order.order_name
      },
      {
        where: {
          lite_cart_id: cart_id
        }
      }
    )
    await req.context.models.carts.update(
      { cart_status: "ORDERED" },
      {
        where: {
          cart_id: cart_id
        }
      }
    )

    return res.status(200).json({
      message: "Transaction Success"
    })
  } catch (error) {

  }
}


export default { checkoutOrder }