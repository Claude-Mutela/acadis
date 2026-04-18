import vine from '@vinejs/vine'

export const createProgramCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),
    description: vine.string().trim().optional(),
  })
)

export const updateProgramCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),
    description: vine.string().trim().optional(),
  })
)
