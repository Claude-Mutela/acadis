import vine from '@vinejs/vine'

export const createProgramValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    categoryId: vine.number().optional().nullable(),
    trainerId: vine.number(), // Requis par la DB
    description: vine.string().trim().maxLength(255).optional().nullable(),
    presentation: vine.string().trim().optional().nullable(),
    duration: vine.string().trim().optional().nullable(),
    status: vine.enum(['active', 'pending'] as const).optional(),
    objectives: vine.array(vine.string()).optional(),
    outputProfile: vine.array(vine.string()).optional(),
    coverImage: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional()
  })
)

export const updateProgramValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    categoryId: vine.number().optional().nullable(),
    trainerId: vine.number().optional().nullable(),
    description: vine.string().trim().maxLength(255).optional().nullable(),
    presentation: vine.string().trim().optional().nullable(),
    duration: vine.string().trim().optional().nullable(),
    status: vine.enum(['active', 'pending'] as const).optional(),
    objectives: vine.array(vine.string()).optional(),
    outputProfile: vine.array(vine.string()).optional(),
    coverImage: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional().nullable()
  })
)
