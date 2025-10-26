# Luminus Frontend - React Native + Expo

**Luminus** é um assistente visual inteligente desenvolvido para pessoas com deficiência visual ou baixa visão. O frontend foi completamente redesenhado com foco em acessibilidade, usabilidade e integração com o backend Flask.

## 🎨 Características do Design

### Interface Moderna e Acessível
- **Modo escuro por padrão** com alto contraste
- **Tipografia escalável** compatível com leitores de tela
- **Componentes customizados** com foco em acessibilidade
- **Navegação intuitiva** por abas com feedback háptico

### Sistema de Cores
- **Primária**: Roxo vibrante (#8B5CF6) para destaque
- **Secundária**: Azul complementar (#3B82F6) 
- **Fundo**: Preto profundo (#0F0F0F) para contraste máximo
- **Texto**: Branco puro (#FFFFFF) para legibilidade

### Acessibilidade
- ✅ Compatibilidade total com **VoiceOver** (iOS) e **TalkBack** (Android)
- ✅ **Labels e hints** acessíveis em todos os componentes
- ✅ **Feedback háptico** diferenciado por contexto
- ✅ **Navegação por gestos** otimizada
- ✅ **Alto contraste** e **fontes grandes** opcionais

## 📱 Funcionalidades

### 🏠 Tela Inicial
- Dashboard com acesso rápido às funcionalidades
- Cards interativos para câmera, galeria e documentos
- Dicas de acessibilidade contextuais
- Detecção automática de leitores de tela

### 📸 Câmera
- Interface intuitiva para captura de fotos
- Controles acessíveis (flash, trocar câmera, galeria)
- Preview em tempo real (quando dependências estiverem instaladas)
- Integração direta com análise de imagens

### 🖼️ Galeria
- Seleção de imagens da biblioteca do dispositivo
- Grid responsivo com previews
- Acesso rápido às imagens recentes
- Feedback visual e sonoro

### 📄 Documentos
- Upload de PDFs, DOCX e imagens escaneadas
- Processamento com OCR avançado
- Geração automática de resumos
- Histórico de documentos processados

### ⚙️ Configurações
- Personalização de tema (claro/escuro)
- Controles de acessibilidade (alto contraste, fontes grandes)
- Configurações de feedback (vibração, som)
- Informações do sistema

### 📊 Resultados
- Exibição clara dos resultados de análise
- Opções de compartilhamento
- Geração de áudio (TTS) para todos os textos
- Interface adaptativa por tipo de conteúdo

## 🛠️ Tecnologias e Arquitetura

### Stack Principal
- **React Native** (0.81.4) + **Expo** (~54.0.13)
- **TypeScript** para type safety
- **Expo Router** para navegação
- **Axios** para comunicação HTTP

### Estrutura de Arquivos
```
src/
├── components/ui/          # Componentes UI reutilizáveis
│   ├── Button.tsx          # Botão acessível
│   ├── Card.tsx            # Card com variantes
│   └── Input.tsx           # Input com validação
├── theme/                  # Sistema de design
│   ├── ThemeProvider.tsx   # Provider de tema
│   ├── theme.ts            # Definições de tema
│   └── types.ts            # Tipos TypeScript
├── services/               # Integração com backend
│   ├── apiService.ts       # Serviços de imagem
│   └── documentService.ts  # Serviços de documento
├── hooks/                  # Hooks customizados
│   ├── useLoading.ts       # Hook para loading states
│   └── useFeedback.ts      # Hook para feedback háptico
└── screens/                # Telas da aplicação
```

### Padrões de Design
- **Atomic Design** para componentes
- **Composition over Inheritance**
- **Hooks personalizados** para lógica reutilizável
- **Context API** para estado global (tema)

## 🔗 Integração com Backend

### Endpoints Utilizados
```typescript
// Análise de Imagens
POST /analisar?modo=gemini           // Análise com Gemini
POST /analisar-rapido                // Análise rápida
POST /analisar-ultra                 // Análise ultra rápida
POST /ler-texto                      // OCR de imagem

// Documentos
POST /documento/processar-documento   // Processar PDF/DOCX
POST /documento/extrair-texto-imagem // OCR especializado
POST /documento/gerar-audio-documento // TTS
GET  /documento/vozes-disponiveis    // Lista de vozes
POST /documento/buscar-no-documento  // Busca no texto
```

### Configuração da API
```typescript
// src/services/apiService.ts
const BASE_URL = 'http://localhost:5000'; // Altere para seu backend
```

## 📦 Instalação e Configuração

### 1. Dependências Principais (Instaladas)
```bash
npm install axios @react-navigation/bottom-tabs @react-navigation/native-stack
```

### 2. Dependências Pendentes
Para funcionalidade completa, instale:
```bash
# Câmera e mídia
npm install expo-camera expo-image-picker expo-media-library

# Documentos e áudio
npm install expo-document-picker expo-av

# Feedback e acessibilidade
npm install expo-haptics @react-native-async-storage/async-storage

# Sons (opcional)
npm install react-native-sound
```

### 3. Configuração de Permissões
O `app.json` já está configurado com as permissões necessárias:
- Câmera e microfone
- Galeria de fotos
- Armazenamento de mídia

### 4. Executar o Projeto
```bash
# Instalar dependências
npm install

# Executar no simulador iOS
npm run ios

# Executar no Android
npm run android

# Executar no navegador (desenvolvimento)
npm run web
```

## 🎯 Funcionalidades Implementadas vs. Pendentes

### ✅ Implementado
- [x] Sistema de tema completo com modo escuro
- [x] Navegação por abas acessível
- [x] Componentes UI customizados
- [x] Integração completa com backend
- [x] Telas principais (Início, Câmera, Galeria, Documentos, Configurações)
- [x] Tela de resultados com compartilhamento
- [x] Hooks para loading e feedback
- [x] Suporte a leitores de tela
- [x] TypeScript em todo o projeto

### ⏳ Dependente de Instalação
- [ ] Captura real de fotos (expo-camera)
- [ ] Seleção de imagens (expo-image-picker)
- [ ] Upload de documentos (expo-document-picker)
- [ ] Feedback háptico (expo-haptics)
- [ ] Reprodução de áudio (expo-av)
- [ ] Persistência de configurações (async-storage)

## 🎨 Customização

### Alterando Cores do Tema
```typescript
// src/theme/theme.ts
const darkColors: Colors = {
  primary: '#8B5CF6',        // Roxo principal
  secondary: '#3B82F6',      // Azul secundário
  background: '#0F0F0F',     // Fundo escuro
  // ... outras cores
};
```

### Adicionando Novos Componentes UI
```typescript
// src/components/ui/NovoComponente.tsx
import { useTheme } from '@/src/theme/ThemeProvider';

export const NovoComponente = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {/* Seu componente aqui */}
    </View>
  );
};
```

## 🔄 Fluxo de Navegação

```
Início (index.tsx)
├── Câmera → Captura → Resultados
├── Galeria → Seleção → Resultados  
├── Documentos → Upload → Resultados
└── Configurações → Personalização

Resultados (results.tsx)
├── Compartilhar
├── Gerar Áudio
└── Nova Análise
```

## 📱 Testando a Acessibilidade

### No iOS (Simulador)
```bash
# Ativar VoiceOver
Settings > Accessibility > VoiceOver > ON

# Gestos básicos
# Deslizar: navegar entre elementos
# Toque duplo: ativar elemento
# Deslizar para baixo com 3 dedos: rolar
```

### No Android (Emulador)
```bash
# Ativar TalkBack
Settings > Accessibility > TalkBack > ON

# Gestos básicos
# Toque: selecionar elemento
# Toque duplo: ativar elemento
# Deslizar para baixo e direita: próximo elemento
```

## 🚀 Próximos Passos

1. **Instalar dependências pendentes** conforme necessário
2. **Configurar servidor backend** com IP correto
3. **Testar integração completa** com dados reais
4. **Adicionar ícones personalizados** (corvo)
5. **Implementar splash screen** customizada
6. **Otimizar performance** para dispositivos mais antigos
7. **Adicionar testes unitários** e de integração

## 📞 Suporte

Para dúvidas sobre implementação ou customização:
- Consulte a documentação do Expo: https://docs.expo.dev/
- Guias de acessibilidade React Native: https://reactnative.dev/docs/accessibility
- Documentação do backend Flask (arquivos anexados)

---

**Luminus** - Transformando a experiência visual através da tecnologia acessível! 👁️✨