type RevueThumbnailSource = {
  discipline: string
  submissionMeta?: unknown
}

const DISCIPLINE_THUMBNAILS: Record<string, string> = {
  SOCIOLOGIE: '/uploads/magazine/magazine-economie-informelle.jpg',
  ANTHROPOLOGIE: '/uploads/magazine/magazine-famadihana-reseaux.jpg',
  HISTOIRE: '/uploads/couvertures/livre-menalamba-histoire.jpg',
  GEOGRAPHIE_HUMAINE: '/uploads/magazine/magazine-deforestation.jpg',
  ECONOMIE: '/uploads/magazine/magazine-pauvrete-madagascar.jpg',
  DROIT: '/uploads/couvertures/livre-dina-gouvernance.jpg',
  SCIENCE_POLITIQUE: '/uploads/couvertures/livre-madagascar-politique.jpg',
  PHILOSOPHIE: '/uploads/magazine/magazine-fady-tabous.jpg',
  PSYCHOLOGIE_SOCIALE: '/uploads/magazine/magazine-pentecotisme.jpg',
  SCIENCES_EDUCATION: '/uploads/magazine/magazine-education-fracture.jpg',
  LINGUISTIQUE: '/uploads/couvertures/livre-apprendre-malgache.jpg',
  COMMUNICATION: '/uploads/entretiens/video-intro-sociologie.jpg',
  DEMOGRAPHIE: '/uploads/magazine/magazine-economie-informelle.jpg',
  ETUDES_GENRE: '/uploads/magazine/magazine-feminisme-mada.jpg',
  ETUDES_MALGACHES: '/uploads/magazine/magazine-famadihana-reseaux.jpg',
  RELATIONS_INTERNATIONALES: '/uploads/colloques/colloque-shs-ocean-indien-2025.jpg',
}

export function getRevueThumbnail(article: RevueThumbnailSource) {
  if (article.submissionMeta && typeof article.submissionMeta === 'object') {
    const thumbnailUrl = (article.submissionMeta as Record<string, unknown>).thumbnailUrl
    if (typeof thumbnailUrl === 'string' && thumbnailUrl.startsWith('/uploads/')) {
      return thumbnailUrl
    }
  }

  return DISCIPLINE_THUMBNAILS[article.discipline]
    ?? '/uploads/colloques/colloque-shs-ocean-indien-2025.jpg'
}
