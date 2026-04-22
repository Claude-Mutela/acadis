import vine from '@vinejs/vine'

export const createModuleValidator = vine.compile(
  vine.object({
    programId: vine.number(),
    title: vine.string().trim().minLength(3),
    description: vine.string().trim().minLength(10),
    order: vine.number().min(1)
  })
)

export const updateModuleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    description: vine.string().trim().minLength(10),
    order: vine.number().min(1)
  })
)
