const BasefieldSearchesArray: string[] = [
  'software developer',
  'back end developer',
  'front end developer',
  'ux ui',
  // 'graphic designer',
  // 'data analytics',
];

const locationSearchesArray: string[] = ['washington', 'california'];

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
  'programmer',
  'programming',
  'development',
  'full stack',
];

enum baseFieldSearches {
  softwareDeveloper = 'software developer',
  backEndDeveloper = 'back end developer',
  frontEndDevloper = 'front end developer',
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

// search term: software developer

// search term: graphic designer
const graphicDesiner: string[] = [' '];

// search term: graphic designer
const uxui: string[] = ['ux/ui', 'user experience', 'user interface'];

function getSearches(): string[][] {
  const searches = [];
  locationSearchesArray.forEach((location) => {
    BasefieldSearchesArray.forEach((job) => {
      searches.push([location, job]);
    });
  });
  return searches;
}

export {
  softwareDeveloper,
  graphicDesiner,
  uxui,
  locationSearches,
  baseFieldSearches,
  locationSearchesArray,
  BasefieldSearchesArray,
  getSearches,
};
