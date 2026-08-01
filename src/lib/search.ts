export type SearchResult = {
  title: string;
  type: string;
  excerpt: string;
  href: string;
};

export function normaliseQuery(value: string | undefined): string {
  return value?.trim().replace(/\s+/g, " ").slice(0, 80) ?? "";
}

export function filterSearchResults(results: ReadonlyArray<SearchResult>, query: string): ReadonlyArray<SearchResult> {
  const terms = normaliseQuery(query).toLowerCase().split(" ").filter(Boolean);
  if (terms.length === 0) return [];

  return results.filter((result) => {
    const haystack = `${result.title} ${result.type} ${result.excerpt}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
