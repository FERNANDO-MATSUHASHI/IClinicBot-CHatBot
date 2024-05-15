import { VenomBot } from '../venom.js'
import { menu } from '../menu.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const stageFour = {
  async exec(params, from) {
    const message = params.message.trim()
    const isMsgValid = /[#|*|Cartão Crédito|Cartão Débito|Pix]/.test(message)
    const phone = from

    let msg =
      '❌ *Digite uma opção válida, por favor.* \n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️'

    if (isMsgValid) {
      if (['#', '*'].includes(message)) {
        const option = options[message]()
        msg = option.message
        storage[params.from].stage = option.nextStage
      } else {
        msg = `🔔 *NOVO AGENDAMENTO* 🔔: \n\n📞 Cliente: +${phone[0]} \n👨‍🔬 Especialidade: *${especialidade}* \n📃 Nome e RG: *${dados_Pessoais}* \n💰 Detalhes: *${messag}*` +
        '\n-----------------------------------\n#️⃣ - ```CONFIRMAR Agendamento``` \n*️⃣ - ```ENCERRAR atendimento```'
        storage[params.from].itens.push(menu[message])
      }

      if (storage[params.from].stage === STAGES.INICIAL) {
        storage[params.from].itens = []
      }
    }

    await VenomBot.getInstance().sendText({ to: params.from, message: msg })
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