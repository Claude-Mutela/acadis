import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup (with password confirmation)
 */
export const signupValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    email: email().unique({ table: 'users', column: 'email' }),
    password: password().confirmed({
      confirmationField: 'passwordConfirmation',
    }),
    role: vine.enum(['superadmin', 'admin', 'financial', 'student', 'trainer', 'supervisor']),
    status: vine.enum(['active', 'inactive', 'suspended', 'pending']),
  })
)

/**
 * Validator to use for public signup (student default)
 */
export const publicSignupValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    email: email().unique({ table: 'users', column: 'email' }),
    password: password().confirmed({
      confirmationField: 'password_confirmation',
    }),
    agreeTerms: vine.accepted(),
  })
)

/**
 * Validator to use when an admin creates a user (no password confirmation)
 */
export const createUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    email: email().unique({ table: 'users', column: 'email' }),
    password: password(),
    role: vine.enum(['superadmin', 'admin', 'financial', 'student', 'trainer', 'supervisor']),
    status: vine.enum(['active', 'inactive', 'suspended', 'pending']),
  })
)
