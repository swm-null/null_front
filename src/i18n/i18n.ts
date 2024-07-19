import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      translation: ko,
    },
  },
  // 기본 언어 설정
  lng: 'ko',
  // 언어 파일이 없는 경우 사용할 언어
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
