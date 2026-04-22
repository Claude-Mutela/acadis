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
})

