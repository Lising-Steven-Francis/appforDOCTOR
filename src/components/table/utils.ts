// ----------------------------------------------------------------------

export function rowInPage<T>(data: T[], page: number, rowsPerPage: number) {
  return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

/**
 * @example
 * const data = {
 *   calories: 360,
 *   align: 'center',
 *   more: {
 *     protein: 42,
 *   },
 * };
 *
 * const ex1 = getNestedProperty(data, 'calories');
 * console.log('ex1', ex1); // output: 360
 *
 * const ex2 = getNestedProperty(data, 'align');
 * console.log('ex2', ex2); // output: center
 *
 * const ex3 = getNestedProperty(data, 'more.protein');
 * console.log('ex3', ex3); // output: 42
 */
function getNestedProperty<T>(obj: T, key: string): string | number | boolean | null {
  return key.split('.').reduce((acc: Record<string, unknown> | null, part: string) => acc && acc[part] as Record<string, unknown> | null, obj as Record<string, unknown>) as string | number | boolean | null;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aValue = getNestedProperty(a, orderBy as string);
  const bValue = getNestedProperty(b, orderBy as string);

  if (bValue == null && aValue == null) return 0;
  if (bValue == null) return -1;
  if (aValue == null) return 1;

  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

// ----------------------------------------------------------------------

export function getComparator<Key extends string>(
  order: 'asc' | 'desc',
  orderBy: Key
): (a: { [key in Key]: number | string | boolean | null }, b: { [key in Key]: number | string | boolean | null }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
