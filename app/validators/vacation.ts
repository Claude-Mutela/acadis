import vine from '@vinejs/vine'

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const

export const vacationValidator = vine.compile(
  vine.object({
    name: vine.enum(['Matin', 'Midi', 'Soir', 'Spécial', 'Intensive']),
    cohortId: vine.number(),
    programId: vine.number(),
    day: vine.enum(daysOfWeek),
    startTime: vine.string().trim().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: vine.string().trim().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  })
)
