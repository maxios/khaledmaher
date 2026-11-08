export interface DictionaryEntry {
  term: string;
  sense: string;
  definition: string;
  status: string;
  /** Only for work a visitor can actually open. */
  href?: string;
}

export const dictionary: DictionaryEntry[] = [
  {
    term: 'DEP',
    sense: 'noun · Documentation Engineering Protocol',
    definition:
      'Documentation that people and AI can both rely on. Every document has one type, one audience and a lifecycle, so nothing rots unnoticed.',
    status: 'MIT · public',
    href: 'https://github.com/maxios/DEP',
  },
  {
    term: 'Strata',
    sense: 'noun · Latin for layers',
    definition:
      'Software built as a stack of machine-readable maps. Each pass reads the one before it, so the map carries the work, not anyone’s memory.',
    status: 'MIT · strata-studio.net',
    href: 'https://strata-studio.net/',
  },
  {
    term: 'MFP',
    sense: 'noun · Model Flow Protocol',
    definition:
      'How a job moves across AI tools. MCP says what a tool can do. MFP says what happens, and in what order.',
    status: 'Apache-2.0 · not public yet',
  },
  {
    term: 'Receta',
    sense: 'noun · Spanish for recipe',
    definition:
      'The Receta library: practical recipes for real-world TypeScript, built on Remeda.',
    status: 'MIT · public',
    href: 'https://receta.dev/',
  },
  {
    term: 'Software Receta',
    sense: 'noun · a course in kitchen terms',
    definition:
      'How software works, for people who work with it but don’t build it. Short narrated lessons, and the first one is free.',
    status: 'course · receta.academy',
    href: 'https://receta.academy/',
  },
  {
    term: 'schedule-bit',
    sense: 'noun · a scheduling API',
    definition:
      'Scheduling that never double-books. Book rooms, machines and people through one API, and always get a yes or a clear reason why not.',
    status: 'beta · schedule-bit.io',
    href: 'https://schedule-bit.io/',
  },
  {
    term: 'Baton',
    sense: 'noun · what a relay passes on',
    definition:
      'Jobs that cross companies, run in one place. Every hour is held once and every handover is on the record, so nothing gets dropped between them.',
    status: 'baton.schedule-bit.io',
    href: 'https://baton.schedule-bit.io/',
  },
  {
    term: 'Kaizu',
    sense: 'noun · points, streaks and badges',
    definition:
      'A game engine for products that aren’t games. Write the rules as data, send what your users do, and Kaizu keeps score and tells you what changed.',
    status: 'in design · usekaizu.io',
    href: 'https://usekaizu.io/',
  },
];

export const lab = ['git-sem', 'rness', 'Loop intelligence'];
