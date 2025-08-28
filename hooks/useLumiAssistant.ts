import { useState, useCallback } from 'react';

interface LumiMessage {
  text: string;
  trigger?: 'intro' | 'photo' | 'gallery' | 'processing' | 'success' | 'error' | 'help';
}

export const useLumiAssistant = () => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isLumiVisible, setIsLumiVisible] = useState(true);

  const lumiMessages = {
    intro: [
      "Olá! Eu sou o Lumi! 🖤 Vou te ajudar a usar o app!",
      "Bem-vindo ao Luminus! Sou seu assistente pessoal!",
      "Oi! Eu vou te guiar pelas funcionalidades de acessibilidade!"
    ],
    photo: [
      "Ótima escolha! Vamos tirar uma foto!",
      "A câmera vai abrir para você capturar uma imagem!",
      "Foque bem na imagem que eu vou descrevê-la para você!"
    ],
    gallery: [
      "Perfeito! Vamos escolher uma imagem da galeria!",
      "Selecione a imagem que você quer que eu analise!",
      "Sua galeria vai abrir para escolher uma foto!"
    ],
    processing: [
      "Estou analisando sua imagem... aguarde um minutinho!",
      "Deixa comigo! Estou processando os detalhes da imagem!",
      "Quase pronto! Estou identificando tudo na sua foto!"
    ],
    success: [
      "Pronto! Consegui analisar sua imagem com sucesso!",
      "Eba! A descrição está pronta! Que tal ouvir?",
      "Perfeito! Sua imagem foi analisada completamente!"
    ],
    error: [
      "Ops! Algo deu errado. Vamos tentar novamente?",
      "Parece que houve um probleminha. Você pode tentar de novo!",
      "Hmm... não consegui processar. Verifique sua conexão!"
    ],
    help: [
      "Precisa de ajuda? Posso explicar como usar o app!",
      "Dica: Você pode ativar o TalkBack para ouvir tudo!",
      "Lembre-se: toque duplo para ativar e gestos para navegar!"
    ]
  };

  const showLumiMessage = useCallback((trigger: keyof typeof lumiMessages) => {
    const messages = lumiMessages[trigger];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomMessage);
  }, []);

  const hideLumi = useCallback(() => {
    setIsLumiVisible(false);
  }, []);

  const showLumi = useCallback(() => {
    setIsLumiVisible(true);
  }, []);

  const clearMessage = useCallback(() => {
    setCurrentMessage('');
  }, []);

  // Mensagens específicas para ações
  const lumiSays = {
    welcomeUser: () => showLumiMessage('intro'),
    photoButtonPressed: () => showLumiMessage('photo'),
    galleryButtonPressed: () => showLumiMessage('gallery'),
    imageProcessing: () => showLumiMessage('processing'),
    imageAnalyzed: () => showLumiMessage('success'),
    errorOccurred: () => showLumiMessage('error'),
    helpRequested: () => showLumiMessage('help'),
    speakButtonPressed: () => setCurrentMessage("Agora vou ler a descrição da imagem para você!"),
    accessibilityTip: () => setCurrentMessage("Dica: Ative o TalkBack nas configurações para uma experiência completa!"),
  };

  return {
    currentMessage,
    isLumiVisible,
    showLumiMessage,
    hideLumi,
    showLumi,
    clearMessage,
    lumiSays,
  };
};
