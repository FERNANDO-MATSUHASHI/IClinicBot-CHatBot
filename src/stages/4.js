import { VenomBot } from '../venom.js'
import { menu } from '../menu.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const stageFour = {
  async exec({ from, message, especialidade }) {
    console.log(especialidade)
    const message2 = message.trim()
    
    const isMsgValid = /[1|2|3|#|*]/.test(message)
    const phone = from.split('@')
    // const especialidade = itens.map((item) => item.description).join(', ')

    let msg =
      '❌ *Digite uma opção válida, por favor.* \n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️'

    if (isMsgValid) {
      if (['#', '*'].includes(message)) {
        const option = options[message]()
        msg = option.message
        storage[from].stage = option.nextStage
      } else {
        // msg = `🔔 *NOVO AGENDAMENTO* 🔔: \n\n📞 Cliente: +${phone[0]} \n👨‍🔬 Especialidade: *${especialidade}* \n📃 Nome e RG: *${dados_Pessoais}* \n💰 Detalhes: *${messag}*` +
        // '\n-----------------------------------\n#️⃣ - ```CONFIRMAR Agendamento``` \n*️⃣ - ```ENCERRAR atendimento```'

        msg = `🔔 *NOVO AGENDAMENTO* 🔔: \n\n📞 Cliente: +${phone[0]} \n👨‍🔬 Especialidade: *${especialidade}* \n💰 Nome: *${message2}*` +
        '\n-----------------------------------\n#️⃣ - ```CONFIRMAR Agendamento``` \n*️⃣ - ```ENCERRAR atendimento```'

        storage[from].itens.push(menu[message])
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
      nextStage: STAGES.RESUMO,
    }
  },
}