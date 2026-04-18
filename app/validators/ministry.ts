import vine from '@vinejs/vine'

export const createMinistriesValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(3),
        description: vine.string().trim().minLength(10),
    })
)