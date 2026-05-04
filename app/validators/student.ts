import vine from '@vinejs/vine'

// Règles partagées
const email = () => vine.string().trim().email().maxLength(254)

// ── Création complète (User + StudentProfile + Enrollment) ──────────────────
export const storeStudentValidator = vine.compile(
  vine.object({
    // Compte utilisateur
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    email: email().unique({ table: 'users', column: 'email' }),
    password: vine.string().trim().minLength(6).maxLength(64),

    // Profil disciple (champs obligatoires selon le modèle)
    gender: vine.string().trim().in(['M', 'F']),
    homeChurch: vine.string().trim().minLength(2).maxLength(150),
    worker: vine.boolean(),
    ministry: vine.string().trim().maxLength(150).nullable().optional(),
    physiqueAddress: vine.string().trim().nullable().optional(),
    phoneNumber: vine.string().trim().minLength(8).maxLength(30),
    dateofbirth: vine.date({ formats: ['YYYY-MM-DD'] }).nullable().optional(),

    // Inscription académique
    planningId: vine.number().positive(),
    programIds: vine.array(vine.number().positive()),
    vacationId: vine.number().positive().nullable().optional(),
    status: vine.string().trim().in(['pending', 'confirmed', 'rejected', 'cancelled']),
  })
)

// ── Mise à jour partielle ───────────────────────────────────────────────────
export const updateStudentValidator = vine.compile(
  vine.object({
    // Compte utilisateur
    firstName: vine.string().trim().minLength(2).maxLength(100).optional(),
    lastName: vine.string().trim().minLength(2).maxLength(100).optional(),
    email: email().optional(),

    // Profil disciple
    gender: vine.string().trim().in(['M', 'F']).optional(),
    homeChurch: vine.string().trim().minLength(2).maxLength(150).optional(),
    worker: vine.boolean().optional(),
    ministry: vine.string().trim().maxLength(150).nullable().optional(),
    physiqueAddress: vine.string().trim().nullable().optional(),
    phoneNumber: vine.string().trim().minLength(10).maxLength(10).optional(),
    dateofbirth: vine.date({ formats: ['YYYY-MM-DD'] }).nullable().optional(),

    // Inscription académique
    planningId: vine.number().positive().optional(),
    programIds: vine.array(vine.number().positive()).optional(),
    vacationId: vine.number().positive().nullable().optional(),
    status: vine.string().trim().in(['pending', 'confirmed', 'rejected', 'cancelled']).optional(),
  })
)

// ── Profil étudiant seul (legacy) ───────────────────────────────────────────
export const studentProfileValidator = vine.compile(
  vine.object({
    gender: vine.string().trim().in(['M', 'F']),
    homeChurch: vine.string().trim(),
    worker: vine.string().trim(),
    ministry: vine.string().trim().nullable().optional(),
    format: vine.string().trim(),
    physiqueAddress: vine.string().trim().nullable().optional(),
    phoneNumber: vine.string().trim().nullable().optional(),
    dateofbirth: vine.date().nullable().optional(),
  })
)
