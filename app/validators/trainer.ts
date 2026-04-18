import vine from '@vinejs/vine'

export const createTrainerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().email().trim().toLowerCase().unique({ table: 'users', column: 'email' }),
    gender: vine.enum(['M', 'F']),
    title: vine.string().trim().minLength(2),
    homeChurch: vine.string().trim().minLength(2),
    specialization: vine.string().trim().minLength(2),
  })
)

export const updateTrainerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().email().trim().toLowerCase(), // unique check is harder on update, will handle in controller or via vine unique rule with ignore
    gender: vine.enum(['M', 'F']),
    title: vine.string().trim().minLength(2),
    homeChurch: vine.string().trim().minLength(2),
    specialization: vine.string().trim().minLength(2),
  })
)
