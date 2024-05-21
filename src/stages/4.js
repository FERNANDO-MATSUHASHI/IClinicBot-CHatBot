import { VenomBot } from '../venom.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

function addCard(option) {
        if (option == 1){
          return "Cartão de Crédito"
        } else if (option == 2){
          return  "Cartão de Débito"
        } else {
          return "PIX"
        }
}

export const stageFour = {
  async exec({ from, message }) {
   
    const isMsgValid = /[1|2|3|#|*]/.test(message)
    const phone = from.split('@')

    let msg =
      '❌ *Digite uma opção válida, por favor.* \n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️'

    if (isMsgValid) {
      if (['#', '*'].includes(message)) {
        const option = options[message]()
        msg = option.message
        storage[from].stage = option.nextStage
      } else {
        msg = `🔔 *NOVO AGENDAMENTO* 🔔: \n\n` + 
                  `📆 Data *${storage[from].itens[1]}* \n` +
                  `📞 Cliente: *${phone[0]}* \n` + 
                  `📃 Nome e Idade: *${storage[from].itens[2]}* \n` +
                  `👨‍🔬 Especialidade: *${storage[from].itens[0]}* \n` + 
                  `💰 Forma de Pagamento: *${addCard(message)}*` +
                  '\n-----------------------------------\n#️⃣ - ```CONFIRMAR Agendamento``` \n*️⃣ - ```ENCERRAR atendimento```'
        
        storage[from].itens.push(addCard(message))
      }

      if (storage[from].stage === STAGES.INICIAL) {
        storage[from].itens = []
      }
    }

    await VenomBot.getInstance().sendText({ to: from, message: msg })
  },
}

const options = {
  '*': () => {
    const message =
      '🔴 Atendimento *ENCERRADO* com sucesso. \n\n ```Volte Sempre!```'

    return {
      message,
      nextStage: STAGES.INICIAL,
    }
  },
  '#': () => {
    const message =
    '🗺️ Agendamento realizado com sucesso.\n\n ' +
    'IClinicBot agradece seu contato.'

    return {
      message,
      nextStage: STAGES.INICIAL,
    }
  },
}