export type SortDirection = 'asc' | 'desc';

/**
 * Normalizes a string for case- and accent-insensitive comparisons
 * (used by both search filtering and sorting).
 */
export function normalize(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Returns true when any of `haystack` contains `query`, ignoring case and
 * accents. An empty/blank query always matches (i.e. no filtering).
 */
export function matchesQuery(query: string | undefined, ...haystack: Array<unknown>): boolean {
  const q = normalize(query);
  if (!q) return true;
  return haystack.some((value) => normalize(value).includes(q));
}

type SortValue = string | number | boolean | null | undefined;

/**
 * Returns a sorted copy of `items`, ordered by the value `getValue` returns
 * for each item, honoring `direction`. Strings are compared locale-aware
 * (pt-BR), numbers/booleans numerically, and nullish/empty values always
 * sort last regardless of direction.
 */
export function sortItems<T>(
  items: T[],
  getValue: (item: T) => SortValue,
  direction: SortDirection
): T[] {
  const sign = direction === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    const va = getValue(a);
    const vb = getValue(b);

    const aEmpty = va === null || va === undefined || va === '';
    const bEmpty = vb === null || vb === undefined || vb === '';
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;

    if (typeof va === 'boolean' || typeof vb === 'boolean') {
      return (Number(va) - Number(vb)) * sign;
    }
    if (typeof va === 'number' && typeof vb === 'number') {
      return (va - vb) * sign;
    }
    return (
      String(va).localeCompare(String(vb), 'pt-BR', { sensitivity: 'base', numeric: true }) * sign
    );
  });
}

/**
 * Computes the next { key, direction } pair when a sortable column is
 * clicked: clicking the already-active column flips its direction,
 * clicking a different column switches to it in ascending order.
 */
export function nextSort<K extends string>(
  currentKey: K,
  currentDirection: SortDirection,
  clickedKey: K
): { key: K; direction: SortDirection } {
  if (currentKey === clickedKey) {
    return { key: clickedKey, direction: currentDirection === 'asc' ? 'desc' : 'asc' };
  }
  return { key: clickedKey, direction: 'asc' };
}
