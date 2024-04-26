export const formatMoeda = (valor) => {
    return valor !== null && valor !== undefined
      ? valor.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        })
      : '';
  }
  
  export const formatData = (times) => {
    const data = new Date(times)
    return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`
  }
  
  export const formatHora = (hora) => {
    return `às ${hora}:00`
  }