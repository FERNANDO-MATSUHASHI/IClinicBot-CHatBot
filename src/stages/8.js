import { VenomBot } from '../venom.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

import axios from 'axios'
import https from 'https'

function addCard(option) {
  if (option == 1){
    return "Plano de Saúde"
  } else {
    return "Particular"
  }
}

function convertDateToISO(dataAgendaChatBot) {
  // Dividir a string de data e hora
  const [data, hora] = dataAgendaChatBot.split(' - ')

  // Dividir a data em dia, mês e ano
  const [dia, mes, ano] = data.split('/')

  // Dividir a hora em horas e minutos
  const [horas, minutos] = hora.split(':')

  // Criar um objeto Date usando os componentes extraídos
  const dataObj = `${ano}-${mes}-${dia}T${horas}:${minutos}:00`

  // Retornar a string no formato ISO 8601
  return dataObj
}

async function addAgendaChatBot(dados) {
  
  try {
    dados.DataAgendaChatBot = convertDateToISO(dados.DataAgendaChatBot)

    const response = await axios.post('https://localhost:7112/api/AgendaChatBot', dados, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    return response.data
  } catch (error) {
    console.error('Erro ao obter dados da API:', error)
  }
}

export const stageEight = {
  async exec({ from, message }) {
   
    const isMsgValid = /[1|2|#|*]/.test(message)
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
                  `👨‍🔬 Exame: *${storage[from].itens[0]}* \n` + 
                  `✍ Tipo de Consulta: *${addCard(message)}*` +
                  '\n-----------------------------------\n#️⃣ - ```CONFIRMAR Agendamento``` \n*️⃣ - ```ENCERRAR Atendimento```'
        
        storage[from].itens.push(addCard(message))
        
      }

      if (message == '#') {
        // console.log('storege: ', storage[from].itens)
        const dados = {
          DataAgendaChatBot: storage[from].itens[1],
          Cel: phone[0],
          Nome: storage[from].itens[2],
          Especialidade: storage[from].itens[0],
          TipoConsultaExame: storage[from].itens[3],
          TipoAgendamento: "Exame"
        };
        
        addAgendaChatBot(dados).then(response => {
          if (response) {
            console.log('Dados enviados com sucesso:', response);
          } else {
            console.log('Falha ao enviar dados.');
          }
        });       

      }

      if (storage[from].stage === STAGES.INICIAL) {
        storage[from].itens = []
      }
    }

    // console.log('storege: ', storage[from].itens)

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
    const msg =
    '🗺️ Agendamento realizado com sucesso.\n\n ' +
    'IClinicBot agradece seu contato.'

    return {
      message: msg,
      nextStage: STAGES.INICIAL,
    }
  },
}