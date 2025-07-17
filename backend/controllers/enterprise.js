import { createEnterprise } from "../services/enterprise/create.js";
import { createUserEnterprise } from "../services/enterprise/createUser.js";
import { deleteUser } from "../services/enterprise/deleteUser.js";
import { listAllUsers } from "../services/enterprise/listAllUsers.js";
import { listEnterpriseById } from "../services/enterprise/listById.js";
import { listUser } from "../services/enterprise/listUserById.js";
import { loginEnterprise } from "../services/enterprise/login.js";
import { sendAccessCredentialsToUser } from "../services/enterprise/sendAccessCredentialsToUser.js";
import { softDeleteEnterprise } from "../services/enterprise/softDelete.js";
import { updateUser } from "../services/enterprise/updateUser.js";

async function createEnterpriseController(req, res, next) {
  try {
    const data = req.body;
    const result = await createEnterprise(data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function loginEnterpriseController(req, res, next) {
  try {
    const data = req.body;
    const result = await loginEnterprise(data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function listEnterpriseController(req, res, next) {
  try {
    const enterpriseId = req.params.id;
    const result = await listEnterpriseById(enterpriseId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function softDeleteEnterpriseController(req, res, next) {
  try {
    const enterpriseId = req.enterprise._id;
    await softDeleteEnterprise(enterpriseId);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function createUserEnterpriseController(req, res, next) {
  try {
    let data = req.body;
    data.enterpriseId = req.enterprise._id;
    const result = await createUserEnterprise(data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function listAllUsersController(req, res, next) {
  try {
    let data = req.query;
    data.enterpriseId = req.enterprise._id;
    const result = await listAllUsers(data);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function listUserController(req, res, next) {
  try {
    let data = {};
    data.enterpriseId = req.params.id;
    data.userId = req.params.userId;
    const result = await listUser(data);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateUserController(req, res, next) {
  try {
    let data = req.body;
    data.enterpriseId = req.enterprise._id;
    const result = await updateUser(data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteUserController(req, res, next) {
  try {
    let data = req.body;
    data.enterpriseId = req.enterprise._id;
    await deleteUser(data);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function sendAccessCredentialsToUserController(req, res, next) {
  try {
    let data = req.body;
    data.enterpriseId = req.enterprise._id;
    const result = await sendAccessCredentialsToUser(data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export {
  createEnterpriseController,
  loginEnterpriseController,
  listEnterpriseController,
  softDeleteEnterpriseController,
  createUserEnterpriseController,
  listAllUsersController,
  listUserController,
  updateUserController,
  deleteUserController,
  sendAccessCredentialsToUserController
};
