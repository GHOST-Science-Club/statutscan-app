import { Metadata } from 'next';

const layoutMetadata: Metadata = {
  metadataBase: new URL(process.env.HOST || 'http://localhost:3000'),
  title: {
    template: '%s | StatutScan',
    default: 'StatutScan | AI Chat pomagający studentom',
  },
  description:
    'StatutScan to zaawansowany chatbot oparty na sztucznej inteligencji, który pomaga studentom i kandydatom na studia znaleźć odpowiedzi na pytania związane z edukacją w Polsce',
  openGraph: {
    title: 'StatutScan | AI Chat pomagający studentom',
    type: 'website',
  },
};

const chatMetadata: Metadata = {
  ...layoutMetadata,
  title: 'Czat',
};

const chatIdMetadata = (title: string): Metadata => ({
  ...layoutMetadata,
  title,
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
const loginGoogleMetadata: Metadata = {
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

const aboutMetadata: Metadata = {
  ...layoutMetadata,
  title: 'Dokumentacja',
};

const authorsMetadata: Metadata = {
  ...layoutMetadata,
  title: 'O autorach',
};

const docsMetadata: Metadata = {
  ...layoutMetadata,
  title: 'O projekcie',
};

export {
  layoutMetadata,
  chatMetadata,
  chatIdMetadata,
  notFoundMetadata,
  loginMetadata,
  loginGoogleMetadata,
  registerMetadata,
  resetPasswordMetadata,
  activationMetadata,
  confirmMetadata,
  aboutMetadata,
  authorsMetadata,
  docsMetadata,
};
