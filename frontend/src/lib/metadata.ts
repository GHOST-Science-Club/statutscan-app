import { Metadata } from 'next';

const layoutMetadata: Metadata = {
  metadataBase: new URL(process.env.HOST || 'http://localhost:3000'),
  title: {
    template: '%s | PUTAgent',
    default: 'PUTAgent | AI Chat pomagający studentom',
  },
  description:
    'PUTagent to zaawansowany chatbot oparty na sztucznej inteligencji, który pomaga studentom i kandydatom na studia znaleźć odpowiedzi na pytania związane z edukacją w Polsce',
  openGraph: {
    title: 'PUTAgent | AI Chat pomagający studentom',
    type: 'website',
  },
};

const docsMetadata: Metadata = {
  ...layoutMetadata,
  title: 'Dokumentacja',
};

const chatMetadata: Metadata = {
  ...layoutMetadata,
  title: 'Czat',
};

const chatIdMetadata = (title: string): Metadata => ({
  ...layoutMetadata,
  title: title,
});

const notFoundMetadata: Metadata = {
  ...layoutMetadata,
  title: 'Strony nie znaleziono',
  description: 'Wystąpił błąd, strony nie znaleziono',
};

const loginMetadata: Metadata = {
  ...layoutMetadata,
  title: 'Logowanie',
};
const registerMetadata: Metadata = {
  ...layoutMetadata,
  title: 'Rejestracja',
};
const resetPasswordMetadata: Metadata = {
  ...layoutMetadata,
  title: 'Resetowanie hasła',
};
const activationMetadata: Metadata = {
  ...layoutMetadata,
  title: 'Weryfikacja adresu e-mail',
};
const confirmMetadata = (type: string): Metadata => ({
  ...layoutMetadata,
  title: `Potwierdź ${type}`,
});

export {
  layoutMetadata,
  docsMetadata,
  chatMetadata,
  chatIdMetadata,
  notFoundMetadata,
  loginMetadata,
  registerMetadata,
  resetPasswordMetadata,
  activationMetadata,
  confirmMetadata,
};
