import { storage } from '../storage.js'
import { VenomBot } from '../venom.js'
import { STAGES } from './index.js'

export const initialStage = {
  async exec({ from }) {
    storage[from].stage = STAGES.MENU

    const venombot = await VenomBot.getInstance()

    const message = `
      👋 Olá, como vai?
      Eu sou Ana, a *assistente virtual* da ${venombot.getSessionName}.
      *Posso te ajudar?* 🙋
      -----------------------------------
      1️⃣ - AGENDAR UMA CONSULTA
      2️⃣ - AGENDAR UM EXAME
      0️⃣ - FALAR COM ATENDENTE
    `

  //   const message = `
  //   👋 Olá, como vai?
  //   Eu sou Ana, a *assistente virtual* da ${venombot.getSessionName}.
  //   *Posso te ajudar?* 🙋
  //   -----------------------------------
  //   1️⃣ - AGENDAR UMA CONSULTA
  //   0️⃣ - FALAR COM ATENDENTE
  // `

    await venombot.sendText({ to: from, message })
  },
}
