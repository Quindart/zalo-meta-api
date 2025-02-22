import { HTTP_STATUS } from "../../constants/index.js";
import User from "../../infrastructure/mongo/model/User.js";
import Error from "../../utils/errors.js";
import { responseEntity } from "../../utils/query.js";

class UserController {
  //TODO: [GET]
  async getUserById(req, res) {
    try {
      const id = req.params.id;
      const { queries } = req.query;
      const user = await User.findById(id)
        .select(responseEntity(queries))
        .lean();

      if (!user) {
        return Error.sendNotFound(res, "No user found");
      }
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Get user by id success",
        user,
      });
    } catch (error) {
      Error.sendError(res, error);
    }
  }
  async getUsers(req, res) {
    try {
      const { queries } = req.query;
      const users = await User.find().select(responseEntity(queries)).lean();
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Get all users success",
        users,
        params: {
          totalItems: users.length,
        },
      });
    } catch (error) {
      Error.sendError(res, error);
    }
  }
  //TODO: [POST]
  async createUser(req, res) {
    try {
      const {
        email,
        password,
        phone,
        firstName,
        lastName,
        avatar,
        dateOfBirth,
      } = req.body;

      const user = await User.create({
        email,
        password,
        phone,
        firstName,
        lastName,
        avatar,
        dateOfBirth,
        isTwoFactorAuthenticationEnabled: true,
      }).lean();

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        success: true,
        message: "Create user success",
        user,
      });
    } catch (error) {
      Error.sendError(res, error);
    }
  }
  //TODO: [PUT]
  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const { email, phone, firstName, lastName } = req.body;

      const oldUser = await User.findById(id).select(_id).lean();

      if (!oldUser) {
        return Error.sendNotFound(res, "No user found");
      }
      const user = await User.findByIdAndUpdate(
        id,
        {
          email,
          phone,
          firstName,
          lastName,
        },
        {
          new: true,
        }
      ).lean();

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        success: true,
        message: "Update user success",
        user,
      });
    } catch (error) {
      Error.sendError(res, error);
    }
  }
  //TODO: [DELETE]
  async deleteUser(req, res) {
    try {
      const id = req.params.id;

      const user = await User.findById(id).select(_id);

      if (!user) {
        return Error.sendNotFound(res, "No user found");
      }
      user.deleteOne();

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        success: true,
        message: "Delete user success",
        user,
      });
    } catch (error) {
      Error.sendError(res, error);
    }
  }
}

export default new UserController();
