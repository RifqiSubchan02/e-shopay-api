const findAllCart = async (req, res) => {
  try {
    const result = await req.context.models.carts.findAll();
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
}

const findCartByUserIdAndStatus = async (req, res) => {
  const { user_id } = req.params;

  const result = await req.context.models.carts.findAll({
    where: {
      cart_user_id: user_id,
      cart_status: "OPEN"
    }
  });
  return res.status(200).json(result);
};

const checkCartExist = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    // Check if cart is exist and status open by user id
    const cartExistAndOpen = await req.context.models.carts.findAll({
      where: {
        cart_user_id: user_id,
        cart_status: "OPEN"
      }
    })

    // If no cart with status open then create cart
    if (cartExistAndOpen.length === 0) {
      await req.context.models.carts.create({
        cart_createdon: new Date(),
        cart_status: "OPEN",
        cart_user_id: user_id
      })
        .then(result => {
          req.cart = {
            message: "New Cart ID",
            cart_id: result.cart_id
          }

          // Next to middleware function
          next();
        })
        .catch(error => res.status(400).json({ error }));
    } else {
      // update date created in existing cart
      await req.context.models.carts.update(
        { cart_createdon: new Date() },
        { where: { cart_id: cartExistAndOpen[0].dataValues.cart_id } }
      )
      req.cart = {
        message: "Existing Cart ID",
        cart_id: cartExistAndOpen[0].dataValues.cart_id
      };

      // Next to middleware function
      next();
    }
  } catch (error) {
    return res.sendStatus(400).send(error);
  }
}

export default { findAllCart, findCartByUserIdAndStatus, checkCartExist };