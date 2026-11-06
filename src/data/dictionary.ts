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
    status: 'MIT · not public yet',
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
    href: 'https://github.com/ontology-io/receta',
  },
];

export const lab = ['git-sem', 'rness', 'Loop intelligence'];
