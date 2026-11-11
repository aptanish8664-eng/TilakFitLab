// Training packages.
//
// price: null renders an editable "₹ [Add price]" placeholder. Set a number (e.g. 4999) to show
//        a formatted rupee amount (en-IN). priceNote is optional small text under the price,
//        e.g. 'per month'. Leave it '' if you do not want one.
// popular: true highlights a package as "Most Popular" (animated border). Use it on one package.
// purpose: the matching option in the contact form's "Purpose" dropdown (must match exactly).

export const packages = [
  {
    id: 'personal-training',
    code: 'A',
    name: 'Personal Training',
    summary: 'A customised plan with structure, guidance and tracking.',
    price: null,
    priceNote: '',
    popular: false,
    purpose: 'Personal Training',
    features: [
      'Customised workout plan',
      'Structured training schedule',
      'Exercise guidance',
      'Training progression',
      'Progress monitoring',
    ],
  },
  {
    id: 'personal-training-diet',
    code: 'B',
    name: 'Personal Training + Diet',
    summary: 'Everything in Package A, with nutrition built in.',
    price: null,
    priceNote: '',
    popular: true,
    purpose: 'Personal Training + Diet',
    features: [
      'Everything in Package A',
      'Personalised nutrition guidance',
      'Diet planning',
      'Regular dietary adjustments',
      'Progress monitoring',
    ],
  },
  {
    id: 'competition-preparation',
    code: 'C',
    name: 'Competition Preparation',
    summary: 'Focused preparation for the stage.',
    price: null,
    priceNote: '',
    popular: false,
    purpose: 'Competition Preparation',
    features: [
      'Competition-focused training',
      'Bodybuilding preparation',
      'Conditioning guidance',
      'Nutrition guidance',
      'Competition preparation strategy',
      'Progress monitoring',
    ],
  },
  {
    id: 'online-coaching',
    code: 'D',
    name: 'Online Coaching',
    summary: 'Coaching that works wherever you train.',
    price: null,
    priceNote: '',
    popular: false,
    purpose: 'Online Coaching',
    features: [
      'Remote fitness coaching',
      'Customised workout plans',
      'Online progress tracking',
      'Regular consultations',
    ],
  },
];

// Options for the contact form. Keep these in sync with `packages[].purpose` above.
export const purposeOptions = [
  'Personal Training',
  'Personal Training + Diet',
  'Competition Preparation',
  'Online Coaching',
  'General Fitness Guidance',
  'Other',
];

export const NOT_SURE = 'Not sure yet';
export const packageOptions = [...packages.map((p) => p.name), NOT_SURE];
