enum baseFieldSearches {
  softwareDeveloper = 'software developer',
  backEndDeveloper = 'back end developer',
  frontEndDevloper = 'front end devloper',
  graphicDesigner = 'graphic designer',
  uxUi = 'ux ui',
  dataAnalytics = 'data analytics',
}

enum locationSearches {
  washington = 'washington',
  seattle = 'seattle',
  bellevue = 'bellevue',
  california = 'california',
  sanFrancisco = 'san francisco',
  la = 'la',
}

const BasefieldSearchesArray: string[] = [
  // 'software developer',
  // 'back end developer',
  'front end developer',
  // 'graphic designer',
  'ux ui',
  // 'data analytics',
];

const locationSearchesArray: string[] = ['washington', 'california'];

// search term: software developer
const softwareDeveloper: string[] = [
  'engineer',
  'engineering',
  'react',
  '.net',
  'java',
  ' c ',
  'c#',
  'c++',
  'javascript',
  'typescript',
  'go',
  'golang',
  'angular',
  'python',
  'apache',
  'ruby',
  'core',
  'mvc',
  'rest',
  'api',
  'ionic',
  'sql',
  'development',
  'node.js',
  'js',
  'wordpress',
  'devops',
  'dev ops',
  'front end',
  'back end',
];

// search term: graphic designer
const graphicDesiner: string[] = [' '];

// search term: graphic designer
const uxui: string[] = ['ux/ui', 'user experience', 'user interface'];

export {
  softwareDeveloper,
  graphicDesiner,
  uxui,
  locationSearches,
  baseFieldSearches,
  locationSearchesArray,
  BasefieldSearchesArray,
};
