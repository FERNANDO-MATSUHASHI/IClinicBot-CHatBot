import { VenomBot } from '../venom.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const stageThree = {
  async exec({ from, message }) {
    storage[from].dados_Pessoais = message
    storage[from].stage = STAGES.AGENDAMENTO

    let msg = 'Atendimento *ENCERRADO* com sucesso. \n Volte Sempre!'
    if (message === '*') {
      storage[from].stage = STAGES.INICIAL
    } else {
      const itens = storage[from].itens
      const especialidade = itens.map((item) => item.description).join(', ')

      const total = storage[from].itens.length

      msg =
        `🗒️ *RESUMO DO AGENDAMENTO*: \n\n👨‍🔬 Especialidade: *${especialidade}* \n📃 Nome, RG e Data Nascimento: *${message}* \n\n` +
        '🔊 ```Agora, informe a forma de pagamento (Cartão Crédito, Cartão Débito ou PIX).```'
    }

    await VenomBot.getInstance().sendText({ to: from, message: msg })

  },
}
