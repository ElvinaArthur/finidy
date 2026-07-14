/**
 * Seed 03 — Magazine (Pilier 3)
 * 10 articles de vulgarisation publiés + 2 en attente.
 */
import { prisma, slugify } from "./_client";

export async function seedMagazine(auteurIds: Record<string, string>) {
  console.log("📝 Création des articles du Magazine...");

  const articles = [
    {
      titre: "Pourquoi Madagascar peine à sortir du piège de la pauvreté",
      chapeau: "Malgré ses ressources naturelles et sa biodiversité unique, Madagascar reste l'un des pays les plus pauvres du monde. Des économistes et sociologues décryptent les mécanismes structurels de cette pauvreté persistante.",
      contenu: `Madagascar occupe depuis des décennies les dernières places des classements mondiaux de développement humain. Pour comprendre ce paradoxe — un pays doté de ressources exceptionnelles mais dont la population vit à moins de 2 dollars par jour — il faut dépasser les explications superficielles.

**L'héritage de la structure coloniale**

Les économistes comme Fidy Andriantsoa (IRD Madagascar) insistent sur la persistance des structures économiques héritées de la colonisation. L'économie malgache a été organisée pour extraire et exporter des matières premières, sans développer de tissu industriel local. Cette logique extractive s'est perpétuée après l'indépendance.

**L'instabilité politique chronique**

Entre 1960 et aujourd'hui, Madagascar a connu six constitutions et plusieurs crises politiques majeures. La crise de 2009, avec l'éviction du président Ravalomanana, a notamment provoqué une chute du PIB de 4% et l'interruption de l'aide internationale pendant plusieurs années. Chaque crise remet à zéro les efforts de développement.

**Les pièges de la gouvernance**

La corruption systémique, l'incapacité de l'État à lever l'impôt efficacement et la faiblesse des services publics de base (santé, éducation, routes) créent un cercle vicieux : sans services publics, le capital humain stagne ; sans capital humain, la croissance reste faible ; sans croissance, il n'y a pas de ressources pour les services publics.

**Des raisons d'espérer ?**

La jeunesse malgache, qui représente 60% de la population, constitue un potentiel considérable. Des initiatives comme l'agriculture de précision dans le Vakinankaratra ou le développement d'une industrie textile compétitive montrent que des trajectoires alternatives sont possibles — à condition de stabilité politique et d'investissements durables.`,
      imageUrl: "/uploads/magazine/magazine-pauvrete-madagascar.jpg",
      discipline: "ECONOMIE",
      tags: ["pauvreté", "développement", "Madagascar", "économie", "gouvernance"],
      statut: "PUBLIE",
      vues: 1204,
      auteurEmail: "fidy.andriantsoa@ird.mg",
      publishedAt: new Date("2024-09-15"),
    },
    {
      titre: "Le famadihana à l'ère des réseaux sociaux",
      chapeau: "Le rituel du retournement des morts se transforme. Entre authenticité culturelle et mise en scène pour Instagram, l'anthropologue Voahirana Rakotondrabe observe des famadihana très contemporains.",
      contenu: `Dans les hautes terres malgaches, la saison des famadihana bat son plein entre juin et septembre. Mais ces cérémonies ne ressemblent plus tout à fait à celles que décrivaient les ethnologues du 20e siècle. Les smartphones sont partout, et les lives Facebook diffusent les danses avec les ancêtres à la diaspora installée en Europe ou à La Réunion.

**Un rituel en mutation**

Le famadihana — littéralement "retournement des morts" — est un rituel funéraire malgache consistant à exhumer les restes de ses ancêtres pour les emmailloter dans de nouveaux linceuls (lamba mena) et les promener au son de la musique. Cette communion avec les morts est au cœur de la cosmologie merina.

**La diaspora comme nouveau public**

L'anthropologue Voahirana Rakotondrabe a observé comment la nécessité d'inclure les membres de la famille vivant à l'étranger transforme le rituel. "Les familles organisent désormais des directs Facebook ou WhatsApp pour les proches qui ne peuvent pas venir. Cela change la dynamique : il y a une conscience d'être regardé, d'être en représentation."

**Commerce et authenticité**

L'organisation d'un famadihana coûte plusieurs millions d'ariary — une somme considérable pour des familles rurales. Des prestataires se spécialisent désormais dans la fourniture de linceuls, traiteurs, orchestres de hira gasy et même photographes. Cette commercialisation est-elle une menace pour l'authenticité du rituel ?

Pour Rakotondrabe, la question est mal posée : "Les rituels ont toujours évolué. Ce qui compte, c'est que la relation aux ancêtres reste au cœur de la pratique. Et ça, pour l'instant, c'est le cas."`,
      imageUrl: "/uploads/magazine/magazine-famadihana-reseaux.jpg",
      discipline: "ANTHROPOLOGIE",
      tags: ["famadihana", "culture malgache", "réseaux sociaux", "rituels", "modernité"],
      statut: "PUBLIE",
      vues: 2341,
      auteurEmail: "voahirana.rakotondrabe@cnre.mg",
      publishedAt: new Date("2024-10-03"),
    },
    {
      titre: "École publique vs école privée à Madagascar : une fracture sociale dès le primaire",
      chapeau: "À Antananarivo, choisir l'école de son enfant est souvent une affaire de classe sociale. Plongée dans les stratégies éducatives des familles malgaches.",
      contenu: `À Antananarivo, deux mondes coexistent. D'un côté, des écoles publiques débordées, avec 60 à 80 élèves par classe, des enseignants souvent absents et des manuels insuffisants. De l'autre, des établissements privés de standing, avec des frais de scolarité inaccessibles à la majorité de la population.

**Les chiffres de la fracture**

Selon les dernières statistiques du ministère de l'Éducation nationale, 58% des élèves du primaire dans les zones urbaines fréquentent un établissement privé. Ce taux monte à 73% à Antananarivo. Pour Célestine Ramanantsoa, chercheuse en sciences de l'éducation, "on assiste à une privatisation de fait du système éducatif, qui n'est jamais dite mais que tout le monde pratique."

**Les stratégies des familles modestes**

Les familles à revenus intermédiaires développent des stratégies complexes : certaines scolarisent leurs enfants dans le public mais investissent massivement dans des cours particuliers le soir. D'autres font des sacrifices considérables pour payer une école privée "abordable", souvent des établissements confessionnels catholiques ou protestants.

**Une reproduction sociale précoce**

Le problème fondamental, selon Ramanantsoa, est que les inégalités se creusent dès la maternelle. "Les enfants des milieux favorisés arrivent au collège avec deux à trois ans d'avance sur leurs camarades. Le système ne rattrape jamais ce retard initial."`,
      imageUrl: "/uploads/magazine/magazine-education-fracture.jpg",
      discipline: "SCIENCES_EDUCATION",
      tags: ["éducation", "inégalités", "école", "Madagascar", "classes sociales"],
      statut: "PUBLIE",
      vues: 876,
      auteurEmail: "celestine.ramanantsoa@ulm.mg",
      publishedAt: new Date("2024-10-18"),
    },
    {
      titre: "Comprendre les fady : les tabous malgaches entre sagesse ancestrale et obstacles au développement",
      chapeau: "Les fady structurent la vie quotidienne de millions de Malgaches. Mais certains peuvent aussi freiner les politiques de santé publique ou d'agriculture. Comment les chercheurs abordent-ils ce sujet sensible ?",
      contenu: `En pays betsimisaraka, on ne mange pas d'anguille. Chez certains Merina, on ne coupe pas les cheveux le mardi. Les fady — tabous malgaches — sont des milliers, variant d'une région à l'autre, d'une famille à l'autre.

**Une institution sociale complexe**

Pour les anthropologues, les fady ne sont pas de simples superstitions. Ils constituent un système de régulation sociale sophistiqué, transmettant des règles de comportement, des mémoires de conflits passés et des relations entre groupes humains. "Un fady alimentaire peut refléter une ancienne alliance politique, une épidémie historique ou simplement une règle d'hygiène rationalisée par le temps," explique Voahirana Rakotondrabe.

**Quand les fady rencontrent les politiques publiques**

La question devient plus complexe quand certains fady entrent en contradiction avec les politiques de santé publique. Des campagnes de vaccination ont parfois échoué parce qu'elles ignoraient les tabous locaux liés aux injections ou à certains jours de la semaine. Les ONG de développement ont appris, souvent à leurs dépens, à intégrer cette dimension culturelle.

**Négociation et adaptation**

La bonne nouvelle, selon les chercheurs, est que les fady ne sont pas figés. Ils évoluent, se négocient, s'adaptent. Mais cette évolution doit venir de l'intérieur des communautés, pas être imposée de l'extérieur. "Il ne s'agit pas de déconstruire les fady, mais de comprendre ce qu'ils expriment pour travailler avec elles, pas contre elles."`,
      imageUrl: "/uploads/magazine/magazine-fady-tabous.jpg",
      discipline: "ANTHROPOLOGIE",
      tags: ["fady", "tabous", "culture", "développement", "santé publique"],
      statut: "PUBLIE",
      vues: 1567,
      auteurEmail: "voahirana.rakotondrabe@cnre.mg",
      publishedAt: new Date("2024-11-05"),
    },
    {
      titre: "La montée du pentecôtisme à Madagascar : entre foi et mobilité sociale",
      chapeau: "Les Églises pentecôtistes se multiplient dans toutes les villes malgaches. Au-delà du phénomène religieux, elles constituent de véritables réseaux sociaux d'entraide et de promotion.",
      contenu: `Chaque dimanche matin à Antananarivo, les rues résonnent de chants joyeux et de prédications amplifiées. Les Églises pentecôtistes et charismatiques ont explosé ces vingt dernières années, au point de concurrencer les Églises historiques — catholiques, protestantes et FJKM — qui structuraient le paysage religieux malgache.

**Les chiffres du phénomène**

Selon une estimation du recensement de 2021, plus de 15% de la population malgache se réclame désormais d'une Église pentecôtiste ou charismatique, contre moins de 5% en 2000. À Antananarivo, certains quartiers populaires comptent une nouvelle Église tous les deux ou trois pâtés de maisons.

**Réseau social et solidarité**

Pour le sociologue Jean-Louis Rakotomalala, qui a consacré une partie de ses recherches à ce phénomène, "l'Église pentecôtiste fonctionne comme un réseau social d'insertion urbaine." Pour les migrants ruraux fraîchement arrivés en ville, elle offre un réseau de solidarité, des contacts professionnels, et parfois des logements ou du travail.

**La promesse de la prospérité**

La "théologie de la prospérité" — l'idée que la foi produit un succès matériel — joue également un rôle. Elle offre un cadre narratif qui valorise la réussite individuelle tout en la réinscrivant dans un ordre moral et collectif.`,
      imageUrl: "/uploads/magazine/magazine-pentecotisme.jpg",
      discipline: "SOCIOLOGIE",
      tags: ["religion", "pentecôtisme", "Madagascar", "mobilité sociale", "urbanisation"],
      statut: "PUBLIE",
      vues: 934,
      auteurEmail: "jean.rakoto@univ-tana.mg",
      publishedAt: new Date("2024-11-22"),
    },
    {
      titre: "Déforestation à Madagascar : qui sont les vrais responsables ?",
      chapeau: "La déforestation de Madagascar est présentée comme le résultat de l'agriculture sur brûlis pratiquée par des paysans pauvres. Cette vision, souvent relayée par les ONG internationales, est-elle complète ? Des chercheurs proposent une autre lecture.",
      contenu: `Madagascar a perdu plus de 40% de sa couverture forestière originelle en cinquante ans. Ce constat catastrophique pour la biodiversité est souvent associé à une image : celle du paysan malgache pratiquant le tavy, l'agriculture sur brûlis. Mais des chercheurs contestent cette représentation simpliste.

**Le tavy, bouc émissaire commode ?**

Pour Voahirana Rakotondrabe, "incriminer le tavy sans contexte, c'est criminaliser la survie des plus pauvres." Le tavy est en effet pratiqué principalement par des paysans sans accès à des terres fertiles alternatives, souvent refoulés des zones agricoles par des propriétaires plus puissants.

**Les vraies causes structurelles**

Les chercheurs identifient d'autres facteurs, moins médiatisés : l'exploitation forestière illégale à grande échelle (trafic de bois de rose, de palissandre), l'expansion des mines, et les grands projets d'infrastructure qui ouvrent des routes vers des zones forestières jusque-là inaccessibles.

**La gouvernance comme enjeu central**

"La question n'est pas technologique mais politique," résume Rakotondrabe. "Tant que les ressources forestières ne profitent pas aux communautés locales, ces dernières n'ont aucune raison de les protéger."`,
      imageUrl: "/uploads/magazine/magazine-deforestation.jpg",
      discipline: "ANTHROPOLOGIE",
      tags: ["déforestation", "environnement", "Madagascar", "gouvernance", "tavy"],
      statut: "PUBLIE",
      vues: 2103,
      auteurEmail: "voahirana.rakotondrabe@cnre.mg",
      publishedAt: new Date("2024-12-01"),
    },
    {
      titre: "Féminisme à Madagascar : une histoire méconnue",
      chapeau: "Les luttes des femmes malgaches pour l'égalité ne datent pas d'hier. Des militantes de la période coloniale aux activistes d'aujourd'hui, retour sur un siècle de féminisme malgache.",
      contenu: `Le féminisme en Afrique est souvent présenté comme une importation occidentale. À Madagascar, cette caricature est particulièrement injuste. Dès le 19e siècle, sous la reine Ranavalona III, des femmes se sont battues pour leur dignité et leurs droits dans un contexte colonial et patriarcal.

**Les pionnières méconnues**

Hanta Razafy, historienne à l'Institut des Humanités de Madagascar, a retrouvé des archives témoignant d'associations féminines dès les années 1920. "Il y avait une effervescence militante réelle, sur des questions concrètes : accès à l'éducation, violence conjugale, participation à la vie publique."

**La période post-indépendance**

L'indépendance de 1960 ne traduit pas automatiquement un progrès pour les femmes. Les premières constitutions malgaches garantissent formellement l'égalité, mais les pratiques sociales et juridiques restent largement inégalitaires, notamment en matière de droits fonciers et successoraux.

**Le mouvement actuel**

Aujourd'hui, une nouvelle génération de militantes, souvent connectées aux réseaux féministes internationaux, porte des revendications nouvelles : lutte contre les violences basées sur le genre, représentation politique, droit à la contraception. Leur rapport à la tradition malgache est complexe : ni rejet ni acceptation aveugle.`,
      imageUrl: "/uploads/magazine/magazine-feminisme-mada.jpg",
      discipline: "ETUDES_GENRE",
      tags: ["féminisme", "femmes", "histoire", "Madagascar", "droits"],
      statut: "PUBLIE",
      vues: 789,
      auteurEmail: "hanta.razafy@ihm.mg",
      publishedAt: new Date("2024-12-10"),
    },
    {
      titre: "L'économie informelle vue de l'intérieur : portraits de travailleurs de la rue à Tana",
      chapeau: "Vendeurs de rue, porteurs, petits artisans : l'économie informelle fait vivre une grande partie de la population d'Antananarivo. Six portraits pour comprendre de l'intérieur ces vies de labeur et de débrouillardise.",
      contenu: `Ils sont partout : aux carrefours, devant les supermarchés, au bord des routes. Les travailleurs informels constituent l'épine dorsale invisible de l'économie d'Antananarivo. Jean-Louis Rakotomalala les a suivis pendant deux ans pour son enquête sociologique.

**Rakoto, 38 ans, porteur au marché Analakely**

Originaire de Moramanga, Rakoto est arrivé à Antananarivo il y a quinze ans avec 50 000 ariary en poche. "Je ne savais rien faire d'autre que porter." Aujourd'hui, il gagne entre 15 000 et 25 000 ariary par jour — de quoi nourrir sa famille et payer la scolarité de ses trois enfants. Sa grande peur : vieillir et ne plus pouvoir porter.

**Nirina, 26 ans, vendeuse de légumes à Mahamasina**

Nirina a repris le commerce de sa mère après le lycée, faute de trouver un emploi formel. Elle ne s'en plaint pas. "J'aime ma liberté. Je ne rends de compte à personne." Elle économise pour ouvrir une boutique.

**La résilience comme mode de vie**

Ce que révèle l'étude de Rakotomalala, c'est moins la précarité — réelle — de ces travailleurs que leur extraordinaire capacité d'adaptation. "Ils ont développé des compétences entrepreneuriales, des réseaux de solidarité et des stratégies de survie que bien des gestionnaires d'entreprise leur envieraient."`,
      imageUrl: "/uploads/magazine/magazine-economie-informelle.jpg",
      discipline: "SOCIOLOGIE",
      tags: ["économie informelle", "travail", "Antananarivo", "portraits", "précarité"],
      statut: "PUBLIE",
      vues: 1823,
      auteurEmail: "jean.rakoto@univ-tana.mg",
      publishedAt: new Date("2025-01-08"),
    },
    // En attente
    {
      titre: "La langue malgache en danger ? Mythe et réalité",
      chapeau: "Le malgache est-il menacé par le français et l'anglais ? Analyse d'une inquiétude culturelle réelle mais nuancée.",
      contenu: `La question revient régulièrement dans le débat public malgache : notre langue est-elle en danger ? Entre les emprunts massifs au français, l'anglais des réseaux sociaux et l'abandon progressif de la lecture en malgache, certains tirent la sonnette d'alarme. Les linguistes, eux, sont plus nuancés.

Avec plus de 25 millions de locuteurs natifs, le malgache est loin d'être une langue en voie de disparition au sens strict. Mais il traverse une transformation profonde, notamment dans les espaces urbains et chez les jeunes générations scolarisées en français.

Ce que les chercheurs observent, c'est moins un remplacement du malgache par le français qu'une créolisation progressive, avec l'émergence de parlers mixtes ("franlache" ou "franmalgache") qui constituent en réalité des formes d'innovation linguistique.`,
      imageUrl: null,
      discipline: "LINGUISTIQUE",
      tags: ["langue malgache", "linguistique", "identité", "créolisation"],
      statut: "EN_ATTENTE",
      vues: 0,
      auteurEmail: "celestine.ramanantsoa@ulm.mg",
      publishedAt: null,
    },
  ];

  let count = 0;
  for (const a of articles) {
    const auteurId = auteurIds[a.auteurEmail];
    if (!auteurId) continue;
    const slug = slugify(a.titre);
    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        titre: a.titre,
        slug,
        chapeau: a.chapeau,
        contenu: a.contenu,
        imageUrl: a.imageUrl,
        discipline: a.discipline as any,
        tags: a.tags,
        statut: a.statut as any,
        vues: a.vues,
        auteurId,
        publishedAt: a.publishedAt,
      },
    });
    count++;
  }

  console.log(`   ✅ Articles magazine créés : ${count}`);
}
