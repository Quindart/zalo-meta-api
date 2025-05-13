import { Request, Response } from "express";

import { HTTP_STATUS } from "../../constants/index";
import User from "../../infrastructure/mongo/model/User";
import Error from "../../utils/errors";
import { responseEntity } from "../../utils/query";
import bcrypt from 'bcrypt';
import { IFriendService } from "../../application/interfaces/services/IFriendService";
import TYPES from "../../infrastructure/inversify/type";
import { container } from "../../infrastructure/inversify/container";
import { RequestUser } from "../../types/request/RequestUser";

class UserController {
  private friendService: IFriendService
  constructor() {
    this.friendService = container.get<IFriendService>(TYPES.FriendService)
  }
  //TODO: [GET]

  async getUserById(req: RequestUser, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { queries } = req.query;
      const user = await User.findById(id)
        .select(responseEntity(queries))
        .lean();

      if (!user) {
        Error.sendNotFound(res, "No user found");
      }
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Get user by id success",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          avatar: user.avatar,
          dateOfBirth: user.dateOfBirth,
        },
      });
    } catch (error) {
      Error.sendError(res, error);
    }
  }
  async getUserByPhone(req: RequestUser, res: Response): Promise<void> {
    try {
      const phone = req.params.phone;
      const { queries } = req.query;
      const user = await User.findOne({ phone: phone })
        .select(responseEntity(queries))
        .lean();
      if (!user) {
        Error.sendNotFound(res, "No user found");
      }
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Get user by phone success",
        user,
      });
    } catch (error) {
      Error.sendError(res, error);
    }
  }
  async getUsers(req: RequestUser, res: Response): Promise<void> {
    try {
      const { queries } = req.query;
      const users = await User.find().select(responseEntity(queries)).lean();
      res.status(HTTP_STATUS.OK).json({
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
  async getMe(req: RequestUser, res: Response): Promise<void> {
    try {
      const userRequest = req.user
      const { queries } = req.query;
      const user = await User.findById(userRequest.id).select(responseEntity(queries)).lean();
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        success: true,
        message: "Get all users success",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          avatar: user.avatar,
          dateOfBirth: user.dateOfBirth,
        },
      });
    } catch (error) {
      Error.sendError(res, error)
    }
  }
  //TODO: [POST]
  async createUser(req: RequestUser, res: Response): Promise<void> {
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
        Error.sendConflict(res, "Phone number already exist!")
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

      res.status(HTTP_STATUS.CREATED).json({
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
  async updateMe(req: RequestUser, res: Response): Promise<void> {
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

      res.status(HTTP_STATUS.CREATED).json({
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
  async changePassword(req: RequestUser, res: Response): Promise<void> {
    try {
      const user = req.user
      const id = user.id
      const { password, newPassword } = req.body

      const oldUser = await User.findById(user.id)

      const isPasswordValids = await bcrypt.compare(password, oldUser.password);

      if (!isPasswordValids) {
        Error.sendUnauthenticated(res)
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(id, {
        password: hashedPassword
      }, {
        new: true,
      }).select(id).lean()

      res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        success: true,
        message: 'Change password success',
      })

    } catch (error) {
      Error.sendError(res, error)
    }
  }
  //TODO: [PUT]
  async updateUser(req: RequestUser, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { email, phone, firstName, lastName } = req.body;
      const oldUser = await User.findById(id).select({ '_id': 1 }).lean();

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

      res.status(HTTP_STATUS.CREATED).json({
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
  async deleteUser(req: RequestUser, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const user = await User.findById(id).select({ '_id': 1 });

      if (!user) {
        Error.sendNotFound(res, "No user found");
      }
      user.deleteOne();

      res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        success: true,
        message: "Delete user success",
        user,
      });
    } catch (error) {
      Error.sendError(res, error);
    }
  }
  async searchUserWithFriends(req: RequestUser, res: Response): Promise<void> {
    const { type, keywords } = req.query
    const user = req.user
    const userId = user.id
    if (!type || !keywords) {
      return Error.sendConflict(res, "Type and keywords are required")
    }
    const searchQuery = {
      [`${type}`]: { $regex: keywords, $options: "i" }
    };

    const userFriendListIds = (await this.friendService.getFriendByUserId(userId)).map(user => user.id.toString())
    const users = await User.find(searchQuery).select({
      avatar: 1,
      id: 1,
      firstName: 1,
      lastName: 1,
      phone: 1,
      email: 1
    }).lean()

    const usersFilter = users.filter(user => user._id.toString() !== userId).map(user => {
      return {
        ...user,
        isFriend: userFriendListIds.includes(user._id.toString())
      }
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Search by type: ${type} and keywords ${keywords}`,
      users: usersFilter,
      totalItems: usersFilter.length
    })
  }

  async searchUsers(req: RequestUser, res: Response): Promise<void> {
    const { type, keywords } = req.query
    const searchQuery = {
      [`${type}`]: { $regex: keywords, $options: "i" }
    };

    const users = await User.find(searchQuery).select({
      avatar: 1,
      id: 1,
      firstName: 1,
      lastName: 1,
      phone: 1,
      email: 1
    }).lean()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Search by type: ${type} and keywords ${keywords}`,
      users,
      totalItems: users.length
    })
  }
}

export default new UserController();
