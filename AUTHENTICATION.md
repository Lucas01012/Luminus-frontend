# 🔐 Sistema de Autenticação - Luminus

## ✅ Integração Completa

O sistema de autenticação está **totalmente integrado** com o backend! 🎉

### 📋 O que foi implementado:

#### 1. **AuthService** (`src/services/authService.ts`)
- ✅ Login com Firebase
- ✅ Registro de novos usuários
- ✅ Reset de senha
- ✅ Refresh de token
- ✅ Armazenamento seguro (AsyncStorage)

#### 2. **Interceptor de Token** (`src/services/apiService.ts`)
```typescript
// Token é adicionado AUTOMATICAMENTE em TODAS as requisições
this.api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@luminus_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 3. **Auto-logout em 401**
```typescript
// Se o backend retornar 401 (token inválido/expirado), faz logout automático
this.api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@luminus_auth_token');
      await AsyncStorage.removeItem('@luminus_user_data');
    }
    return Promise.reject(error);
  }
);
```

### 🔄 Como funciona:

1. **Usuário faz login** → Token JWT é salvo no AsyncStorage
2. **Qualquer chamada de API** → Token é adicionado automaticamente no header `Authorization: Bearer {token}`
3. **Backend verifica** → Usa `AuthService.verify_token()` com Firebase Admin SDK
4. **Token expirado?** → App faz logout automático e redireciona para login

### 🚀 Como testar:

#### 1. **Teste de Login**
```
1. Abra o app
2. Vá em Configurações
3. Toque em "Entrar ou criar conta"
4. Crie uma nova conta ou faça login
5. Volte para Configurações
6. Você verá seu perfil com nome e email
```

#### 2. **Teste de Autenticação com Backend**
```
1. Faça login no app
2. Vá em Configurações
3. Toque em "Testar Autenticação"
4. O app vai chamar a rota protegida /rota-protegida
5. Se der sucesso, a autenticação está funcionando! ✅
```

#### 3. **Teste de Análise de Imagem Autenticada**
```
1. Faça login no app
2. Vá na aba Câmera
3. Tire uma foto
4. A requisição para /analisar já vai com o token!
5. Backend pode verificar quem fez a requisição
```

### 📝 Rotas do Backend:

#### Rotas Públicas (sem token):
- `GET /` - Health check
- `POST /analisar` - Análise de imagem
- `POST /ler-texto` - OCR
- `POST /documento/processar` - Processar documento

#### Rotas Protegidas (com token obrigatório):
- `GET /rota-protegida` - Teste de autenticação
- `GET /perfil-usuario` - Dados do usuário autenticado
- Adicione mais rotas com `@require_auth` no backend!

### 🔧 Backend - Como proteger uma rota:

```python
from decorators.auth import require_auth

@app.route('/minha-rota-protegida', methods=['POST'])
@require_auth
def minha_rota(user_data):
    # user_data contém: uid, email, name, picture, email_verified
    user_id = user_data['uid']
    user_email = user_data['email']
    
    # Sua lógica aqui...
    
    return jsonify({
        'mensagem': f'Olá {user_data["name"]}!',
        'seu_email': user_email
    })
```

### 📱 Frontend - Usando auth em componentes:

```tsx
import { useAuth } from '@/src/contexts/AuthContext';

function MeuComponente() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Text>Faça login para continuar</Text>;
  }
  
  return (
    <View>
      <Text>Olá, {user?.displayName}!</Text>
      <Text>{user?.email}</Text>
      <Button title="Sair" onPress={logout} />
    </View>
  );
}
```

### 🛡️ Segurança:

- ✅ Token JWT armazenado localmente (AsyncStorage)
- ✅ Token enviado via header Authorization
- ✅ Backend valida com Firebase Admin SDK
- ✅ Auto-logout em caso de token inválido
- ✅ Refresh automático quando app volta do background
- ✅ Token expira em 1 hora (padrão do Firebase)

### 🔑 Configuração necessária:

1. No arquivo `src/config/firebase.ts`, adicione suas credenciais:
```typescript
export const FIREBASE_CONFIG = {
  apiKey: 'SUA_CHAVE_AQUI',  // Pegar no Firebase Console
  authDomain: 'luminus-app.firebaseapp.com',
  projectId: 'luminus-app',
  storageBucket: 'luminus-app.appspot.com',
  messagingSenderId: 'SEU_ID_AQUI',
  appId: 'SEU_APP_ID_AQUI'
};
```

2. No backend, certifique-se de que o arquivo `config/luminus-app-firebase-adminsdk.json` está presente.

### 📊 Status da Integração:

| Componente | Status |
|------------|--------|
| AuthService | ✅ Completo |
| Token Interceptor | ✅ Ativo |
| Auto-logout em 401 | ✅ Funcionando |
| Login/Register UI | ✅ Implementado |
| Forgot Password | ✅ Implementado |
| Settings Integration | ✅ Completo |
| AuthContext | ✅ Funcionando |
| AuthProvider | ✅ Envolvendo app |
| Refresh no Background | ✅ Implementado |
| Teste de Rota Protegida | ✅ Disponível |

### 🎯 Próximos passos opcionais:

- [ ] Implementar verificação de email (enviar link)
- [ ] Adicionar upload de foto de perfil
- [ ] Sincronizar histórico com Firestore
- [ ] Adicionar login com Google/Apple
- [ ] Implementar biometria (Face ID/Touch ID)

---

**🎉 Está tudo pronto para usar!** Basta adicionar a API Key do Firebase e testar! 🚀
