// extracted text me legal keywords dhundo
export function isLegalDocument(text: string): boolean {
  const legalKeywords = [
    "contract",
    "agreement",
    "witness",
    "party",
    "legal",
    "terms",
  ];

  return legalKeywords.some((word) => text.toLowerCase().includes(word));
}
