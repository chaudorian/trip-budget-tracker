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
1. Crée une clé reCAPTCHA v3 sur https://www.google.com/recaptcha/admin/create (domaine : `chaudorian.github.io`).
2. Firebase > App Check > Applications > ton application web > reCAPTCHA : colle la clé secrète et enregistre.
3. La clé du site (publique) est déjà renseignée dans `index.html`, dans la constante `FB`, champ `rc`. Publie le site.
4. Vérifie dans App Check > Métriques que les requêtes Firestore apparaissent comme vérifiées, puis dans l'onglet API, clique sur « Appliquer » pour Cloud Firestore.
5. Google Cloud Console > API et services > Identifiants > ta clé : restriction d'application « Sites web » avec `https://chaudorian.github.io/*`, et restriction d'API sur « Cloud Firestore API » et « Firebase App Check API ».

Si `rc` est vide, App Check est désactivé dans l'appli : n'applique pas l'obligation dans la console avant d'avoir publié le site avec la clé.

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
