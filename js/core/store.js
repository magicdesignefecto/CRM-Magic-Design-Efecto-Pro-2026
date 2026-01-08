import { PubSub } from './pubsub.js';

// Estado inicial LIMPIO (Sin usuario "quemado")
const initialState = {
    user: null, // <--- Aquí estaba Diego, ahora está vacío esperando Login real
    theme: 'light',
    isLoading: false,
    error: null
};

export const Store = {
    state: initialState,

    getState() {
        return this.state;
    },

    setUser(user) {
        this.state.user = user;
        // Persistir en localStorage para que no se cierre al recargar (opcional por ahora)
        if(user) localStorage.setItem('crm_user', JSON.stringify(user));
        else localStorage.removeItem('crm_user');
        
        PubSub.publish('AUTH_CHANGED', user);
    },

    // Recuperar sesión si existe (útil para cuando recargas la página)
    init() {
        const saved = localStorage.getItem('crm_user');
        if(saved) {
            this.state.user = JSON.parse(saved);
        }
    }
};