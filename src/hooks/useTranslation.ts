import { useSettingsStore } from '@/store/useSettingsStore';
import { t as i18nT } from '@/i18n';

export const useTranslation = () => {
  const language = useSettingsStore((state) => state.language);
  
  // O hook retorna o idioma atual e a função de tradução.
  // Como ele depende de 'language' do store, qualquer componente que use este hook
  // irá re-renderizar automaticamente quando o idioma mudar no store.
  return { 
    t: i18nT, 
    language 
  };
};
