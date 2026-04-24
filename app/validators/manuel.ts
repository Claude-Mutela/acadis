import vine from '@vinejs/vine'

export const createManuelValidator = vine.compile(
  vine.object({
    programId: vine.number(),
    title: vine.string().trim().minLength(2),
    description: vine.string().trim().minLength(5),
    price: vine.number().min(0),
    isPublished: vine.boolean().optional(),
    fileUrl: vine.string().trim().url().nullable().optional(),
  })
)

export const updateManuelValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(2),
    description: vine.string().trim().minLength(5),
    price: vine.number().min(0),
    isPublished: vine.boolean().optional(),
    fileUrl: vine.string().trim().url().nullable().optional(),
  })
)
