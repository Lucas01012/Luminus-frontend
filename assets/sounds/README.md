# Sons de Feedback

Esta pasta contém os arquivos de áudio para feedback sonoro do aplicativo.

## Status Atual

⚠️ **Feedback sonoro temporariamente desabilitado**

O sistema de feedback sonoro está implementado no código, mas precisa de arquivos de áudio para funcionar completamente.

## Implementação Futura

Para ativar o feedback sonoro:

1. Adicione arquivos de som nesta pasta:
   - `click.wav` - Som de clique suave
   - `success.wav` - Som de sucesso
   - `error.wav` - Som de erro
   - `warning.wav` - Som de aviso

2. Atualize o `FeedbackContext.tsx` para carregar os sons:
```typescript
const { sound } = await Audio.Sound.createAsync(
  require('@assets/sounds/click.wav'),
  { shouldPlay: true, volume: 0.3 }
);
```

## Alternativa

Por enquanto, o sistema usa apenas vibração para feedback háptico, que está funcionando perfeitamente.
