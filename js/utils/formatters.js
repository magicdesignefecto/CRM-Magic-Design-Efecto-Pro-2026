/**
 * Utilidades de formato estándar
 */
export const Formatters = {
    /**
     * Formatea un número a moneda (USD/BOB)
     * @param {number} amount - Cantidad
     * @param {string} currency - 'USD' o 'BOB'
     */
    toCurrency: (amount, currency = 'USD') => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Formatea fecha corta
     */
    toDate: (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric'
        }).format(date);
    }
};