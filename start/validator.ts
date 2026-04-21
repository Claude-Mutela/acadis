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
  'string.minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères.',
  'string.maxLength': 'Le champ {{ field }} ne peut pas dépasser {{ max }} caractères.',
  'number': 'Le champ {{ field }} doit être un nombre valide.',
  'enum': 'La valeur du champ {{ field }} est invalide. Valeurs acceptées : {{ options }}.',
  'array': 'Le champ {{ field }} doit être une liste.',
  'array.minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} élément(s).',
  'file.size': 'Le fichier {{ field }} ne doit pas dépasser {{ size }}.',
  'file.extname': 'Le fichier {{ field }} doit avoir une extension valide : {{ extnames }}.',
  'date': 'Le champ {{ field }} doit être une date valide.',
  'date.format': 'Le champ {{ field }} doit respecter le format {{ format }}.',

  // Champs spécifiques (programmes)
  'name.required': "L'intitulé du programme est obligatoire.",
  'name.string.minLength': "L'intitulé doit contenir au moins {{ min }} caractères.",
  'description.required': 'La description courte est obligatoire.',
  'description.string.minLength': 'La description doit contenir au moins {{ min }} caractères.',
  'presentation.required': 'La présentation synthétique est obligatoire.',
  'presentation.string.minLength': 'La présentation doit contenir au moins {{ min }} caractères.',
  'duration.required': 'Le volume horaire est obligatoire.',
  'trainerId.required': "L'expert assigné est obligatoire.",
  'objectives.required': 'Au moins un objectif pédagogique est requis.',
  'outputProfile.required': 'Au moins un profil de sortie est requis.',
})

