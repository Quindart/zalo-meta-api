import { HTTP_STATUS } from "../../constants/index.js";
import User from "../../infrastructure/mongo/model/User.js";
import Error from "../../utils/errors.js";
import { responseEntity } from "../../utils/query.js";
import bcrypt from 'bcrypt';

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
  async getUserByPhone(req, res) {
    try {
      const phone = req.params.phone;
      const { queries } = req.query;
      const user = await User.findOne({ phone: phone })
        .select(responseEntity(queries))
        .lean();
      if (!user) {
        return Error.sendNotFound(res, "No user found");
      }
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Get user by phone success",
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
  async getMe(req, res) {
    try {
      const userRequest = req.user
      const { queries } = req.query;
      const user = await User.findById(userRequest.id).select(responseEntity(queries)).lean();
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Get all users success",
        user,
      });
    } catch (error) {
      console.log("💲💲💲 ~ UserController ~ getMe ~ error:", error)
      Error.sendError(res, error)
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
        dateOfBirth,
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const avatar = req?.uploadedImages && req?.uploadedImages?.avatar ? req.uploadedImages?.avatar?.url : null;

      const oldUser = await User.findOne({ phone: phone }).lean()
      if (oldUser) {
        return Error.sendConflict(res, "Phone number already exist!")
      }
      const user = await User.create({
        email,
        password: hashedPassword,
        phone,
        firstName,
        lastName,
        avatar,
        dateOfBirth,
        isTwoFactorAuthenticationEnabled: true,
      });

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
  async updateMe(req, res) {
    try {
      const file = req.uploadedImages ? req.uploadedImages : null
      const id = req.user.id;
      const { firstName, lastName, dateOfBirth } = req.body;

      const oldUser = await User.findById(id).select(id).lean();

      if (!oldUser) {
        return Error.sendNotFound(res, "No user found");
      }

      const bodyRequest = file ? {
        firstName,
        lastName,
        dateOfBirth,
        avatar: file?.avatar?.url
      } : {
        firstName,
        lastName,
        dateOfBirth,
      }
      const user = await User.findByIdAndUpdate(
        id,
        {
          ...bodyRequest
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
  //TODO: [PUT]
  async changePassword(req, res) {
    try {
      const user = req.user
      const id = user.id
      const { password, newPassword } = req.body

      const oldUser = await User.findById(user.id)

      const isPasswordValids = await bcrypt.compare(password, oldUser.password);

      if (!isPasswordValids) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          success: false,
          message: 'Invalid password'
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(id, {
        password: hashedPassword
      }, {
        new: true,
      }).select(id).lean()

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        success: true,
        message: 'Change password success',
      })

    } catch (error) {
      Error.sendError(res, error)
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

  async searchUsers(req, res) {
    const { type, keywords } = req.query
    const searchQuery = {
      [type]: { $regex: keywords, $options: "i" }
    };

    const users = await User.find(searchQuery).select({
      avatar: 1,
      id: 1,
      firstName: 1,
      lastName: 1,
      phone: 1,
      email: 1
    }).lean()

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Search by type: ${type} and keywords ${keywords}`,
      users,
      totalItems: users.length
    })
  }
}

export default new UserController();
