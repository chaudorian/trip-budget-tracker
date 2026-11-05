# Cashly

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
- Liste des transactions : recherche par intitulé mise à jour à la frappe et filtres par type (dépense ou revenu), catégorie et personne.
- Dashboard organisé en sections (vue d'ensemble, dépenses dans le temps, catégories, par personne) avec les équivalents en euros.
- Page Paramètres (engrenage, onglet Voyages) : apparence (mode auto, jour ou nuit et 5 thèmes de couleur), version de l'appli (v0.1) et console des logs (requêtes, transactions, voyages, synchronisation, erreurs) avec filtres, copie et effacement.
- Les formulaires ne se ferment pas sans confirmation si des données ont été saisies.

## Mise en ligne avec GitHub Pages
1. Envoie tous les fichiers de ce dossier à la racine du dépôt.
2. Settings > Pages > Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. Après une à deux minutes, l'appli est disponible à `https://<compte>.github.io/<depot>/`.
4. Sur le téléphone, ouvre ce lien puis :
   - iPhone (Safari) : Partager > « Sur l'écran d'accueil ».
   - Android (Chrome) : menu > « Installer l'application ».

## Partage entre appareils (Firebase)
L'appli peut partager un voyage entre plusieurs appareils via Firestore (offre gratuite Spark). Le projet Firebase est déjà renseigné dans `index.html` (constante `FB`).

- Dans la fiche d'un voyage (Voyages > Modifier), « Partager ce voyage » génère un code d'invitation de 24 caractères. Les autres personnes le saisissent avec le bouton « Rejoindre un voyage partagé » de l'onglet Voyages.
- Synchronisation à l'ouverture, au retour sur l'appli et toutes les 30 secondes, avec fusion des modifications simultanées (la plus récente gagne pour une même transaction, les suppressions sont conservées).
- Le taux courant et la dernière personne choisie restent propres à chaque appareil.
- « Arrêter le partage » coupe la synchronisation sur l'appareil ; le voyage reste dans Firestore.

Règles Firestore à publier (Firestore Database > Règles) :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/{code} {
      allow get: if code.size() >= 20;
      allow create, update: if code.size() >= 20
        && request.resource.data.keys().hasOnly(['data'])
        && request.resource.data.data is string
        && request.resource.data.data.size() < 900000;
      allow list, delete: if false;
    }
  }
}
```

La clé d'API Firebase est publique par nature. Tu peux la restreindre aux adresses de ton site dans Google Cloud Console (APIs et services > Identifiants).

## Sécurité : App Check et clé d'API
1. Clé reCAPTCHA créée (domaine : `chaudorian.github.io`), de type site web basé sur le score, sans case à cocher, dans le projet Google Cloud de Firebase.
2. Firebase > App Check > Applications > ton application web > fournisseur « Fraud Defense (anciennement reCAPTCHA Enterprise) » : colle la clé **du site** (jamais la clé secrète) et enregistre. L'appli utilise ce fournisseur (`ent:true` dans la constante `FB`). Le fournisseur reCAPTCHA classique est obsolète ; avec lui, mets `ent:false`.
3. La clé du site (publique) est déjà renseignée dans `index.html`, dans la constante `FB`, champ `rc`. Publie le site.
4. Vérifie dans App Check > Métriques que les requêtes Firestore apparaissent comme vérifiées, puis dans l'onglet API, clique sur « Appliquer » pour Cloud Firestore.
5. Google Cloud Console > API et services > Identifiants > ta clé : restriction d'application « Sites web » avec `https://chaudorian.github.io/*`, et restriction d'API sur « Cloud Firestore API » et « Firebase App Check API ».

Si `rc` est vide, App Check est désactivé dans l'appli : n'applique pas l'obligation dans la console avant d'avoir publié le site avec la clé.

Le badge reCAPTCHA est masqué ; la mention de protection est affichée dans le formulaire « Rejoindre un voyage partagé ».
L'appli échange elle-même le jeton reCAPTCHA contre un jeton App Check (sans le SDK Firebase) ; en cas d'échec, le message d'erreur de Google s'affiche.

## Notifications
Quand une autre personne ajoute, modifie ou supprime une transaction sur un voyage partagé (ou modifie le voyage), l'appli affiche un message et ajoute une entrée dans la cloche de l'onglet Voyages, avec une pastille de messages non lus. Une alerte du système peut s'y ajouter (Paramètres > Notifications), via `sw.js`.
Les notifications ne sont détectées que lorsque l'appli est ouverte ou en arrière-plan, au rythme de la synchronisation (environ 30 secondes). Elles n'arrivent pas si l'appli est fermée : cela demanderait un serveur d'envoi (Firebase Cloud Messaging et Cloud Functions, plan payant).

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
