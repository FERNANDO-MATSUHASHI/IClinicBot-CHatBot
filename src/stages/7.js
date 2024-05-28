import { VenomBot } from '../venom.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'
import { pagamento } from '../tipo_consulta.js'

export const stageSeven = {
  async exec({ from, message }) {

    console.log("Teste cartão")
    
    // Adicionado ao itens o Nome
    storage[from].itens.push(message)
    
    storage[from].stage = STAGES.AGENDAMENTOEXAME

    let msg = 'Agendamento *CANCELADO* com sucesso. \n Volte Sempre!'

    if (message === '*') {
      storage[from].stage = STAGES.INICIAL
    } else {
      msg = '🤔 ```Agora, informe o tipo de consulta: ```\n\n'

      Object.keys(pagamento).forEach((value) => {
        msg += `${numbers[value]} - _${pagamento[value].description}_ \n`
      })
    }

    await VenomBot.getInstance().sendText({ 
      to: from, 
      message: msg, 
    })

  },
}

const numbers = {
  1: '1️⃣',
  2: '2️⃣',
}