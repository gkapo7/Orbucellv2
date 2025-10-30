export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  date: string
  author: string
  tags?: string[]
}

export const posts: BlogPost[] = [
  {
    id: '1',
    title: 'Fueling Performance: The Science Behind Whey Protein',
    slug: 'science-behind-whey-protein',
    excerpt:
      'Discover how whey protein supports muscle recovery, lean mass, and sustained performance backed by research.',
    content:
      'Whey protein is rapidly absorbed and rich in essential amino acids, especially leucine, which triggers muscle protein synthesis. For most people training 3-5x/week, 20-30g post-workout is an effective target. Pair with carbs for improved glycogen replenishment. Quality matters—look for transparent labeling, minimal additives, and third-party testing.',
    image: '/images/whey.svg',
    date: '2025-09-18',
    author: 'Orbucell Team',
    tags: ['protein', 'recovery', 'training'],
  },
  {
    id: '2',
    title: 'Do You Really Need BCAAs?',
    slug: 'do-you-need-bcaas',
    excerpt:
      'BCAAs vs complete proteins: when they help, when they don’t, and how to decide.',
    content:
      'BCAAs can help reduce perceived fatigue in long sessions, but for most people, complete protein sources (like whey) outperform isolated BCAAs for recovery and hypertrophy. Consider BCAAs when training fasted or during long endurance work where total protein intake is constrained.',
    image: '/images/bcaa.svg',
    date: '2025-10-05',
    author: 'Orbucell Team',
    tags: ['BCAA', 'endurance'],
  },
  {
    id: '3',
    title: 'Pre-Workout: What Actually Works',
    slug: 'pre-workout-what-works',
    excerpt:
      'A simple, evidence-based stack: caffeine, beta-alanine, and citrulline malate.',
    content:
      'Skip proprietary blends. Effective pre-workouts prioritize known actives at clinical doses: caffeine (3-6 mg/kg), beta-alanine (3.2-6.4 g/day, chronic), and citrulline malate (6-8 g pre). Hydration and electrolytes significantly impact performance—don’t overlook them.',
    image: '/images/pre.svg',
    date: '2025-10-20',
    author: 'Orbucell Team',
    tags: ['pre-workout', 'caffeine'],
  },
]


