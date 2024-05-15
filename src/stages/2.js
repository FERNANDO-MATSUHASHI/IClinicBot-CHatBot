import { VenomBot } from '../venom.js'
import { menu } from '../menu.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

import axios from 'axios';
import https from 'https';

async function fetchAgenda() {
  try {
    const response = await axios.get('https://localhost:7112/api/Agenda', {
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados da API:', error);
  }
}

export const stageTwo = {
  async exec(params) {
    const message = params.message.trim()
    const isMsgValid = /[1|2|3|4|5|#|*]/.test(message)
    const agenda = await fetchAgenda()

    const dataAgendaList = agenda.map(item => {
      const data = new Date(item.dataAgenda);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    });
  const dataAgendaJSON = JSON.stringify(dataAgendaList);

    let msg =
      '❌ *Digite uma opção válida, por favor.* \n⚠️ ```APENAS UMA OPÇÃO POR VEZ``` ⚠️'

    if (isMsgValid) {
      if (['#', '*'].includes(message)) {
        const option = options[message]()
        msg = option.message
        storage[params.from].stage = option.nextStage
      } else {
        msg =
          `✅ *${menu[message].description}* selecionado com sucesso! \n\n` +
          '```Data disponível```: \n\n' + dataAgendaJSON +
          '\n-----------------------------------\n#️⃣ - ```CONFIRMAR Agendamento``` \n*️⃣ - ```ENCERRAR atendimento```'
        storage[params.from].itens.push(menu[message])
      }

      if (storage[params.from].stage === STAGES.INICIAL) {
        storage[params.from].itens = []
      }
    }

    await VenomBot.getInstance().sendText({ to: params.from, message: msg, data: dataAgendaJSON })
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
      '🗺️ Agora, informe o *NOME COMPLETO e IDADE*.\n\n' + '(Nome, Idade)\n' + 
      '\n-----------------------------------\n*️⃣ - ```CANCELAR atendimento```'
    return {
      message,
      nextStage: STAGES.RESUMO,
    }
  },
}