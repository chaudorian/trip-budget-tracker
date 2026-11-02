# Budget tracker

Application web mobile pour suivre le budget en espèces d'un voyage dans la monnaie locale.
Un seul fichier d'application (`index.html`), sans compilation ni serveur.

## Fonctions
- Voyages : dates, monnaie (154 monnaies, recherche par pays ou par monnaie), budget initial.
- Transactions : dépense ou revenu (rechargement), catégorie, date, note.
- Conversion en euros : le taux du jour est récupéré à la création de chaque transaction et enregistré avec elle. Le budget restant est aussi affiché en euros.
- Blocage d'une dépense qui ferait passer le budget restant en négatif.
- Dashboard : KPI et graphique des dépenses par catégorie, par jour, semaine ou mois.
- Suggestions d'intitulés à partir des transactions déjà saisies.
- Suivi par personne (option par voyage) : choix de la personne à chaque transaction et statistiques par personne dans le dashboard.
- Sélection de plusieurs transactions pour les supprimer.
- Export et import d'un voyage et de ses transactions au format CSV (onglet Voyages).
- Apparence : mode auto, jour ou nuit, et 5 thèmes de couleur (onglet Voyages).
- Les formulaires ne se ferment pas sans confirmation si des données ont été saisies.

## Mise en ligne avec GitHub Pages
1. Envoie tous les fichiers de ce dossier à la racine du dépôt.
2. Settings > Pages > Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. Après une à deux minutes, l'appli est disponible à `https://<compte>.github.io/<depot>/`.
4. Sur le téléphone, ouvre ce lien puis :
   - iPhone (Safari) : Partager > « Sur l'écran d'accueil ».
   - Android (Chrome) : menu > « Installer l'application ».

## Données
Les données sont enregistrées dans le navigateur du téléphone (localStorage). Rien n'est envoyé au dépôt.
Elles ne sont pas synchronisées entre appareils et disparaissent si tu vides les données du site.

## Taux de change
Les taux viennent de l'API gratuite [currency-api](https://github.com/fawazahmed0/exchange-api), mise à jour une fois par jour.
Si la récupération échoue, le dernier taux du voyage est proposé et reste modifiable.
Le graphique est chargé depuis cdnjs : l'appli demande une connexion Internet.

## Mettre à jour
Remplace `index.html` dans le dépôt puis valide : GitHub Pages republie le site.
Garde la même adresse pour conserver les données déjà saisies.
