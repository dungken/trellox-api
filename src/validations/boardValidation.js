import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  /**
   * Note: Mặc định chúng ta không cần phải custom message ở phía BE làm gì vì để cho Front-end tự validate và custome message cho phù hợp với người dùng.
   * Backedn chỉ cần validata đảm bảo dữ liệu đầu vào hợp lệ, và trả về message mặc định từ thư viện Joi.
   * Quan trọng: Việc validate dữ liệu Bắt buộc phải có ở phía backend vì đây là điểm cuối để chúng ta kiểm soát dữ liệu trước khi lưu vào database.
   * Và thông thường trong thực tế, điều tốt nhất là phải validate ở cả phía backend và frontend.
   */
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    // .message({
    //   'any.required': 'Title is required (dungkendev)',
    //   'string.empty': 'Title is not allowed to be empty (dungkendev)',
    //   'string.min': 'Title min 3 chars (dungkendev)',
    //   'string.max': 'Title max 50 chars (dungkendev)',
    //   'string.trim': 'Title cannot have leading or trailing whitespace (dungkendev)'
    // }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(...Object.values(BOARD_TYPES)).required()
  })

  try {
    // Chi dinh abortEarly: false de hien thi tat ca loi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Validate du lieu thanh cong thi request di tiep sang Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(...Object.values(BOARD_TYPES))
    // columnOrderIds: Joi.array().items(
    //   Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    // ).default([])
  })

  try {
    // Chi dinh abortEarly: false de hien thi tat ca loi
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true // Cho phep request co them cac truong khac khong duoc dinh nghia trong schema
    })
    // Validate du lieu thanh cong thi request di tiep sang Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array().required().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
    nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().required().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })
  try {
    // Chi dinh abortEarly: false de hien thi tat ca loi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Validate du lieu thanh cong thi request di tiep sang Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew,
  update,
  moveCardToDifferentColumn
}
