import { VenomBot } from '../venom.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const stageThree = {
  async exec({ from, message, especialidade, data }) {
    storage[from].dados_Pessoais = message
    storage[from].stage = STAGES.AGENDAMENTO

    let msg = 'Atendimento *ENCERRADO* com sucesso. \n Volte Sempre!'
    if (message === '*') {
      storage[from].stage = STAGES.INICIAL
    } else {
      const itens = storage[from].itens
      const especialidade = itens.map((item) => item.description).join(', ')


      msg =
        `🗒️ *RESUMO DO AGENDAMENTO*: \n\n📃 Nome: *${message}*\n📆Data: *${data}\n*👨‍🔬 Especialidade: *${especialidade}* \n \n\n` +
        '🔊 ```Agora, informe a forma de pagamento: ```\n\n' +
        '1️⃣Cartão Crédito\n2️⃣Cartão Débito\n3️⃣PIX'
    }

    await VenomBot.getInstance().sendText({ from: from, message: msg, especialidade: especialidade })

  },
}
