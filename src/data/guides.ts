export interface Guide {
  title: string;
  date: string;
  pages: number;
  /** Add this once the guide has a public home. Until then its row isn't a link. */
  url?: string;
}

export const guides: Guide[] = [
  { title: 'The Mindcache Framework', date: '2026-10-29', pages: 25 },
  { title: 'The Mindcache Stack', date: '2026-10-29', pages: 14 },
  { title: 'Architecture in the Age of AI: the Strata framework', date: '2026-10-29', pages: 17 },
  { title: 'Code in the Age of AI: the Receta framework', date: '2026-10-29', pages: 17 },
  { title: 'Business in the Age of AI', date: '2026-10-29', pages: 19 },
  { title: 'The Company as an Intelligent Loop', date: '2026-10-29', pages: 18 },
  { title: 'The Product Owner in the Age of AI', date: '2026-10-28', pages: 20 },
  { title: 'Scrum in the Age of AI', date: '2026-10-26', pages: 18 },
];
