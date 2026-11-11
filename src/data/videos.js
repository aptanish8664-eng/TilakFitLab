// Knowledge Hub video library.
//
// HOW TO ADD A VIDEO (this file is the only thing you edit):
//   1. Drop the file into  src/assets/videos/   (or use a link, see below).
//   2. Add an entry to the `videos` array:
//        {
//          id: 'squat-depth',                  // unique, no spaces
//          title: 'Squat depth explained',
//          category: 'exercise-techniques',    // one of the ids in `categories` below
//          description: 'One or two sentences.',
//          duration: '8:42',                   // optional
//          thumbnail: 'squat.jpg',             // optional: file in src/assets/images/ or a URL.
//                                              // Missing -> a category-coloured placeholder is used.
//          src: 'squat-depth.mp4',             // file name in src/assets/videos/
//          type: 'local',
//        }
//   3. External links: type: 'external' and src: a YouTube / Vimeo link (converted to a proper embed
//      automatically; YouTube uses youtube-nocookie) or a direct https://...mp4 URL.
//        { id: 'yt-1', title: '...', category: 'nutrition-and-diet', description: '...',
//          duration: '12:03', thumbnail: null, src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX', type: 'external' }
//
// Anything already inside /public can be referenced with a leading slash, e.g. '/videos/big-file.mp4'.

export const categories = [
  { id: 'human-anatomy', label: 'Human Anatomy' },
  { id: 'muscle-groups', label: 'Muscle Groups' },
  { id: 'muscle-growth-and-hypertrophy', label: 'Muscle Growth & Hypertrophy' },
  { id: 'exercise-techniques', label: 'Exercise Techniques' },
  { id: 'nutrition-and-diet', label: 'Nutrition & Diet' },
  { id: 'recovery-and-injury-prevention', label: 'Recovery & Injury Prevention' },
  { id: 'bodybuilding-science', label: 'Bodybuilding Science' },
];

// PLACEHOLDERS: every entry below plays the same generated clip (src/assets/videos/sample.mp4) with a
// generated category thumbnail. Delete or replace them with your real videos.
// ("bodybuilding-science" intentionally has no sample, so you can see the empty state.)
export const videos = [
  {
    id: 'sample-anatomy',
    title: 'Sample video: replace me',
    category: 'human-anatomy',
    description: 'Placeholder entry. Replace with a video about how the muscular and skeletal systems fit together.',
    duration: '0:04',
    thumbnail: null,
    src: 'sample.mp4',
    type: 'local',
  },
  {
    id: 'sample-muscle-groups',
    title: 'Sample video: replace me',
    category: 'muscle-groups',
    description: 'Placeholder entry. Replace with a breakdown of a muscle group and how to train it.',
    duration: '0:04',
    thumbnail: null,
    src: 'sample.mp4',
    type: 'local',
  },
  {
    id: 'sample-hypertrophy',
    title: 'Sample video: replace me',
    category: 'muscle-growth-and-hypertrophy',
    description: 'Placeholder entry. Replace with a video on how muscle growth works.',
    duration: '0:04',
    thumbnail: null,
    src: 'sample.mp4',
    type: 'local',
  },
  {
    id: 'sample-technique',
    title: 'Sample video: replace me',
    category: 'exercise-techniques',
    description: 'Placeholder entry. Replace with an exercise technique demonstration.',
    duration: '0:04',
    thumbnail: null,
    src: 'sample.mp4',
    type: 'local',
  },
  {
    id: 'sample-nutrition',
    title: 'Sample video: replace me',
    category: 'nutrition-and-diet',
    description: 'Placeholder entry. Replace with a nutrition or diet guide.',
    duration: '0:04',
    thumbnail: null,
    src: 'sample.mp4',
    type: 'local',
  },
  {
    id: 'sample-recovery',
    title: 'Sample video: replace me',
    category: 'recovery-and-injury-prevention',
    description: 'Placeholder entry. Replace with a recovery or injury-prevention video.',
    duration: '0:04',
    thumbnail: null,
    src: 'sample.mp4',
    type: 'local',
  },
];
