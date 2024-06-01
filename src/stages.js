import {
  initialStage,
  stageOne,
  stageTwo,
  stageThree,
  stageFour,
  finalStage,
  stageSix,
  stageSeven,
  stageEight
} from './stages/index.js'

import { storage } from './storage.js'

export const stages = [
  {
    descricao: 'Menu',
    stage: initialStage,
  },
  {
    descricao: 'Especialidades_Exames',
    stage: stageOne,
  },
  {
    descricao: 'Data_Consulta',
    stage: stageTwo,
  },
  {
    descricao: 'Pagamento_Consulta',
    stage: stageThree,
  },
  {
    descricao: 'Resumo_Consulta',
    stage: stageFour,
  },
  {
    descricao: 'Falar_Com_Atendente',
    stage: finalStage, 
  },
  {
    descricao: 'Data_exame',
    stage: stageSix,
  },
  {
    descricao: 'Pagamento Exame',
    stage: stageSeven,
  },
  {
    descricao: 'Resumo_Exame',
    stage: stageEight,
  },
]

export function getStage({ from }) {
  if (storage[from]) {
    return storage[from].stage
  }

  storage[from] = {
    stage: 0,
    itens: [],
  }

  return storage[from].stage 
}
