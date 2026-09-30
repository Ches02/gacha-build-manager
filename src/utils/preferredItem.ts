export function getPreferredOrFirst<T extends { isPreferred: boolean }>(
  items: T[],
): T | undefined {
  return (
    items.find((item) => item.isPreferred) ??
    items[0]
  );
}