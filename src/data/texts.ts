import { TextSnippet } from '../types';

export const COMMON_WORDS: string[] = [
  'le', 'de', 'un', 'pour', 'être', 'et', 'en', 'avoir', 'que', 'pour',
  'dans', 'ce', 'il', 'qui', 'ne', 'sur', 'se', 'pas', 'plus', 'pouvoir',
  'par', 'je', 'avec', 'tout', 'faire', 'son', 'mettre', 'autre', 'on',
  'mais', 'nous', 'comme', 'ou', 'si', 'leur', 'y', 'dire', 'elle', 'devoir',
  'avant', 'deux', 'même', 'prendre', 'aussi', 'celui', 'donner', 'bien', 'où',
  'fois', 'vous', 'encore', 'nouveau', 'aller', 'cela', 'sans', 'mon', 'après',
  'monde', 'homme', 'jour', 'temps', 'vie', 'main', 'chose', 'yeux', 'heure',
  'esprit', 'travail', 'clavier', 'rythme', 'vitesse', 'sens', 'force', 'calme',
  'geste', 'mot', 'lettre', 'doigt', 'frappe', 'juste', 'souffle', 'harmonie',
  'regard', 'forme', 'espace', 'minute', 'instant', 'parcours', 'ligne', 'texte',
  'page', 'histoire', 'livre', 'lumière', 'clarté', 'élan', 'source', 'facile'
];

export const ACCURACY_WORDS: string[] = [
  'accueil', 'événement', 'développer', 'emmêler', 'intérêt', 'cauchemar',
  'dilemme', 'exaucer', 'apéritif', 'langage', 'moelleux', 'mourir',
  'nourrir', 'parallèle', 'souhaiter', 'tranquillité', 'apercevoir',
  'atterrir', 'balade', 'ballade', 'chariot', 'courbature', 'différend',
  'dissimuler', 'exagérer', 'fabricant', 'inondation', 'imbécile',
  'occurrence', 'recommander', 'rythmique', 'souffrance', 'vraisemblable'
];

export const CURATED_QUOTES: TextSnippet[] = [
  {
    id: 'quote-1',
    title: 'Le Petit Prince',
    category: 'quotes',
    authorOrSource: 'Antoine de Saint-Exupéry',
    text: 'On ne voit bien qu avec le coeur. L essentiel est invisible pour les yeux.'
  },
  {
    id: 'quote-2',
    title: 'Les Misérables',
    category: 'quotes',
    authorOrSource: 'Victor Hugo',
    text: 'Même la nuit la plus sombre prendra fin et le soleil se lèvera.'
  },
  {
    id: 'quote-3',
    title: 'L Été',
    category: 'quotes',
    authorOrSource: 'Albert Camus',
    text: 'Au milieu de l hiver, j ai découvert en moi un invincible été.'
  },
  {
    id: 'quote-4',
    title: 'Fables',
    category: 'quotes',
    authorOrSource: 'Jean de La Fontaine',
    text: 'Rien ne sert de courir ; il faut partir à point. Le lièvre et la tortue en sont un témoignage.'
  },
  {
    id: 'quote-5',
    title: 'À la recherche du temps perdu',
    category: 'quotes',
    authorOrSource: 'Marcel Proust',
    text: 'Le véritable voyage de découverte ne consiste pas à chercher de nouveaux paysages, mais à avoir de nouveaux yeux.'
  },
  {
    id: 'quote-6',
    title: 'L Art Poétique',
    category: 'quotes',
    authorOrSource: 'Nicolas Boileau',
    text: 'Ce que l on conçoit bien s énonce clairement, et les mots pour le dire arrivent aisément.'
  }
];

export const CODE_SNIPPETS: TextSnippet[] = [
  {
    id: 'code-1',
    title: 'Filtrer et Transformer',
    category: 'code',
    authorOrSource: 'TypeScript',
    text: 'const utilisateursActifs = liste.filter(u => u.estValide).map(u => ({ id: u.id, nom: u.nom }));'
  },
  {
    id: 'code-2',
    title: 'État Réactif',
    category: 'code',
    authorOrSource: 'React',
    text: 'const [score, setScore] = useState<number>(0); useEffect(() => { return () => reinitialiser(); }, []);'
  },
  {
    id: 'code-3',
    title: 'Fonction Asynchrone',
    category: 'code',
    authorOrSource: 'JavaScript',
    text: 'async function chargerDonnees(url: string) { const reponse = await fetch(url); return reponse.json(); }'
  },
  {
    id: 'code-4',
    title: 'Recherche Binaire',
    category: 'code',
    authorOrSource: 'Algorithmes',
    text: 'while (debut <= fin) { const milieu = Math.floor((debut + fin) / 2); if (tableau[milieu] === cible) return milieu; }'
  }
];

export function getRandomWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
    words.push(COMMON_WORDS[randomIndex]);
  }
  return words.join(' ');
}

export function getAccuracyDrillText(count: number = 25): string {
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * ACCURACY_WORDS.length);
    selected.push(ACCURACY_WORDS[idx]);
  }
  return selected.join(' ');
}
