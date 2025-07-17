import swaggerJSDoc from "swagger-jsdoc";
import { createEnterpriseDoc } from "./docs/enterprise/create.js";
import { loginEnterpriseDoc } from "./docs/enterprise/login.js";
import { listEnterpriseByIdDoc } from "./docs/enterprise/listById.js";
import { softDeleteEnterpriseDoc } from "./docs/enterprise/softDelete.js";
import { createUserEnterpriseDoc } from "./docs/enterprise/createUser.js";
import { sendAccessCredentialsToUserDoc } from "./docs/enterprise/sendAccessCredentialsToUser.js";
import { listAllUsersEnterpriseDoc } from "./docs/enterprise/listAllUsers.js";
import { updateUserEnterpriseDoc } from "./docs/enterprise/updateUser.js";
import { listUserByIdDoc } from "./docs/enterprise/listUserById.js";
import { deleteUserEnterpriseDoc } from "./docs/enterprise/deleteUser.js";
import { loginUserDoc } from "./docs/user/login.js";
import { createCategoryDoc } from "./docs/solution/createCategory.js";
import { listCategoriesDoc } from "./docs/solution/listCategories.js";
import { createSolutionDoc } from "./docs/solution/createSolution.js";
import { listSolutionsEnterpriseDoc } from "./docs/solution/listAllSolutionsByEnterprise.js";
import { listUserSolutionsDoc } from "./docs/solution/listAllSolutionsByUser.js";
import { listSolutionByIdDoc } from "./docs/solution/listSolutionById.js";
import { updateSolutionDoc } from "./docs/solution/updateSolution.js";
import { deleteSolutionDoc } from "./docs/solution/deleteSolution.js";
import { createUploadUrlDoc } from "./docs/file/createUploadURL.js";
import { deleteFileDoc } from "./docs/file/deleteFile.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API WisdowKeeper",
      version: "1.0.0",
      description: "Documentação WisdowKeeper",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/api/enterprises": {
        ...createEnterpriseDoc["/api/enterprises"],
      },
      "/api/enterprises/login": {
        ...loginEnterpriseDoc["/api/enterprises/login"],
      },
      "/api/enterprises/{id}": {
        ...listEnterpriseByIdDoc["/api/enterprises/{id}"],
        ...softDeleteEnterpriseDoc["/api/enterprises/{id}"],
      },
      "/api/enterprises/{id}/users": {
        ...createUserEnterpriseDoc["/api/enterprises/{id}/users"],
        ...listAllUsersEnterpriseDoc["/api/enterprises/{id}/users"],
        ...updateUserEnterpriseDoc["/api/enterprises/{id}/users"],
        ...deleteUserEnterpriseDoc["/api/enterprises/{id}/users"],
      },
      "/api/enterprises/{id}/users/{userId}": {
        ...listUserByIdDoc["/api/enterprises/{id}/users/{userId}"],
      },
      "/api/enterprises/{id}/users/credentials": {
        ...sendAccessCredentialsToUserDoc[
          "/api/enterprises/{id}/users/credentials"
        ],
      },
      "/api/users/login": {
        ...loginUserDoc["/api/users/login"],
      },
      "/api/solutions/categories/enterprises/{id}": {
        ...createCategoryDoc["/api/solutions/categories/enterprises/{id}"],
        ...listCategoriesDoc["/api/solutions/categories/enterprises/{id}"],
      },
      "/api/solutions/users/{id}": {
        ...createSolutionDoc["/api/solutions/users/{id}"],
        ...updateSolutionDoc["/api/solutions/users/{id}"],
      },
      "/api/solutions/{solutionId}/auth/{id}/enterprises/{enterpriseId}/users/{userId}":
        {
          ...deleteSolutionDoc[
            "/api/solutions/{solutionId}/auth/{id}/enterprises/{enterpriseId}/users/{userId}"
          ],
        },
      "/api/solutions/auth/{id}/enterprises/{enterpriseId}": {
        ...listSolutionsEnterpriseDoc[
          "/api/solutions/auth/{id}/enterprises/{enterpriseId}"
        ],
      },
      "/api/solutions/auth/{id}/enterprises/{enterpriseId}/users/{userId}": {
        ...listUserSolutionsDoc[
          "/api/solutions/auth/{id}/enterprises/{enterpriseId}/users/{userId}"
        ],
      },
      "/api/solutions/{solutionId}/auth/{id}/enterprises/{enterpriseId}": {
        ...listSolutionByIdDoc[
          "/api/solutions/{solutionId}/auth/{id}/enterprises/{enterpriseId}"
        ],
      },
      "/api/solutions/auth/{id}/file-url": {
        ...createUploadUrlDoc["/api/solutions/auth/{id}/file-url"],
        ...deleteFileDoc["/api/solutions/auth/{id}/file-url"],
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
