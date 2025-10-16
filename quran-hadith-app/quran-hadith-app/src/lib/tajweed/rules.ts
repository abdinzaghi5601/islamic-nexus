/**
 * Tajweed Rules Configuration
 *
 * This file contains the standard Tajweed rules used in Quran recitation,
 * organized by category with color codes for visualization.
 */

export interface TajweedRuleDefinition {
  id: string;
  name: string;
  nameArabic: string;
  category: TajweedCategory;
  color: string;
  textColor: string;
  description: string;
  examples: string[];
}

export type TajweedCategory =
  | 'Ghunnah'      // Nasalization
  | 'Idghaam'      // Merging
  | 'Ikhfa'        // Concealment
  | 'Iqlab'        // Conversion
  | 'Qalqalah'     // Echoing
  | 'Madd'         // Prolongation
  | 'Lam'          // Rules of Lam
  | 'Ra'           // Rules of Ra
  | 'Silent'       // Silent letters
  | 'Hamza'        // Hamza rules
  | 'Meem';        // Meem rules

/**
 * Standard Tajweed Color Scheme
 * Based on popular Mushaf color-coding systems
 */
export const TAJWEED_RULES: TajweedRuleDefinition[] = [
  // ============================================================================
  // GHUNNAH (Nasalization) - 2 counts
  // ============================================================================
  {
    id: 'ghunnah',
    name: 'Ghunnah',
    nameArabic: 'غُنَّة',
    category: 'Ghunnah',
    color: '#FFD700',  // Gold
    textColor: '#000000',
    description: 'Nasalization for 2 counts when Noon or Meem is followed by certain letters',
    examples: ['مِنْ بَعْدِ', 'عَمَّنْ'],
  },

  // ============================================================================
  // IDGHAAM (Merging)
  // ============================================================================
  {
    id: 'idghaam-ghunnah',
    name: 'Idghaam with Ghunnah',
    nameArabic: 'إدغام بغنة',
    category: 'Idghaam',
    color: '#90EE90',  // Light Green
    textColor: '#000000',
    description: 'Merging Noon Sakinah or Tanween with Ghunnah (ي ن م و)',
    examples: ['مِنْ يَشَاءُ', 'مَنْ وَالِيَةٍ'],
  },
  {
    id: 'idghaam-no-ghunnah',
    name: 'Idghaam without Ghunnah',
    nameArabic: 'إدغام بلا غنة',
    category: 'Idghaam',
    color: '#98FB98',  // Pale Green
    textColor: '#000000',
    description: 'Merging Noon Sakinah or Tanween without Ghunnah (ل ر)',
    examples: ['مِنْ رَبِّهِمْ', 'هُدًى لِلْمُتَّقِينَ'],
  },
  {
    id: 'idghaam-mutamathalyn',
    name: 'Idghaam Mutamathalyn',
    nameArabic: 'إدغام متماثلين',
    category: 'Idghaam',
    color: '#7CFC00',  // Lawn Green
    textColor: '#000000',
    description: 'Merging two identical letters',
    examples: ['اذْهَبْ بِكِتَابِي'],
  },

  // ============================================================================
  // IKHFA (Concealment)
  // ============================================================================
  {
    id: 'ikhfa',
    name: 'Ikhfa',
    nameArabic: 'إخفاء',
    category: 'Ikhfa',
    color: '#FFA500',  // Orange
    textColor: '#000000',
    description: 'Concealing Noon Sakinah or Tanween before 15 specific letters',
    examples: ['مِنْ كُلِّ', 'عَلِيمٌ خَبِيرٌ'],
  },
  {
    id: 'ikhfa-shafawi',
    name: 'Ikhfa Shafawi',
    nameArabic: 'إخفاء شفوي',
    category: 'Ikhfa',
    color: '#FFB347',  // Light Orange
    textColor: '#000000',
    description: 'Concealing Meem Sakinah before Ba',
    examples: ['يَعْتَصِمْ بِاللَّهِ'],
  },

  // ============================================================================
  // IQLAB (Conversion)
  // ============================================================================
  {
    id: 'iqlab',
    name: 'Iqlab',
    nameArabic: 'إقلاب',
    category: 'Iqlab',
    color: '#FF69B4',  // Hot Pink
    textColor: '#FFFFFF',
    description: 'Converting Noon Sakinah or Tanween to Meem before Ba',
    examples: ['مِنْ بَعْدِ', 'سَمِيعٌ بَصِيرٌ'],
  },

  // ============================================================================
  // QALQALAH (Echoing)
  // ============================================================================
  {
    id: 'qalqalah-kubra',
    name: 'Qalqalah Kubra (Major)',
    nameArabic: 'قلقلة كبرى',
    category: 'Qalqalah',
    color: '#4169E1',  // Royal Blue
    textColor: '#FFFFFF',
    description: 'Strong echoing sound at the end of words (ق ط ب ج د)',
    examples: ['وَالْفَجْرِ', 'الْبَيْتِ'],
  },
  {
    id: 'qalqalah-sughra',
    name: 'Qalqalah Sughra (Minor)',
    nameArabic: 'قلقلة صغرى',
    category: 'Qalqalah',
    color: '#87CEEB',  // Sky Blue
    textColor: '#000000',
    description: 'Light echoing sound in the middle of words (ق ط ب ج د)',
    examples: ['يَقْطَعُونَ'],
  },

  // ============================================================================
  // MADD (Prolongation)
  // ============================================================================
  {
    id: 'madd-tabii',
    name: 'Madd Tabii (Natural)',
    nameArabic: 'مد طبيعي',
    category: 'Madd',
    color: '#00CED1',  // Dark Turquoise
    textColor: '#000000',
    description: 'Natural prolongation for 2 counts',
    examples: ['قَالَ', 'يَقُولُ'],
  },
  {
    id: 'madd-muttasil',
    name: 'Madd Muttasil (Connected)',
    nameArabic: 'مد متصل',
    category: 'Madd',
    color: '#FF4500',  // Orange Red
    textColor: '#FFFFFF',
    description: 'Prolongation for 4-5 counts when followed by Hamza in same word',
    examples: ['جَاءَ', 'السَّمَاءِ'],
  },
  {
    id: 'madd-munfasil',
    name: 'Madd Munfasil (Separated)',
    nameArabic: 'مد منفصل',
    category: 'Madd',
    color: '#9370DB',  // Medium Purple
    textColor: '#FFFFFF',
    description: 'Prolongation for 2-5 counts when followed by Hamza in next word',
    examples: ['فِي أَنفُسِكُمْ', 'قُوا أَنفُسَكُمْ'],
  },
  {
    id: 'madd-lazim',
    name: 'Madd Lazim (Necessary)',
    nameArabic: 'مد لازم',
    category: 'Madd',
    color: '#8B0000',  // Dark Red
    textColor: '#FFFFFF',
    description: 'Prolongation for 6 counts (compulsory prolongation)',
    examples: ['الصَّاخَّةُ', 'الْحَاقَّةُ'],
  },
  {
    id: 'madd-arid-sukun',
    name: 'Madd Arid Lis-Sukun',
    nameArabic: 'مد عارض للسكون',
    category: 'Madd',
    color: '#00BFFF',  // Deep Sky Blue
    textColor: '#000000',
    description: 'Prolongation for 2, 4, or 6 counts when stopping on a word',
    examples: ['الرَّحِيمِ', 'نَسْتَعِينُ'],
  },

  // ============================================================================
  // LAM RULES
  // ============================================================================
  {
    id: 'lam-shamsiyyah',
    name: 'Lam Shamsiyyah',
    nameArabic: 'لام شمسية',
    category: 'Lam',
    color: '#FFD700',  // Gold
    textColor: '#000000',
    description: 'Silent Lam in "ال" before sun letters',
    examples: ['الشَّمْس', 'الرَّحْمَن'],
  },
  {
    id: 'lam-qamariyyah',
    name: 'Lam Qamariyyah',
    nameArabic: 'لام قمرية',
    category: 'Lam',
    color: '#C0C0C0',  // Silver
    textColor: '#000000',
    description: 'Pronounced Lam in "ال" before moon letters',
    examples: ['الْقَمَر', 'الْكِتَاب'],
  },

  // ============================================================================
  // RA RULES
  // ============================================================================
  {
    id: 'ra-tafkhim',
    name: 'Ra Tafkhim (Heavy)',
    nameArabic: 'راء مفخمة',
    category: 'Ra',
    color: '#DC143C',  // Crimson
    textColor: '#FFFFFF',
    description: 'Heavy pronunciation of Ra',
    examples: ['رَبِّ', 'مُسْتَقِرٌّ'],
  },
  {
    id: 'ra-tarqiq',
    name: 'Ra Tarqiq (Light)',
    nameArabic: 'راء مرققة',
    category: 'Ra',
    color: '#FFB6C1',  // Light Pink
    textColor: '#000000',
    description: 'Light pronunciation of Ra',
    examples: ['مِرْيَةٍ'],
  },

  // ============================================================================
  // SILENT LETTERS
  // ============================================================================
  {
    id: 'silent-letter',
    name: 'Silent Letter',
    nameArabic: 'حرف صامت',
    category: 'Silent',
    color: '#D3D3D3',  // Light Gray
    textColor: '#000000',
    description: 'Letter that is not pronounced',
    examples: ['عَمِلُوا'],
  },

  // ============================================================================
  // MEEM RULES
  // ============================================================================
  {
    id: 'meem-idghaam',
    name: 'Meem Sakinah Idghaam',
    nameArabic: 'إدغام الميم الساكنة',
    category: 'Meem',
    color: '#32CD32',  // Lime Green
    textColor: '#000000',
    description: 'Merging Meem Sakinah with another Meem',
    examples: ['لَكُمْ مَا'],
  },
];

/**
 * Get rule by ID
 */
export function getTajweedRule(id: string): TajweedRuleDefinition | undefined {
  return TAJWEED_RULES.find(rule => rule.id === id);
}

/**
 * Get all rules by category
 */
export function getTajweedRulesByCategory(category: TajweedCategory): TajweedRuleDefinition[] {
  return TAJWEED_RULES.filter(rule => rule.category === category);
}

/**
 * Get all categories
 */
export function getTajweedCategories(): TajweedCategory[] {
  return Array.from(new Set(TAJWEED_RULES.map(rule => rule.category)));
}
