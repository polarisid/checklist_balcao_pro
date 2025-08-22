export const blocos: Record<string, Record<string, { label: string; name: string }[]>> = {
  Funcionamento: {
    'Pré-Análise': [
      { label: 'Não liga (Inoperante)', name: 'naoLiga' },
      { label: 'Desliga sozinho (Standby)', name: 'desligaSozinho' },
      { label: 'Liga/Desliga intermitente', name: 'ligaDesligaIntermitente' },
      { label: 'Sem imagem', name: 'semImagem' },
      { label: 'Sem som', name: 'semSom' },
    ],
    'Funções': [
      { label: 'Teste do Jog Function (Falha)', name: 'jogFunctionFalha' },
      { label: 'Teste do Jog Function (Normal)', name: 'jogFunctionNormal' },
    ],
    'Controle Remoto': [
      { label: 'Pareamento Falha', name: 'controleFalha' },
      { label: 'Pareamento Ausente', name: 'controleAusente' },
      { label: 'Pareamento Normal', name: 'controleNormal' },
    ],
    'Cabos': [
      { label: 'Cabo força Falha', name: 'caboForcaFalha' },
      { label: 'Cabo força Ausente', name: 'caboForcaAusente' },
      { label: 'Cabo força Normal', name: 'caboForcaNormal' },
      { label: 'Cabo One Connect Falha', name: 'caboOneConnectFalha' },
      { label: 'Cabo One Connect Ausente', name: 'caboOneConnectAusente' },
      { label: 'Cabo One Connect Normal', name: 'caboOneConnectNormal' },
    ],
  },
  Imagem: {
    'Executar Test Pattern': [
      { label: 'Pixel Apagado / Aceso', name: 'pixelApagado' },
      { label: 'Impurezas (Resíduos internos)', name: 'impurezas' },
      { label: 'Partes Escuras', name: 'partesEscuras' },
      { label: 'Burn-in (padrão vermelho)', name: 'burnIn' },
      { label: 'Linhas Horizontais', name: 'linhasHorizontais' },
      { label: 'Linhas Verticais', name: 'linhasVerticais' },
    ],
    'Imagem em todas as entradas': [
      { label: 'HDMI 1 NOK', name: 'hdmi1nok' },
      { label: 'HDMI 2 NOK', name: 'hdmi2nok' },
      { label: 'HDMI 3 NOK', name: 'hdmi3nok' },
      { label: 'HDMI 4 NOK', name: 'hdmi4nok' },
      { label: 'RF Falha', name: 'rfFalha' },
      { label: 'RF Normal', name: 'rfNormal' },
    ],
  },
  Audio: {
    'Auto Falantes': [
      { label: 'Som Intermitente', name: 'somIntermitente' },
      { label: 'Som distorcido / ruído / vibração', name: 'somDistorcido' },
    ],
    'Audio em todas as entradas': [
      { label: 'HDMI 1 NOK', name: 'shdmi1nok' },
      { label: 'HDMI 2 NOK', name: 'shdmi2nok' },
      { label: 'HDMI 3 NOK', name: 'shdmi3nok' },
      { label: 'HDMI 4 NOK', name: 'shdmi4nok' },
      { label: 'RF Falha', name: 'srfFalha' },
      { label: 'RF Normal', name: 'srfNormal' },
    ],
  },
  Rede: {
    ' Cabo (RJ45) /Wireless': [
      { label: 'FALHA -Conexão com internet - Cabo', name: 'internetCabo' },
      { label: 'FALHA -Conexão com internet - Wireless', name: 'internetWifi' },
      { label: 'FALHA -Teste de acesso ao Netflix', name: 'netflix' },
      { label: 'FALHA -Teste de acesso ao Youtube', name: 'youtube' },
    ]
  }
};
