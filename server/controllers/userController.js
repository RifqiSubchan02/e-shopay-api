import { sequelize } from "../models/indexModels";

const findAllUser = async (req, res) => {
  try {
    const result = await req.context.models.users.findAll();
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
}

const findUserBySQL = async (req, res) => {
  try {
    const result = await sequelize.query("select user_name from users", {
      type: sequelize.QueryTypes.SELECT,
      model: req.context.models.users,
      mapToModel: true
    })
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
}

const findUserById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await req.context.models.users.findByPk(user_id);
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
}

const createUser = async (req, res) => {
  const { user_name, user_firstname, user_lastname, user_email, user_password, user_phone } = req.body;
  try {
    const result = await req.context.models.users.create({ user_name, user_firstname, user_lastname, user_email, user_password, user_phone })
    return res.send(result);
  } catch (error) {
    return console.log(error);
  }
}

const updateUser = async (req, res) => {
  const { user_id } = await req.params;
  const { user_name, user_firstname, user_lastname, user_email, user_password, user_phone } = await req.body;
  try {
    const result = await req.context.models.users.update({ user_name, user_firstname, user_lastname, user_email, user_password, user_phone }, {
      returning: true,
      where: {
        user_id
      }
    });
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
}

const deleteUser = async (req, res) => {
  const { user_id } = await req.params;
  await req.context.models.users.destroy({
    where: {
      user_id
    }
  })
    .then(result => {
      return res.status(200).json({ message: `${result} data has been deleted` })
    })
    .catch(error => {
      return res.sendStatus(500);
    })
}

export default { findAllUser, findUserBySQL, findUserById, createUser, updateUser, deleteUser };