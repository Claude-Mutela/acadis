import vine from '@vinejs/vine'

export const planningValidator = vine.compile(
  vine.object({
    cohortId: vine.number().positive(),
    programId: vine.number().positive(),
    startDate: vine.date(),
    endDate: vine.date(),
    type: vine.enum(['présentiel', 'en ligne', 'hybride']),
    capacity: vine.number().min(0).optional(),
    status: vine.enum(['Inscriptions', 'En cours', 'Terminé', 'Annulé']).optional()
  })
)
