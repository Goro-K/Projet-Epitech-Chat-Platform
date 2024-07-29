export const authReducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN':
        return { user: action.payload }
      case 'CHANGE_USERNAME':
        return {
          ...state, // Conserve toutes les propriétés de l'état existant
          user: {
            ...state.user, // Conserve toutes les propriétés de l'objet user existant
            username: action.payload // Met à jour uniquement username
          }
        }
      case 'LOGOUT':
        return { user: null }
      default:
        return state
    }
  }