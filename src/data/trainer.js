// Trainer profile. Everything wrapped in [square brackets] is a PLACEHOLDER: it is rendered in a
// clearly marked "to be replaced" style so nothing invented ever looks like real content.
// Replace the text (and remove the brackets) as you go.

export const trainer = {
  // ---- Hero ---------------------------------------------------------------
  name: '[Trainer Name]',
  designation: '[Professional Designation]',
  headline: 'Strength built on discipline',
  heroIntro:
    'Personalised training, structured coaching and honest guidance for bodybuilding and everyday fitness.',

  // ---- About --------------------------------------------------------------
  fullName: '[Trainer Full Name]',

  // PLACEHOLDER IMAGE: src/assets/images/trainer.jpg is a generated silhouette.
  // Overwrite that file (any of .jpg .png .webp .avif works) with the real photograph,
  // then set photoIsPlaceholder to false to hide the "Placeholder photo" tag.
  photoAlt: 'Portrait of the TilakFitLab trainer',
  photoIsPlaceholder: true,

  background: [
    '[Add your professional background: education, how you entered the fitness industry, where you have worked.]',
  ],
  journey: [
    '[Add your fitness journey: where you started, the turning points, what shaped your approach.]',
  ],
  experience: '[Add your experience, e.g. years coaching and the kinds of clients you have worked with.]',
  philosophy: '[Add your training philosophy in a sentence or two. This is displayed as a pull quote.]',
  approach:
    '[Describe your approach to bodybuilding and fitness: how you plan training, manage progression and nutrition.]',

  certifications: ['[Add certification, issuing body, year]', '[Add certification, issuing body, year]'],
  specialisations: ['[Add specialisation]', '[Add specialisation]', '[Add specialisation]'],

  // ---- Stats strip --------------------------------------------------------
  // Leave empty until you have REAL numbers. The strip is not rendered when this is empty or
  // when an entry has no numeric value, so there is never a fake statistic on the page.
  // Example: { label: 'Years coaching', value: 8, suffix: '+' }
  stats: [],
};
