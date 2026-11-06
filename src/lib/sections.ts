export interface Section {
  id: string;
  title: string;
  html: string;
}

const HEADING = /<h2\b[^>]*?\bid="([^"]*)"[^>]*>([\s\S]*?)<\/h2>/;

const plainText = (html: string): string => html.replace(/<[^>]+>/g, '').trim();

/** Splits rendered prose at each `##` heading, for experience layouts. */
export function splitSections(html: string): { intro: string; sections: Section[] } {
  const [intro = '', ...rest] = html.split(/(?=<h2\b)/);

  return {
    intro,
    sections: rest.map((chunk) => {
      const heading = chunk.match(HEADING);
      return {
        id: heading?.[1] ?? '',
        title: plainText(heading?.[2] ?? ''),
        html: chunk,
      };
    }),
  };
}
