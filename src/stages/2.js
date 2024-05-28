import { VenomBot } from '../venom.js'
import { menu } from '../menu.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

import axios from 'axios'
import https from 'https'

async function fetchAgenda(especialidade) {

  try {
    const response = await axios.get('https://localhost:7112/api/AgendaMedico', {
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    const filteredData = response.data.filter(item => item.especialidade === especialidade)

    console.log('Dados filtrados:', filteredData)

    return filteredData
  } catch (error) {
    console.error('Erro ao obter dados da API:', error)
  }
}

export const stageTwo = {
  async exec(params) {
    const message = params.message.trim()
    const isMsgValid = /[1|2|3|4|5|#|*]/.test(message)

    let msg =
      '❌ *Digite uma opção válida, por favor.* \n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️'

    if (isMsgValid) {
      if (['#', '*'].includes(message)) {
        const option = options[message]()
        msg = option.message
        storage[params.from].stage = option.nextStage
      } else {

        if (storage[params.from].itens.length === 0) {
          const agenda = await fetchAgenda(menu[message].description)

          const dataAgendaList = agenda.map(item => {
            const data = new Date(item.dataAgendaDisponivel)
            const dia = String(data.getDate()).padStart(2, '0')
            const mes = String(data.getMonth() + 1).padStart(2, '0')
            const ano = data.getFullYear()
            return `${dia}/${mes}/${ano}`
          });
          const dataAgendaJSON = JSON.stringify(dataAgendaList).replace(/[\[\]"]/g, '')

          msg =
            `✅ *${menu[message].description}* selecionado com sucesso! \n\n` +
            '```Data disponível```: \n\n' + dataAgendaJSON +
            '\n-----------------------------------\n#️⃣ - ```CONFIRMAR Agendamento``` \n*️⃣ - ```ENCERRAR Atendimento```'

          // Adicionado ao itens a Especialidade e a Data
          storage[params.from].itens.push(menu[message].description)
          storage[params.from].itens.push(dataAgendaJSON)
          console.log('storage: ', storage[params.from])
        } else {
          let msg = '❌ *Digite uma opção válida, por favor.* \n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️'
        }

      }

      // console.log('params: ', params)

      if (storage[params.from].stage === STAGES.INICIAL) {
        storage[params.from].itens = []
      }
    }
    // console.log('storege: ', storage[params.from].itens)

    await VenomBot.getInstance().sendText({
      to: params.from,
      message: msg,
    })
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
  '#': (params, from) => {
    const msg = '*Digite seu NOME e IDADE:*\n' +
      '( ```Nome, Idade``` )\n\n'
    // storage[params.from].itens.push(msg)

    return {
      to: from,
      message: msg,
      nextStage: STAGES.RESUMO,
    }
  },
}