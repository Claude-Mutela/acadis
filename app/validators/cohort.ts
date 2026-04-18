import vine from '@vinejs/vine'

export const createCohortValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(3),
        slug: vine.string().trim().minLength(3),
        startDate: vine.date(),
        endDate: vine.date(),
    })
)
