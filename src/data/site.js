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

  // WhatsApp: country code + number, digits only. Every WhatsApp link on the site reads this.
  whatsapp: {
    number: '919008183555',
    message:
      'Hello, I am interested in your fitness training programs. I would like to know more about your services.',
  },

  // Must match the `name` of the static form in index.html and public/forms.html.
  formName: 'contact',
};
