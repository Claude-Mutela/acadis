import vine from '@vinejs/vine'

export const studentProfileValidator = vine.compile(
  vine.object({
    gender: vine.string().trim(),
    homeChurch: vine.string().trim(),
    worker: vine.string().trim(),
    ministry: vine.string().trim().nullable().optional(),
    format: vine.string().trim(),
    physiqueAddress: vine.string().trim().nullable().optional(),
    phoneNumber: vine.string().trim().nullable().optional(),
    dateofbirth: vine.date().nullable().optional(),
  })
)
