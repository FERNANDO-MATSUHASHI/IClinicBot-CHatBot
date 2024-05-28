import { VenomBot } from '../venom.js'
import { menu } from '../menu.js'
import { exame } from '../exame.js'
import { storage } from '../storage.js'
import { initialStage } from './0.js'
import { STAGES } from './index.js'

export const stageOne = {
  async exec(params) {
    const message = params.message.trim()
    const isMsgValid = /[0|1|2]/.test(message)

    let msg =
      '❌ *Digite uma opção válida, por favor.* \n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️'

    if (isMsgValid) {
      const option = options[Number(message)]()
      msg = option.message
      storage[params.from].stage = option.nextStage || STAGES.INICIAL
    }

    await VenomBot.getInstance().sendText({ to: params.from, message: msg })

    if (storage[params.from].stage === STAGES.INICIAL) {
      await initialStage.exec(params)
    } else if (storage[params.from].stage === STAGES.FALAR_COM_ATENDENTE) {
      storage[params.from].finalStage = {
        startsIn: new Date().getTime(),
        endsIn: new Date().setSeconds(60), // 1 minute of inactivity
      }
    }
  },
}

const options = {
  1: (from) => {
    let message = '🚨  ESPECIALIDADES  🚨\n\n'

    Object.keys(menu).forEach((value) => {
      message += `${numbers[value]} - _${menu[value].description}_ \n`
    })

    return {
      message,
      nextStage: STAGES.ESPECIALIDADES, 
    }
  },
  2: () => {
    let message = '🚨  TIPO DE EXAMES  🚨\n\n'

    Object.keys(exame).forEach((value) => {
      message += `${numbers_exam[value]} - _${exame[value].description}_ \n`
    })

    return {
      message,
      nextStage: STAGES.TIPOEXAME, 
    }
  },
  0: () => {
    return {
      message:
        '🔃 Encaminhando você para um atendente. \n⏳ *Aguarde um instante*.\n \n⚠️ A qualquer momento, digite *ENCERRAR* para encerrar o atendimento. ⚠️',
      nextStage: STAGES.FALAR_COM_ATENDENTE,
    }
  },
}

const numbers = {
  1: '1️⃣',
  2: '2️⃣',
  3: '3️⃣',
  4: '4️⃣',
  5: '5️⃣',
}

const numbers_exam = {
  1: '1️⃣',
  2: '2️⃣',
}
