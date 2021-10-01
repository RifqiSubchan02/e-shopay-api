const findAllLineItems = async (req, res) => {
  const result = await req.context.models.line_items.findAll();
  return res.send(result);
}

const addLineItem = async (req, res) => {
  const { lite_prod_id, lite_qty } = await req.body;

  const product = await req.context.models.products.findAll({
    where: {
      prod_id: lite_prod_id
    }
  })

  const { prod_id, prod_price } = product[0];
  const { cart_id } = req.cart;
  const total_price = parseInt(prod_price) * lite_qty;

  await req.context.models.line_items.create({
    lite_prod_id: prod_id,
    lite_cart_id: cart_id,
    lite_qty: lite_qty,
    lite_price: prod_price,
    lite_total_price: total_price,
    lite_status: "OPEN"
  })
    .then(product => res.status(200).json({ message: "Add to Cart Success", product }))
    .catch(error => res.status(400).json({ errors: error.errors }));
}

const findLineItemsByCartId = async (req, res, next) => {
  const { cart_id } = req.params;

  try {
    const result = await req.context.models.line_items.findAll({
      where: {
        lite_cart_id: cart_id
      }
    })

    req.line_items = result;
    next();
  } catch (error) {
    return res.json(error)
  }
}

const updateLineItemsQuantity = async (req, res) => {
  const { cart_id } = req.params;
  const { lite_prod_id, lite_qty } = req.body;

  if (lite_qty <= 0) {
    return res.json({
      message: "Minimum quantity is 1"
    })
  }

  try {
    const line_items = await req.context.models.line_items.findAll({
      where: {
        lite_cart_id: cart_id,
        lite_prod_id: lite_prod_id
      }
    })

    const price = parseInt(line_items[0].lite_price);
    const totalPrice = price * lite_qty;

    const result = await req.context.models.line_items.update(
      {
        lite_qty: lite_qty,
        lite_total_price: totalPrice
      },
      {
        where: {
          lite_cart_id: cart_id,
          lite_prod_id: lite_prod_id
        }
      })

    return res.json({
      message: `Update line item by prod_id = ${lite_prod_id} and ccart_id = ${cart_id} Success`,
      result
    })

  } catch (error) {
    return res.status(400).json(error)
  }
}

const deleteLineItem = async (req, res) => {
  const { cart_id } = req.params;
  const { prod_id } = req.body;

  await req.context.models.line_items.destroy({
    where: {
      lite_cart_id: cart_id,
      lite_prod_id: prod_id
    }
  })
    .then(result => res.json({ message: `Remove ${result} Product with ID ${prod_id} from Cart list` }))
    .catch(error => res.json(error));
}

export default { findAllLineItems, addLineItem, findLineItemsByCartId, updateLineItemsQuantity, deleteLineItem };