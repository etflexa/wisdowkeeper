import { createUploadURL } from "../services/file/createUploadURL.js";
import { deleteFile } from "../services/file/deleteFile.js";
import { createCategory } from "../services/solution/createCategory.js";
import { createSolution } from "../services/solution/createSolution.js";
import { deleteSolution } from "../services/solution/deleteSolution.js";
import { listAllSolutionByEnterprise } from "../services/solution/listAllSolutionByEnterprise.js";
import { listAllSolutionByUser } from "../services/solution/listAllSolutionsByUser.js";
import { listCategories } from "../services/solution/listCategories.js";
import { listSolutionById } from "../services/solution/listSolutionById.js";
import { updateSolution } from "../services/solution/updateSolution.js";

async function createCategoryController(req, res, next) {
  try {
    let data = req.body;
    data.enterpriseId = req.enterprise._id;
    const result = await createCategory(data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function listCategoriesController(req, res, next) {
  try {
    let data = {};
    data.enterpriseId = req.params.id;
    const result = await listCategories(data);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function createSolutionController(req, res, next) {
  try {
    let data = req.body;
    data.userId = req.userId._id;
    const result = await createSolution(data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function listAllSolutionByEnterpriseController(req, res, next) {
  try {
    let data = req.query;
    data.enterpriseId = req.params.enterpriseId;
    const result = await listAllSolutionByEnterprise(data);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function listAllSolutionByUserController(req, res, next) {
  try {
    let data = req.query;
    data.enterpriseId = req.params.enterpriseId;
    data.userId = req.params.userId;
    const result = await listAllSolutionByUser(data);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function listSolutionByIdController(req, res, next) {
  try {
    let data = {};
    data.enterpriseId = req.params.enterpriseId;
    data.solutionId = req.params.solutionId;
    const result = await listSolutionById(data);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateSolutionController(req, res, next) {
  try {
    let data = req.body;
    data.userId = req.userId._id;
    const result = await updateSolution(data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteSolutionController(req, res, next) {
  try {
    let data = {};
    data.authId = req.auth._id;
    data.userId = req.params.userId;
    data.enterpriseId = req.params.enterpriseId;
    data.solutionId = req.params.solutionId;
    await deleteSolution(data);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function createUploadURLController(req, res, next) {
  try {
    const data = req.body;
    const result = await createUploadURL(data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteFileController(req, res, next) {
  try {
    const data = req.body;
    const result = await deleteFile(data);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export {
  createCategoryController,
  listCategoriesController,
  createSolutionController,
  listAllSolutionByEnterpriseController,
  listAllSolutionByUserController,
  listSolutionByIdController,
  updateSolutionController,
  deleteSolutionController,
  createUploadURLController,
  deleteFileController
};
