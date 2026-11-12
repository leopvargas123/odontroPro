


/**
 * Converte um valor monetário em reais (BRL) para centavos.
 * @param {string} amount - o Valor monetário em reais (BRL) a ser convertido.
 * @returns {number} Valor convertido em centavos.
 * 
 * @example 
 * convertReatToCents("1.300,50");// retorna: 130000.5 cents
 */
export function convertRealToCents(amount: string){
    const numericPrice = parseFloat(amount.replace(/\./g,'').replace(',','.'))
    const priceInCents =Math.round (numericPrice * 100)
    return priceInCents;
}