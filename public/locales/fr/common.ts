import { Translations } from "@/types/i18n";

export const translations: Translations = {
  navigation: {
    home: "Accueil",
    blog: "Blog",
    pricing: "Tarifs",
    about: "À propos",
    login: "Connexion",
    register: "S'inscrire",
    dashboard: "Tableau de bord",
    interviews: "Entretiens",
  },
  auth: {
    signIn: "Se connecter",
    signUp: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    orContinueWith: "Ou continuer avec",
  },
  common: {
    loading: "Chargement...",
    error: "Une erreur est survenue",
    success: "Succès !",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    view: "Voir",
  },
  interview: {
    start: "Commencer l'entretien",
    prepare: "Se préparer",
    results: "Voir les résultats",
    history: "Historique des entretiens",
  },
} as const; 