// ===========================
// Traduction des difficultés
// ===========================

export function translateDifficulty(difficulty) {
  switch (difficulty) {
    case 'easy':
      return 'Facile';
    case 'medium':
      return 'Moyen';
    case 'difficult':
      return 'Difficile';
    default:
      return 'Difficulté inconnue'; // Gère les cas où la difficulté ne correspond pas
  }
}

// =======================
// Traduction des rôles
// =======================

export function translateRole(role) {
  switch (role) {
    case 'user':
      return 'Utilisateur';
    case 'admin':
      return 'Administrateur';
    case 'guide':
      return 'Guide';
    case 'lead-guide':
      return 'Guide principal';
    default:
      return 'Rôle inconnu'; // Gère les cas où le rôle ne correspond pas
  }
}
