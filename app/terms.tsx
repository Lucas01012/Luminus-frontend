import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@/src/theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TERMS_ACCEPTED_KEY = '@luminus:terms_accepted';

export default function TermsScreen() {
  const { theme } = useTheme();
  const [termsExpanded, setTermsExpanded] = useState(false);
  const [privacyExpanded, setPrivacyExpanded] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleContinue = async () => {
    if (!agreed) return;

    try {
      await AsyncStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
      // Após aceitar termos, vai para login (não para as tabs)
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao salvar aceitação dos termos:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="auto" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={styles.header}>
          <FontAwesome name="shield" size={60} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Bem-vindo ao Luminus
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Antes de começar, é importante conhecer nossos termos e políticas
          </Text>
        </View>

        {}
        <TouchableOpacity
          style={[styles.card, { 
            backgroundColor: theme.colors.backgroundCard,
            borderColor: termsExpanded ? theme.colors.primary : theme.colors.outline,
          }]}
          onPress={() => setTermsExpanded(!termsExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <FontAwesome 
                name="file-text-o" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.cardIcon}
              />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Termos de Uso
              </Text>
            </View>
            <FontAwesome
              name={termsExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </View>

          {termsExpanded && (
            <View style={[styles.cardContent, { borderTopColor: theme.colors.outline }]}>
              <Text style={[styles.contentText, { color: theme.colors.text }]}>
                <Text style={styles.bold}>1. Uso do Aplicativo{'\n'}</Text>
                O Luminus é uma ferramenta de acessibilidade que utiliza Inteligência Artificial para análise de documentos e imagens.{'\n\n'}

                <Text style={styles.bold}>2. Envio de Conteúdo{'\n'}</Text>
                • Você pode enviar fotos, documentos e textos para análise{'\n'}
                • O conteúdo enviado é processado por IA para fornecer descrições e extrair informações{'\n'}
                • Não nos responsabilizamos por conteúdo enviado pelo usuário{'\n\n'}

                <Text style={styles.bold}>3. Precisão da IA{'\n'}</Text>
                • A Inteligência Artificial pode cometer erros ou imprecisões{'\n'}
                • As análises são auxiliares e não substituem verificação humana{'\n'}
                • Não garantimos 100% de precisão nas descrições e extrações{'\n\n'}

                <Text style={styles.bold}>4. Responsabilidades{'\n'}</Text>
                • Use o app para fins lícitos e legítimos{'\n'}
                • Não envie conteúdo ofensivo, ilegal ou que viole direitos autorais{'\n'}
                • Você é responsável pelo conteúdo que envia{'\n\n'}

                <Text style={styles.bold}>5. Disponibilidade{'\n'}</Text>
                • O serviço pode ficar indisponível temporariamente para manutenção{'\n'}
                • Podemos modificar funcionalidades sem aviso prévio{'\n'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Política de Privacidade */}
        <TouchableOpacity
          style={[styles.card, { 
            backgroundColor: theme.colors.backgroundCard,
            borderColor: privacyExpanded ? theme.colors.primary : theme.colors.outline,
          }]}
          onPress={() => setPrivacyExpanded(!privacyExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <FontAwesome 
                name="lock" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.cardIcon}
              />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Política de Privacidade
              </Text>
            </View>
            <FontAwesome
              name={privacyExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </View>

          {privacyExpanded && (
            <View style={[styles.cardContent, { borderTopColor: theme.colors.outline }]}>
              <Text style={[styles.contentText, { color: theme.colors.text }]}>
                <Text style={styles.bold}>1. Dados Coletados{'\n'}</Text>
                • Imagens e documentos enviados para análise{'\n'}
                • Informações de conta (e-mail, nome){'\n'}
                • Histórico de análises realizadas{'\n'}
                • Preferências do aplicativo{'\n\n'}

                <Text style={styles.bold}>2. Como Usamos Seus Dados{'\n'}</Text>
                • Processar análises de IA das imagens/documentos enviados{'\n'}
                • Manter histórico das suas análises{'\n'}
                • Melhorar a precisão e qualidade do serviço{'\n'}
                • Sincronizar dados entre dispositivos (se logado){'\n\n'}

                <Text style={styles.bold}>3. Armazenamento{'\n'}</Text>
                • Dados armazenados de forma segura no Firebase{'\n'}
                • Imagens processadas temporariamente para análise{'\n'}
                • Histórico mantido até exclusão manual pelo usuário{'\n\n'}

                <Text style={styles.bold}>4. Compartilhamento{'\n'}</Text>
                • Não vendemos seus dados pessoais{'\n'}
                • Dados enviados para APIs de IA (processamento){'\n'}
                • Não compartilhamos com terceiros sem consentimento{'\n\n'}

                <Text style={styles.bold}>5. Seus Direitos{'\n'}</Text>
                • Acessar seus dados a qualquer momento{'\n'}
                • Excluir seu histórico quando quiser{'\n'}
                • Solicitar exclusão completa da conta{'\n'}
                • Exportar seus dados{'\n\n'}

                <Text style={styles.bold}>6. Segurança{'\n'}</Text>
                • Conexões criptografadas (HTTPS){'\n'}
                • Autenticação segura via Firebase{'\n'}
                • Dados protegidos contra acesso não autorizado{'\n'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Checkbox de Concordância */}
        <TouchableOpacity
          style={styles.agreementContainer}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.checkbox,
            { 
              borderColor: agreed ? theme.colors.primary : theme.colors.outline,
              backgroundColor: agreed ? theme.colors.primary : 'transparent',
            }
          ]}>
            {agreed && (
              <FontAwesome name="check" size={18} color="#FFFFFF" />
            )}
          </View>
          <Text style={[styles.agreementText, { color: theme.colors.text }]}>
            Li e concordo com os{' '}
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
              Termos de Uso
            </Text>
            {' '}e{' '}
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
              Política de Privacidade
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Botão Continuar */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: agreed ? theme.colors.primary : theme.colors.outline,
            }
          ]}
          onPress={handleContinue}
          disabled={!agreed}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            { color: agreed ? '#FFFFFF' : theme.colors.textSecondary }
          ]}>
            Continuar
          </Text>
          <FontAwesome 
            name="arrow-right" 
            size={20} 
            color={agreed ? '#FFFFFF' : theme.colors.textSecondary}
            style={styles.continueIcon}
          />
        </TouchableOpacity>

        {/* Rodapé */}
        <Text style={[styles.footer, { color: theme.colors.textSecondary }]}>
          Ao continuar, você reconhece que o Luminus utiliza IA que pode cometer erros e aceita os riscos associados.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  cardContent: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agreementText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  continueIcon: {
    marginLeft: 10,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
