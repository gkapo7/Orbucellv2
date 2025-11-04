export type ArticleSEO = {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonicalUrl?: string
}

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
  category?: string
  featured?: boolean
  readingTime?: string
  seo: ArticleSEO
  // Styling options
  headingLevel?: 'h1' | 'h2'
  fontFamily?: string
  fontSize?: string
  textColor?: string
}

export const posts: BlogPost[] = [
  {
    id: '1',
    title: 'Why Magnesium Bisglycinate Stands Out: Absorption, Benefits and Myths',
    slug: 'why-magnesium-bisglycinate-stands-out',
    excerpt:
      'Learn how magnesium bisglycinate compares with other forms, what science says about its benefits, and how to use it wisely.',
    content:
      'Magnesium plays a role in hundreds of biochemical reactions, yet diet surveys suggest many of us are falling short. With shelves full of magnesium oxide, citrate, chloride and newer entrants like L-threonate, it is fair to wonder which form actually delivers. Magnesium bisglycinate—also called magnesium glycinate—is a chelated form in which magnesium is bound to two molecules of the amino acid glycine. Chelation shields the mineral as it moves through the digestive tract, improving absorption and making it gentler on the stomach than many inorganic forms.\n\nClinical studies and practitioner experience indicate that chelated magnesium is better tolerated than magnesium oxide or citrate, both of which can pull water into the intestines and trigger loose stools. Because magnesium bisglycinate does not rely on stomach acidity, it is well suited to people with digestive sensitivities. Research-backed benefits include support for relaxation and mood, bone health, blood-sugar regulation, cardiovascular rhythm and even relief of pre-menstrual discomfort. Magnesium is not a cure-all—sleep, stress and gut health still require holistic care—but sufficient intake is foundational.\n\nChoosing a supplement comes down to a few practical tips. Look for the amount of elemental magnesium per serving, consider complementary nutrients only when deficiencies are confirmed, and start with a moderate dose (100–200 mg) before adjusting. Most importantly, take magnesium consistently and separate it from medications such as antibiotics or bisphosphonates by at least two hours. Combined with a diet rich in leafy greens, legumes and nuts, magnesium bisglycinate can be a reliable way to fill nutritional gaps without upsetting digestion.',
    image: '/images/magnesium.svg',
    date: '2025-02-12',
    author: 'Orbucell Team',
    tags: ['magnesium', 'supplements', 'evidence-based'],
    category: 'Magnesium',
    featured: true,
    readingTime: '6 min read',
    seo: {
      title: 'Why Magnesium Bisglycinate Stands Out | Orbucell Learn',
      description:
        'Discover why magnesium bisglycinate delivers reliable absorption, how it compares to other forms, and practical tips for daily use.',
      keywords: ['magnesium bisglycinate benefits', 'magnesium glycinate absorption', 'magnesium myths'],
      ogImage: '/images/magnesium-og.png',
      canonicalUrl: 'https://orbucell.com/learn/why-magnesium-bisglycinate-stands-out',
    },
  },
  {
    id: '2',
    title: 'Psyllium Fiber 101: A Natural Ally for Digestive and Heart Health',
    slug: 'psyllium-fiber-101',
    excerpt:
      'Explore what psyllium is, the science-backed benefits it offers, and how to add it to your routine safely.',
    content:
      'Fiber is one of the most overlooked nutrients in modern diets. Psyllium, the gel-forming husk from Plantago ovata seeds, is a soluble fiber with a long history of use as a gentle laxative. When it meets water, psyllium creates a viscous gel that travels through the digestive tract. This gel adds moisture and bulk to stools, easing constipation, yet it also firms loose stools and slows transit time—making it helpful for mild diarrhea.\n\nThe benefits extend beyond digestive comfort. Taking psyllium before meals can dampen post-meal blood-sugar spikes by slowing carbohydrate absorption. Meta-analyses report meaningful reductions in LDL and total cholesterol when people consume 6–15 grams daily, contributing to cardiovascular health. Because the gel increases fullness and delays stomach emptying, psyllium may support appetite control, and its prebiotic properties nourish beneficial gut bacteria.\n\nTo introduce psyllium, start with a teaspoon of powder (about five grams) or an equivalent capsule serving and increase gradually to 10–15 grams per day. Always follow with plenty of water to prevent choking or blockage. Space psyllium at least two hours away from medications because it can slow drug absorption. Combined with a diet rich in fruits, vegetables and whole grains, psyllium is a versatile tool for digestive and metabolic wellness.',
    image: '/images/fiber.svg',
    date: '2025-02-19',
    author: 'Orbucell Team',
    tags: ['fiber', 'gut health', 'heart health'],
    category: 'Fiber',
    featured: false,
    readingTime: '7 min read',
    seo: {
      title: 'Psyllium Fiber 101 | Orbucell Learn',
      description:
        'Understand how psyllium fiber supports digestion, blood sugar, and heart health with evidence-backed guidance on daily use.',
      keywords: ['psyllium fiber benefits', 'soluble fiber supplement', 'gut health tips'],
      ogImage: '/images/fiber-og.png',
      canonicalUrl: 'https://orbucell.com/learn/psyllium-fiber-101',
    },
  },
  {
    id: '3',
    title: 'Comparing Magnesium Forms: Oxide vs. Citrate vs. Glycinate',
    slug: 'comparing-magnesium-forms',
    excerpt:
      'Understand how different magnesium salts behave in the body so you can match the right form to your needs.',
    content:
      'Shopping for magnesium can be confusing. Magnesium oxide packs a high percentage of elemental magnesium, but it is poorly absorbed and often used as an antacid or osmotic laxative. Magnesium citrate is better absorbed and commonly chosen for constipation relief, yet the same mechanism that draws water into the bowel can be unwelcome when you simply want calm.\n\nMagnesium bisglycinate—also called glycinate—is a chelated form in which magnesium is bound to glycine. Chelation improves absorption, avoids the laxative effect and introduces glycine, a calming amino acid that supports relaxation. It tends to be more expensive but often delivers better value because the body retains more of what you take.\n\nNo single form is perfect for everyone. Individuals with constipation might prefer citrate, whereas those seeking systemic benefits without digestive upset often choose bisglycinate. Regardless of the form, look for the elemental magnesium amount, third-party testing and a clean ingredient list. If you take medications or have a health condition, consult your healthcare professional for personalised guidance.',
    image: '/images/magnesium.svg',
    date: '2025-02-26',
    author: 'Orbucell Team',
    tags: ['magnesium', 'education'],
    category: 'Magnesium',
    featured: false,
    readingTime: '5 min read',
    seo: {
      title: 'Magnesium Oxide vs. Citrate vs. Glycinate | Orbucell Learn',
      description:
        'Compare popular magnesium supplements—oxide, citrate, and glycinate—to find the form that best matches your needs.',
      keywords: ['magnesium oxide', 'magnesium citrate', 'magnesium glycinate comparison'],
      ogImage: '/images/magnesium-og.png',
      canonicalUrl: 'https://orbucell.com/learn/comparing-magnesium-forms',
    },
  },
  {
    id: '4',
    title: 'How to Incorporate Fiber into a Busy Lifestyle',
    slug: 'fiber-for-a-busy-lifestyle',
    excerpt:
      'Small, strategic tweaks can help you meet daily fiber goals even on hectic days—here are practical ideas.',
    content:
      'Most adults fall short of the recommended 25–38 grams of daily fiber. Soluble fibers like psyllium can help bridge the gap, but whole foods remain the foundation. Start your day with fiber by mixing a tablespoon of psyllium powder into a smoothie or oatmeal. Snack on fruits, raw vegetables and nuts instead of processed options, and consider adding psyllium husk or flaxseed meal to baking recipes for a soluble fiber boost.\n\nHydration is essential: carry a reusable water bottle and aim for 2–3 litres of fluids per day so fiber can do its job. Increase your intake gradually—adding three to five grams per day each week—to avoid bloating. On days when whole foods are not enough, a psyllium supplement can contribute an extra 5–10 grams of soluble fiber. Take it with plenty of water and schedule around meals if you are targeting cholesterol or blood-sugar benefits.\n\nFiber supports digestion, blood-sugar regulation and satiety. By combining food-based sources with strategic supplementation, you can stay consistent even when life is busy.',
    image: '/images/fiber.svg',
    date: '2025-03-05',
    author: 'Orbucell Team',
    tags: ['fiber', 'nutrition', 'lifestyle'],
    category: 'Fiber',
    featured: false,
    readingTime: '4 min read',
    seo: {
      title: 'Fiber for a Busy Lifestyle | Orbucell Learn',
      description:
        'Practical strategies to boost daily fiber intake, plus how psyllium supports digestion, heart health, and satiety.',
      keywords: ['daily fiber tips', 'psyllium routine', 'busy lifestyle nutrition'],
      ogImage: '/images/fiber-og.png',
      canonicalUrl: 'https://orbucell.com/learn/fiber-for-a-busy-lifestyle',
    },
  },
]

