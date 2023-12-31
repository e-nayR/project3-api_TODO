//requisições
const db = require("../models/index");

// list all users
const getAll = async (req, res) => {
  await db.User.findAll({
    attributes: ["id", "name"],
  })
    .then((list) => {
      res.status(200).send(list);
    })
    .catch((err) => {
      res.status(503).send(err);
    });
};

//create a new user
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password) || (name && email && password) == "") {
    return res.status(400).json({
      message: "campos inválidos",
    });
  }

  const findMail = await db.User.findOne({
    where: {
      email: email,
    },
  });

  if (!findMail) {
    await db.User.create({ name, email, password })
      .then((result) => {
        // console.log("Created User");
        res.status(201).json({
          message: "Novo user criado com sucesso!",
          user: result.name,
        });
      })
      .catch((err) => {
        res.status(422).json(err);
      });
  } else {
    return res.status(400).json({
      message: "não foi possível o cadastro",
    });
  }
};

// update username
const updateName = async (req, res) => {
  const id = req.userId;
  await db.User.update(
    { name: req.body.name },
    {
      where: {
        id: id,
      },
    }
  )
    .then((changesUsuario) => {
      return res.status(200).json({
        message: "User atualizado!",
      });
    })
    .catch((err) => {
      return res.status(422).json({
        message: err,
      });
    });
};

//get all info about the user
const detailUser = async (req, res) => {
  const id = req.userId;
  const user = await db.User.findOne({
    where: {
      id: id,
    },
  });
  if (user == null) {
    return res.status(404).json({
      user: "Esse user não existe",
    });
  }
  return res.status(200).json({
    user: user,
  });
};

// delete user by id
const deleteUser = async (req, res) => {
  const id = req.userId;
  const user = await db.User.findOne({
    where: {
      id: id,
    },
  });
  if (user == null) {
    return res.status(404).json({
      message: "Esse user não existe",
    });
  }
  await db.User.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      return res.status(200).json({
        message: "Usuário apagado",
      });
    })
    .catch(() => {
      return res.status(405).json({
        message: "error!",
      });
    });
};

module.exports = {
  getAll,
  createUser,
  updateName,
  detailUser,
  deleteUser,
};
