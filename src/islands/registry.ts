import { z } from 'zod';

/**
 * Every fence language that becomes an island, and the props it accepts.
 * Schemas are strict so a typo like `sped: 2` fails the build instead of being
 * ignored. To add one: add it here, then add its line to `components/Island.astro`.
 */
export const islands = {
  sim: z.strictObject({
    type: z.enum(['loop', 'wave']).default('loop'),
    speed: z.number().min(0.1).max(10).default(1),
    nodes: z.number().int().min(3).max(12).default(5),
    caption: z.string().optional(),
  }),
};

export type IslandName = keyof typeof islands;

export function isIsland(language: string | null | undefined): language is IslandName {
  return typeof language === 'string' && Object.hasOwn(islands, language);
}
