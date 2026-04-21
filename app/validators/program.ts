import vine from '@vinejs/vine'

export const createProgramValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    categoryId: vine.number().optional().nullable(),
    trainerId: vine.number(),
    cohortId: vine.number().optional().nullable(),
    description: vine.string().trim().minLength(3).maxLength(255),
    presentation: vine.string().trim().minLength(10),
    duration: vine.string().trim().minLength(1),
    status: vine.enum(['active', 'pending'] as const).optional(),
    objectives: vine.array(vine.string().trim().minLength(3)),
    outputProfile: vine.array(vine.string().trim().minLength(3)),
    coverImage: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp']
    }).optional()
  })
)

export const updateProgramValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    categoryId: vine.number().optional().nullable(),
    trainerId: vine.number().optional().nullable(),
    cohortId: vine.number().optional().nullable(),
    description: vine.string().trim().minLength(3).maxLength(255).optional(),
    presentation: vine.string().trim().minLength(10).optional(),
    duration: vine.string().trim().minLength(1).optional(),
    status: vine.enum(['active', 'pending'] as const).optional(),
    objectives: vine.array(vine.string().trim().minLength(3)).optional(),
    outputProfile: vine.array(vine.string().trim().minLength(3)).optional(),
    coverImage: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp']
    }).optional().nullable()
  })
)
