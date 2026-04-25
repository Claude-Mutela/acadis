/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import { DateTime } from 'luxon'
import vine, { SimpleMessagesProvider, VineDate } from '@vinejs/vine'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))

vine.messagesProvider = new SimpleMessagesProvider({
  'required': 'Le champ {{ field }} est obligatoire.',
  'defined': 'Le champ {{ field }} est obligatoire.',
  'string': 'Le champ {{ field }} doit être une chaîne de caractères.',
  'minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères.',
  'maxLength': 'Le champ {{ field }} ne peut pas dépasser {{ max }} caractères.',
  'number': 'Le champ {{ field }} doit être un nombre valide.',
  'enum': 'La valeur du champ {{ field }} est invalide. Valeurs acceptées : {{ options }}.',
  'array': 'Le champ {{ field }} doit être une liste.',
  'array.minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} élément(s).',
  'file.size': 'Le fichier {{ field }} ne doit pas dépasser {{ size }}.',
  'file.extname': 'Le fichier {{ field }} doit avoir une extension valide : {{ extnames }}.',
  'date': 'Le champ {{ field }} doit être une date valide.',
  'date.format': 'Le champ {{ field }} doit respecter le format {{ format }}.',
  'regex': 'Le format du champ {{ field }} est invalide.',

  // Champs spécifiques
  'name.required': "L'intitulé est obligatoire.",
  'name.minLength': "L'intitulé doit contenir au moins {{ min }} caractères.",
  'title.required': "Le titre est obligatoire.",
  'title.minLength': "Le titre doit contenir au moins {{ min }} caractères.",
  'order.required': "Le numéro d'ordre est obligatoire.",
  'order.number': "Le numéro d'ordre doit être un nombre valide.",
  'order.min': "Le numéro d'ordre doit être supérieur ou égal à {{ min }}.",
  'price.required': "Le prix est obligatoire.",
  'price.number': "Le prix doit être un nombre valide.",
  'price.min': "Le prix ne peut pas être négatif.",
  'file.required': "Le fichier PDF est obligatoire.",
  'file.file.extname': "Le fichier doit être au format PDF.",
  'file.file.size': "Le fichier est trop lourd (max 20Mo).",
  'coverImage.extnames': "L'image doit être au format JPG, PNG ou WEBP.",
  'coverImage.size': "L'image est trop lourde (max 5Mo).",
  'description.required': 'La description est obligatoire.',
  'description.minLength': 'La description doit contenir au moins {{ min }} caractères.',
  'presentation.required': 'La présentation synthétique est obligatoire.',
  'presentation.minLength': 'La présentation doit contenir au moins {{ min }} caractères.',
  'duration.required': 'Le volume horaire est obligatoire.',
  'trainerId.required': "L'expert assigné est obligatoire.",
  'objectives.required': 'Au moins un objectif pédagogique est requis.',
  'outputProfile.required': 'Au moins un profil de sortie est requis.',
  
  // Vacations
  'cohortId.required': 'La sélection de la cohorte est obligatoire.',
  'programId.required': 'La sélection du programme est obligatoire.',
  'day.required': 'Le jour de la semaine est obligatoire.',
  'startTime.required': "L'heure de début est obligatoire.",
  'endTime.required': "L'heure de fin est obligatoire.",
  'startTime.regex': "Le format de l'heure de début doit être HH:MM.",
  'endTime.regex': "Le format de l'heure de fin doit être HH:MM.",

  // Utilisateurs & Formateurs
  'firstName.required': "Le prénom est obligatoire.",
  'firstName.minLength': "Le prénom doit contenir au moins {{ min }} caractères.",
  'firstName.maxLength': "Le prénom ne peut pas dépasser {{ max }} caractères.",
  'lastName.required': "Le nom de famille est obligatoire.",
  'lastName.minLength': "Le nom de famille doit contenir au moins {{ min }} caractères.",
  'lastName.maxLength': "Le nom de famille ne peut pas dépasser {{ max }} caractères.",
  'email.required': "L'adresse email est obligatoire.",
  'email.email': "L'adresse email doit être valide.",
  'email.unique': "Cette adresse email est déjà utilisée.",
  'password.required': "Le mot de passe est obligatoire.",
  'password.minLength': "Le mot de passe doit contenir au moins {{ min }} caractères.",
  'password.maxLength': "Le mot de passe ne peut pas dépasser {{ max }} caractères.",
  'role.required': "Le rôle est obligatoire.",
  'role.enum': "Le rôle sélectionné est invalide.",
  'status.required': "Le statut est obligatoire.",
  'status.enum': "Le statut sélectionné est invalide.",
  'gender.required': "Le sexe est obligatoire.",
  'gender.enum': "Le sexe doit être Homme ou Femme.",
  'homeChurch.required': "L'église d'attache est obligatoire.",
  'specialization.required': "La spécialisation est obligatoire.",

  // Cohortes
  'slug.required': "Le slug est obligatoire.",
  'slug.unique': "Ce slug est déjà utilisé.",
  'startDate.required': "La date de début est obligatoire.",
  'startDate.date': "La date de début doit être une date valide.",
  'endDate.required': "La date de fin est obligatoire.",
  'endDate.date': "La date de fin doit être une date valide.",

  // Planning
  'type.required': "Le type de session est obligatoire.",
  'type.enum': "Le type sélectionné est invalide.",
  'capacity.required': "La capacité (places totales) est obligatoire.",
  'capacity.number': "La capacité doit être un nombre valide.",
  'capacity.min': "La capacité ne peut pas être négative.",

  // Profil Étudiant
  'gender.required': "Le sexe est obligatoire.",
  'homeChurch.required': "L'église d'attache est obligatoire.",
  'worker.required': "Le statut d'ouvrier est obligatoire.",
  'format.required': "Le format (en ligne/présentiel) est obligatoire.",
  'physiqueAddress.required': "L'adresse physique est obligatoire.",
  'phoneNumber.required': "Le numéro de téléphone est obligatoire.",
  'dateofbirth.required': "La date de naissance est obligatoire.",
  'dateofbirth.date': "La date de naissance doit être une date valide."
})

