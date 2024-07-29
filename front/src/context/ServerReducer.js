export const ServerReducer = (state, action) => {
    switch (action.type) {
      case 'SET_SERVERS':
        return { 
          ...state,
          servers: action.payload }
      case 'CREATE_SERVER':
        return {
          servers : [action.payload, ...state.servers] 
        }
      case 'DELETE_SERVER':
        return { servers: null }
      default:
        return state
    }
  }