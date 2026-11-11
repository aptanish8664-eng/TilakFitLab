// Site-wide configuration. Everything you are likely to edit lives in src/data/*.

export const site = {
  brand: 'TilakFitLab',
  domain: 'tilakfitlab.in',
  url: 'https://tilakfitlab.in/',
  tagline: 'Train with precision. Build with discipline.',
  footerBlurb:
    'Personal training, nutrition guidance, competition preparation and online coaching, with a knowledge hub to help you understand the work behind the results.',

  // Section ids must match the id on each <section> in the page.
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'knowledge', label: 'Knowledge Hub' },
    { id: 'pricing', label: 'Training Programs' },
    { id: 'contact', label: 'Contact' },
  ],

  // ---------------------------------------------------------------------------
  // WHATSAPP
  // PLACEHOLDER NUMBER: replace with country code + number, digits only.
  // Example for an Indian mobile: '919876543210'. Until then the buttons render and the link is
  // well-formed, but it will not open a real chat.
  // ---------------------------------------------------------------------------
  whatsapp: {
    number: '91XXXXXXXXXX',
    message:
      'Hello, I am interested in your fitness training programs. I would like to know more about your services.',
  },

  // Must match the `name` of the static form in index.html and public/forms.html.
  formName: 'contact',
};
