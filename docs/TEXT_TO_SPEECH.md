# 🔊 Text-to-Speech (TTS) - Luminus

Sistema completo de leitura de texto em voz alta usando `expo-speech`.

## 📦 Arquivos Criados

### 1. **`src/services/speechService.ts`**
Serviço completo de TTS com métodos:
- `speak(text, options)` - Fala um texto
- `stop()` - Para a fala atual
- `pause()` - Pausa (apenas Android)
- `resume()` - Resume (apenas Android)
- `speakLongText(text)` - Fala textos longos dividindo em partes
- `getAvailableVoices()` - Lista vozes disponíveis
- `isAvailable()` - Verifica se TTS está disponível

### 2. **`src/hooks/useSpeech.ts`**
Hook React customizado para facilitar uso:
```tsx
const { speak, stop, isSpeaking, isPaused } = useSpeech();

// Usar
await speak("Texto para falar");
await stop();
```

### 3. **`src/components/SpeechButton.tsx`**
Componente de botão pronto:
```tsx
<SpeechButton 
  text="Texto a ser lido"
  size={24}
  color="#FF6B6B"
/>
```

## 🎯 Como Usar

### Opção 1: Usando o Hook (Recomendado)
```tsx
import { useSpeech } from '@/src/hooks';

function MeuComponente() {
  const { speak, stop, isSpeaking } = useSpeech({
    language: 'pt-BR',
    rate: 1.0, // velocidade (0.1 a 2.0)
    pitch: 1.0, // tom (0.5 a 2.0)
  });

  return (
    <Button 
      title={isSpeaking ? "Parar" : "Falar"}
      onPress={() => isSpeaking ? stop() : speak("Olá mundo!")}
    />
  );
}
```

### Opção 2: Usando o Componente Pronto
```tsx
import { SpeechButton } from '@/src/components/SpeechButton';

function MeuComponente() {
  return (
    <SpeechButton 
      text="Este texto será lido em voz alta"
      size={24}
    />
  );
}
```

### Opção 3: Usando o Serviço Diretamente
```tsx
import { speechService } from '@/src/services';

// Falar
await speechService.speak("Olá!", {
  language: 'pt-BR',
  rate: 1.2,
  onDone: () => console.log('Terminou'),
  onError: (error) => console.error(error),
});

// Parar
await speechService.stop();
```

## ⚙️ Opções Disponíveis

```typescript
{
  language: string;    // 'pt-BR', 'en-US', etc
  pitch: number;       // 0.5 a 2.0 (padrão: 1.0)
  rate: number;        // 0.1 a 2.0 (padrão: 1.0)
  onDone: () => void;  // Callback quando terminar
  onStart: () => void; // Callback ao iniciar
  onError: (error) => void; // Callback de erro
}
```

## 📱 Recursos por Plataforma

| Recurso | iOS | Android |
|---------|-----|---------|
| Speak | ✅ | ✅ |
| Stop | ✅ | ✅ |
| Pause | ❌ | ✅ |
| Resume | ❌ | ✅ |
| Vozes Customizadas | ✅ | ✅ |

## 🎨 Exemplo Completo

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SpeechButton } from '@/src/components/SpeechButton';
import { useSpeech } from '@/src/hooks';

export default function ResultScreen({ result }) {
  const { speak, isSpeaking } = useSpeech();

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>Análise da Imagem</Text>
        <SpeechButton text={result.analysis} />
      </View>
      
      <Text>{result.analysis}</Text>
      
      {/* Ou botão customizado */}
      <TouchableOpacity onPress={() => speak(result.analysis)}>
        <Icon name={isSpeaking ? "stop" : "volume-up"} />
      </TouchableOpacity>
    </View>
  );
}
```

## ✨ Características

- ✅ **Funciona offline** - não precisa de internet
- ✅ **Sem custos** - usa TTS nativo do dispositivo
- ✅ **Automático** - para ao desmontar componente
- ✅ **Multiplataforma** - iOS e Android
- ✅ **Textos longos** - divide automaticamente
- ✅ **Acessível** - labels de acessibilidade
- ✅ **Controle total** - play, pause, stop, velocidade

## 🚀 Implementado em:

- ✅ `app/results.tsx` - Botões de TTS nos resultados
  - Análise Visual
  - Texto Extraído
  - Resumo do Documento
