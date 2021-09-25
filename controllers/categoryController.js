import { sequelize } from "../models/indexModels";

const findAllCategory = async (req, res) => {
  try {
    const result = await req.context.models.categories.findAll();
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
}

const findCategoryBySQL = async (req, res) => {
  try {
    const result = await sequelize.query("select cate_id, cate_name from categories", {
      type: sequelize.QueryTypes.SELECT,
      model: req.context.models.categories,
      mapToModel: true
    })
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
}

const findCategoryById = async (req, res) => {
  const { cate_id } = req.params;
  try {
    const result = await req.context.models.categories.findByPk(cate_id);
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
}

const createCategory = async (req, res) => {
  const { cate_name } = req.body;
  try {
    const result = await req.context.models.categories.create({ cate_name })
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
}

const updateCategory = async (req, res) => {
  const { cate_id } = await req.params;
  const { cate_name } = await req.body;
  try {
    const result = await req.context.models.categories.update({ cate_name }, {
      returning: true,
      where: {
        cate_id
      }
    });
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
}

const deleteCategory = async (req, res) => {
  const { cate_id } = await req.params;
  await req.context.models.categories.destroy({
    where: {
      cate_id
    }
  })
    .then(result => {
      return res.status(200).json({ message: `${result} data has been deleted` })
    })
    .catch(error => {
      return res.sendStatus(500);
    })
}

export default { findCategoryBySQL, findAllCategory, findCategoryById, createCategory, updateCategory, deleteCategory };