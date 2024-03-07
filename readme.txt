Contexte : d'où viennent les données, qui les a créées et dans quel contexte

Les données utilisées dans notre projet proviennent de l'API https://www.dnd5eapi.co/api , une ressource communautaire qui semble être entretenue par des membres dévoués de la communauté Donjons et Dragons. Bien que cette API ne soit pas directement affiliée au jeu officiel, elle offre une source accessible et programmable de données de référence sur l'univers de D&D. La création et la maintenance de cette API semblent être le résultat d'efforts collaboratifs au sein de la communauté de joueurs et de développeurs passionnés par Donjons et Dragons. Cette initiative vise à faciliter l'accès aux informations du jeu, permettant ainsi la création d'outils et d'applications innovants pour enrichir l'expérience des joueurs et des maîtres de jeu. Bien que l'entité précise derrière l'API ne soit pas clairement définie, son utilisation témoigne de l'engagement de la communauté dans la promotion de ressources utiles pour les fans de D&D.





Description Comment sont structurées les données ? Parler du format, des attributs et du type de données;

Les données sont en format JSON.
Dans ce projet, nous allons nous intéresser aux monstres, la liste est disponible ici https://www.dnd5eapi.co/api/monsters
On peut ensuite accéder aux caractéristiques  d'un monstre en particulier et nous trouvons les données suivantes (par exemple dnd5eapi.co/api/monsters/ancient-brass-dragon)

1. Attributs de base :
	• index: Identifiant unique du monstre.
	• name: Nom du monstre.
	• size: Taille du monstre (ex. Gargantuan).
	• type: Type de créature (ex. dragon).
	• alignment: Alignement du monstre (ex. chaotic good).
	• armor_class: Tableau contenant le type d'armure (natural) et la valeur d'armure (20).
	• hit_points: Points de vie du monstre (297).
	• hit_dice: Expression décrivant le nombre et le type de dés utilisés pour calculer les points de vie (17d20).
	• hit_points_roll: Expression complète pour calculer les points de vie (17d20+119).
	• speed: Vitesse de déplacement (walk, burrow, fly).

2. Attributs de Caractéristiques :
	• strength, dexterity, constitution, intelligence, wisdom, charisma: Valeurs des caractéristiques du monstre.

3. Compétences et Sauvegardes :
	• proficiencies: Tableau contenant les valeurs de compétence et les liens vers les proficiences spécifiques du monstre.

4. Résistances et Immunités :
	• damage_vulnerabilities, damage_resistances, damage_immunities, condition_immunities: Listes des vulnérabilités aux dégâts, résistances, immunités aux dégâts, et immunités aux conditions.

5. Sens :
	• senses: Informations sur les sens du monstre, comme le blindsight, darkvision, et la perception passive.

6. Langues et Autres Caractéristiques :
	• languages: Langues que le monstre peut comprendre et parler.
	• challenge_rating: Niveau de défi du monstre (20).
	• proficiency_bonus: Bonus de maîtrise du monstre (6).
	• xp: Points d'expérience attribués pour la victoire contre ce monstre (25000).

7. Capacités Spéciales et Actions :
	• special_abilities: Capacités spéciales du monstre (ex. Legendary Resistance).
	• actions: Actions que le monstre peut entreprendre en combat (ex. Multiattack, Bite, Claw).

8. Légendaires Actions :
	• legendary_actions: Actions légendaires que le monstre peut entreprendre en combat (ex. Detect, Tail Attack, Wing Attack).

9. URL de Référence :
	• url: URL spécifique pour accéder aux détails complets du monstre.




But: qu'est-ce que vous voulez découvrir ? Des tendances ? Vous voulez explorer ou expliquer?

Le principal objectif de notre projet est de présenter  les différents monstres de l'univers de Donjons et Dragons, en mettant en avant des statistiques détaillées pour chacun d'eux. 
Nous cherchons à offrir aux joueurs et aux maîtres de jeu une ressource centralisée et conviviale où ils peuvent explorer les caractéristiques des monstres, telles que leurs points de vie, leurs capacités spéciales, leurs résistances et bien plus encore. 
En mettant en lumière ces statistiques, notre projet vise à fournir des informations utiles pour la préparation de scénarios, la création d'encounters passionnants et l'approfondissement de la compréhension des créatures qui peuplent les aventures de D&D. 
L'objectif final est de simplifier l'accès aux données essentielles sur les monstres, facilitant ainsi la prise de décisions stratégiques et la création d'expériences de jeu immersives dans l'univers riche de Donjons et Dragons.
Ou simplement pour initier et informer les personnes qui ne connaitraient pas ou peu l'univers de donjons et dragons.




Références: Qui d'autre dans le web ou dans la recherche a utilisé ces données ? Dans quel but ?

Suite à des recherches , nous constatons que les informations disponibles sur l'utilisation de l'API de Donjons et Dragons 5e édition sont limitées. 
Cependant, quelques projets spécifiques sont évoqués sur des forums, par exemple un utilisateur exprime le souhait de développer une feuille de personnage dynamique sous Excel en utilisant les données du character builder du site. Cette démarche témoigne de la volonté de la communauté de créer des solutions innovantes pour faciliter l'expérience des joueurs et du Maître du Donjon. 
Nous avons également trouvé une offre de service  où un créateur propose d'aider les joueurs de Donjons et Dragons en créant des personnages. Le service comprend le remplissage de la fiche de personnage. Les clients peuvent choisir la classe et la race ou laisser le créateur choisir au hasard.


