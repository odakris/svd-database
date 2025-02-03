# SUP DE VINCI - BASE DE DONNEES

## Description

<div style="text-align: justify;">

Ce projet permet de gérer une base de données liée à un système de gestion de commandes pour une entreprise vendant des produits. Le système permet de gérer les produits, fournisseurs, clients, commandes et catégories de produits à travers une API RESTful construite avec Node.js, Express et MySQL.

</div>

<div style="text-align: justify;">

Le projet inclut une API qui permet d’effectuer des opérations CRUD (Create, Read, Update, Delete) sur ces entités. La base de données est initialisée avec un script SQL et peut être manipulée via des requêtes HTTP.

</div>

## Installation

<div style="text-align: justify;">

1. Clonez le repository sur votre machine locale :

```
git clone https://github.com/odakris/svd-database.git
cd svd-bdd
```

2. Installez les dépendances du projet :

```
npm install
```

3. Démarrez le serveur de l'API :

```
npm start
```

L'API sera accessible à l'adresse suivante : http://localhost:3000.\
\
Vous pouvez maintenant utiliser des outils comme [Postman](https://www.postman.com/) pour interagir avec l'API.

Il existe deux branches pour ce projet. La première version (v1) est accessible sur la branche **VERSION-1**

```
git checkout VERSION-1
```

La version final (v2) est accessible sur la branche **master**

```
git checkout master
```

</div>

# Documentation et Audit de l'API (Version 1)

## 1. Présentation de l'API V1

### Initialisation de la Base de Données

<div style="text-align: justify;">

- **POST** `/init` : Initialise la base de données avec les tables et les données de test.

</div>

### CRUD - Catégories

<div style="text-align: justify;">

- **GET** `/categories` : Récupère toutes les catégories.
- **GET** `/categories/:id` : Récupère une catégorie par son identifiant.
- **POST** `/categories` : Ajoute une nouvelle catégorie.
- **PUT** `/categories/:id` : Met à jour une catégorie par son identifiant.
- **DELETE** `/categories/:id` : Supprime une catégorie par son identifiant.

</div>

### CRUD - Produits

<div style="text-align: justify;">

- **GET** `/produits` : Récupère tous les produits.
- **GET** `/produits/:id` : Récupère un produit par son identifiant.
- **POST** `/produits` : Ajoute un nouveau produit.
- **PUT** `/produits/:id` : Met à jour un produit par son identifiant.
- **DELETE** `/produits/:id` : Supprime un produit par son identifiant.

</div>

### CRUD - Fournisseurs

<div style="text-align: justify;">

- **GET** `/fournisseurs` : Récupère tous les fournisseurs.
- **GET** `/fournisseurs/:id` : Récupère un fournisseur par son identifiant.
- **POST** `/fournisseurs` : Ajoute un nouveau fournisseur.
- **PUT** `/fournisseurs/:id` : Met à jour un fournisseur par son identifiant.
- **DELETE** `/fournisseurs/:id` : Supprime un fournisseur par son identifiant.

</div>

### CRUD - Clients

<div style="text-align: justify;">

- **GET** `/clients` : Récupère tous les clients.
- **GET** `/clients/:id` : Récupère un client par son identifiant.
- **POST** `/clients` : Ajoute un nouveau client.
- **PUT** `/clients/:id` : Met à jour un client par son identifiant.
- **DELETE** `/clients/:id` : Supprime un client par son identifiant.

</div>

### CRUD - Commandes

<div style="text-align: justify;">

- **GET** `/commandes` : Récupère toutes les commandes, incluant ses lignes de commande.
- **GET** `/commandes/:id` : Récupère une commande par son identifiant, incluant ses lignes de commande.
- **POST** `/commandes` : Ajoute une nouvelle commande.
- **PUT** `/commandes/:id` : Met à jour une commande et ses lignes.
- **DELETE** `/commandes/:id` : Supprime une commande et ses lignes.

</div>

## 2. Structure de la Base de Données

<div style="text-align: justify;">

La base de données `avion_papier` est structurée autour de plusieurs tables interconnectées : **produits**, **fournisseurs**, **clients**, **catégories**, **commandes** et **lignes_commandes**.

</div>

### 2.1 Table `catégories`

<div style="text-align: justify;">

La table categories contient les catégories des produits. Chaque catégorie a un identifiant unique et un nom.

</div>

<div align="center">

| Champ | Type     | Description                        |
| ----- | -------- | ---------------------------------- |
| `id`  | INT (PK) | Identifiant unique de la catégorie |
| `nom` | VARCHAR  | Nom de la catégorie                |

</div>

#### Exemple de requête API (JSON)

```json
{
  "nom": "nom_categorie"
}
```

### 2.2 Table `produits`

<div style="text-align: justify;">

La table produits contient les informations sur les produits. Chaque produit est associé à une catégorie et à un fournisseur.

</div>

<div align="center">

| Champ                 | Type     | Description                          |
| --------------------- | -------- | ------------------------------------ |
| `id`                  | INT (PK) | Identifiant unique du produit        |
| `reference`           | VARCHAR  | Référence du produit (unique)        |
| `nom`                 | VARCHAR  | Nom du produit                       |
| `description_produit` | TEXT     | Description du produit               |
| `prix_unitaire`       | DECIMAL  | Prix unitaire du produit             |
| `quantite_stock`      | VARCHAR  | Quantité en stock du produit         |
| `id_categorie`        | INT (FK) | Identifiant de la catégorie associée |
| `id_fournisseur`      | INT (FK) | Identifiant du fournisseur associé   |

</div>

<div style="text-align: justify;">

Relations :

- Chaque produit appartient à une catégorie (relation avec `categories` via `id_categorie`).
- Chaque produit est fourni par un fournisseur (relation avec `fournisseurs` via `id_fournisseur`).

#### Exemple de requête API (JSON)

```json
{
  "reference": "ref_produit",
  "nom": "nom_produit",
  "description_produit": "desc_produit",
  "prix_unitaire": 1000,
  "quantite_stock": 20,
  "id_categorie": 2,
  "id_fournisseur": 3
}
```

</div>

### 2.3 Table `fournisseurs`

<div style="text-align: justify;">

La table fournisseurs contient les informations sur les fournisseurs des produits.

</div>

<div align="center">

| Champ            | Type     | Description                        |
| ---------------- | -------- | ---------------------------------- |
| `id`             | INT (PK) | Identifiant unique du fournisseur  |
| `nom`            | VARCHAR  | Nom du fournisseur                 |
| `numero_adresse` | INT      | Numéro d'adresse du fournisseur    |
| `rue_adresse`    | VARCHAR  | Rue de l'adresse du fournisseur    |
| `code_postal`    | VARCHAR  | Code postal du fournisseur         |
| `ville`          | VARCHAR  | Ville du fournisseur               |
| `telephone`      | VARCHAR  | Numéro de téléphone du fournisseur |
| `email`          | VARCHAR  | Email du fournisseur               |

</div>

#### Exemple de requête API (JSON)

```json
{
  "nom": "nom_fournisseur",
  "numero_adresse": 10,
  "rue_adresse": "rue des fournisseurs",
  "code_postal": 75001,
  "ville": "fournisseur ville",
  "telephone": "0101010101",
  "email": "fournisseur@email.com"
}
```

### 2.4 Table `clients`

<div style="text-align: justify;">

La table clients contient les informations sur les clients.

</div>

<div align="center">

| Champ            | Type     | Description                   |
| ---------------- | -------- | ----------------------------- |
| `id`             | INT (PK) | Identifiant unique du client  |
| `nom`            | VARCHAR  | Nom du client                 |
| `prenom`         | VARCHAR  | Prénom du client              |
| `numero_adresse` | INT      | Numéro d'adresse du client    |
| `rue_adresse`    | VARCHAR  | Rue de l'adresse du client    |
| `code_postal`    | VARCHAR  | Code postal du client         |
| `ville`          | VARCHAR  | Ville du client               |
| `telephone`      | VARCHAR  | Numéro de téléphone du client |
| `email`          | VARCHAR  | Email du client               |

</div>

#### Exemple de requête API (JSON)

```json
{
  "nom": "nom_client",
  "prenom": "prenom_client",
  "numero_adresse": 10,
  "rue_adresse": "rue des clients",
  "code_postal": 93340,
  "ville": "client ville",
  "telephone": "0101010101",
  "email": "client@email.com"
}
```

### 2.5 Table `commandes`

<div style="text-align: justify;">

La table commandes contient les informations sur les commandes passées par les clients.

</div>

<div align="center">

| Champ           | Type     | Description                                   |
| --------------- | -------- | --------------------------------------------- |
| `id`            | INT (PK) | Identifiant unique de la commande             |
| `date_commande` | DATE     | Date de la commande                           |
| `prix_total`    | DECIMAL  | Prix total de la commande                     |
| `id_client`     | INT (FK) | Identifiant du client qui a passé la commande |

</div>

<div style="text-align: justify;">

Relation :

- Chaque commande est associée à un client (relation avec `clients` via `id_client`).

</div>

#### Exemple de requête API (JSON)

```json
{
  "date_commande": "2025-02-02",
  "prix_total": 150.75,
  "id_client": 1,
  "lignes_commandes": [
    {
      "id_produit": 1,
      "quantite": 2,
      "prix_unitaire": 25.0,
      "total_ligne": 25
    },
    {
      "id_produit": 2,
      "quantite": 3,
      "prix_unitaire": 15.25,
      "total_ligne": 25
    }
  ]
}
```

### 2.6 Table `lignes_commandes`

<div style="text-align: justify;">

La table lignes_commandes contient les informations sur les produits spécifiques d'une commande, c'est-à-dire les produits ajoutés dans la commande avec leur quantité et le prix.

</div>

<div align="center">

| Champ           | Type     | Description                                  |
| --------------- | -------- | -------------------------------------------- |
| `id`            | INT (PK) | Identifiant unique de la ligne de commande   |
| `id_commande`   | INT (FK) | Identifiant de la commande associée          |
| `id_produit`    | INT (FK) | Identifiant du produit associé               |
| `quantite`      | INT      | Quantité du produit commandé                 |
| `prix_unitaire` | DECIMAL  | Prix unitaire du produit dans la commande    |
| `total_ligne`   | DECIMAL  | Total de la ligne (quantité x prix_unitaire) |

</div>

<div style="text-align: justify;">

Relations :

- Chaque ligne de commande appartient à une commande (relation avec `commandes` via `id_commande`).
- Chaque ligne de commande correspond à un produit (relation avec `produits` via `id_produit`).

</div>

### 2.7 Relations entre les tables

<div style="text-align: justify;">

- Un client peut passer plusieurs commandes. Cela se fait par la relation entre `commandes` et `clients` via le champ `id_client`.
- Une commande peut contenir plusieurs produits. Cela se fait par la relation entre `lignes_commandes` et `commandes`, et aussi entre `lignes_commandes` et `produits`.
- Un produit appartient à une catégorie et à un fournisseur. Cela se fait par les relations entre `produits` et les tables `categories` et `fournisseurs`.

</div>

<div align="center">

|      Tables (PK) | Relation | Table (FK)           |
| ---------------: | :------: | :------------------- |
|      clients (1) |   <->    | commandes (n)        |
|    commandes (1) |   <->    | lignes_commandes (n) |
|     produits (1) |   <->    | lignes_commandes (n) |
|   categories (1) |   <->    | produits (n)         |
| fournisseurs (1) |   <->    | produits (n)         |

</div>

### 2.8 Diagramme des relations entre les tables

<img src="images\Diagramme_Examen_BDD.drawio.png"/>

# Audit et Améliorations

## Introduction

Cet audit a pour objectif d'analyser l'API et la structure de la base de données afin d'identifier les failles de sécurité, les incohérences potentielles et les améliorations possibles. Nous explorerons des points cruciaux comme la gestion des erreurs, la sécurité des requêtes SQL, la logique métier, et la validation des données. L'objectif est de proposer une version 2 plus robuste et plus sécurisée du système.

## 1. Failles de sécurité et incohérences

### 1.1 Injection SQL

<div style="text-align: justify;">

<u>**Problème**</u>: Dans le code actuel, les requêtes SQL sont construits par concaténation de chaînes de caractères. Cela constitue une faille de sécurité majeure, car cela rend l'API vulnérable aux attaques par injection SQL.

</div>

<div style="text-align: justify;">

Exemple :

</div>

```javascript
await connection.query(`INSERT INTO categories (nom) VALUES ('${nom}')`);
```

<div style="text-align: justify;">

<u>**Solution**</u>: Il est impératif d'utiliser des **requêtes paramétrées** pour éviter ce type d'injection. Par exemple, remplacer la concaténation de chaînes par des paramètres :

</div>

```javascript
await connection.execute("INSERT INTO categories (nom) VALUES (?)", [nom]);
```

<div style="text-align: justify;">

Pour les requêtes de modifications (**INSERT**, **UPDATE**, **DELETE**), il est préférable de privilégier la methode `execute()` à `query()` car elle permet de réaliser des requêtes paramétrées qui évite les risques d'injection SQL. L'utilisation de `execute()` est plus sécurisée car elle permet de séparer la requête SQL de ses données, évitant ainsi toute injection.

</div>

### 1.2 Validation des données

<div style="text-align: justify;">

<u>**Problème**</u>: Il n'y a pas de vérification approfondie des données envoyées par l'utilisateur. \
Par exemple :

- La **quantité en stock** peut être négative, ce qui n'a pas de sens.
- Des **champs vides** ou des valeurs nulles pourraient être insérées dans la base de données sans contrôle.

</div>

<div style="text-align: justify;">

<u>**Solution**</u>: Il faut ajouter des validations côté serveur pour vérifier que :

- Les champs obligatoires ne sont pas vides.
- Les valeurs sont cohérentes avec les règles métier (ex. : quantités positives, prix unitaire > 0, etc.).

</div>

<div style="text-align: justify;">

Des contrôles conditionnels peuvent, par exemple, permettre de vérifier que la quantité de stock est positive :

</div>

```javascript
if (quantite_stock < 0) {
  return res.status(400).send("La quantité en stock ne peut pas être négative.");
}
```

<div style="text-align: justify;">

Où directement sur le schema de la table `produits`:

</div>

```sql
quantite_stock INT NOT NULL CHECK (quantite_stock >= 0)
```

### 1.3 Gestion des erreurs

<div style="text-align: justify;">

<u>**Problème**</u>: Aucune gestion des erreurs n'est présente dans les requêtes. Si une erreur se produit lors de l'exécution d'une requête SQL, le serveur risque de planter sans message d'erreur approprié.

</div>

<div style="text-align: justify;">

<u>**Solution**</u>: L'utilisation de `try/catch` pour gérer les erreurs est essentielle. Par exemple :

</div>

```javascript
try {
  const [rows] = await connection.execute("SELECT * FROM categories");
  res.json(rows);
} catch (err) {
  console.error(err);
  res.status(500).send("Erreur du serveur.");
}
```

### 1.4 Connexion à la Base de Données

<div style="text-align: justify;">

<u>**Problème**</u>: La connexion à la base de données est établie à chaque requête et la fermeture de la connexion n'est jamais réalisée. Cela pourrait entraîner une fuite de ressources si les connexions ne sont pas fermées après chaque requête.

</div>

<div style="text-align: justify;">

<u>**Solution**</u>: Il est important de fermer la connexion après chaque requête pour libérer les ressources. Par exemple, après chaque requête :

</div>

```javascript
await connection.end();
```

### 1.5 Gestion des transactions

<div style="text-align: justify;">

<u>**Problème**</u>: Il n'y a pas de gestion des transactions, ce qui peut entraîner des incohérences dans la base de données. Par exemple, si une commande échoue en cours de traitement, les modifications des tables liées ne sont pas annulées.

</div>

<div style="text-align: justify;">

<u>**Solution**</u>: Les transactions devraient être utilisées pour garantir l'intégrité des données. Une fois qu'une transaction est commencée, toutes les modifications doivent être validées ou annulées ensemble en cas d'erreur.

</div>

```javascript
await connection.beginTransaction();
try {
  // Exécution des requêtes
  await connection.commit();
} catch (err) {
  await connection.rollback();
  throw err;
}
```

## 2. Améliorations possibles

### 2.1 Utilisation de Requêtes Paramétrées

<div style="text-align: justify;">

Comme mentionné plus haut, il est nécessaire d'utiliser des **requêtes paramétrées** au lieu de concaténer des chaînes de caractères pour éviter l'injection SQL. Cela doit être appliqué à toutes les requêtes SQL dans le code, y compris celles concernant l'ajout, la mise à jour et la suppression des données.

</div>

### 2.2 Calcul automatique des totaux

<div style="text-align: justify;">

<u>**Problèmes**</u>: Les totaux pour les lignes de commande et les commandes elles-mêmes sont actuellement saisis manuellement. Cela peut entraîner des erreurs de saisis.

</div>

<div style="text-align: justify;">

<u>**Solution**</u>: Le calcul des totaux devrait être automatisé. Par exemple, lors de l'insertion ou de la mise à jour d'une ligne de commande, le total de la ligne devrait être calculé automatiquement :

</div>

```javascript
const totalLigne = quantite * prixUnitaire;
```

<div style="text-align: justify;">

De plus, le total de la commande devrait être recalculé à chaque ajout ou suppression de ligne.

</div>

### 2.3 Validation des données

<div style="text-align: justify;">

Il est essentiel de **vérifier les données envoyées par l'utilisateur** avant de les insérer dans la base de données, comme par exemple:

- Vérification de la cohérence des valeurs des champs (**quantite_stock >= 0**, **prix_unitaire > 0**, etc.).
- Gestion des valeurs par défaut et des champs obligatoires.

</div>

<div style="text-align: justify;">

Exemple de validation pour les produits:

</div>

```javascript
if (!reference || !nom || !prix_unitaire || quantite_stock < 0) {
  return res.status(400).send("Données invalides.");
}
```

### 2.4 Mise à jour automatique des stocks

<div style="text-align: justify;">

<u>**Problèmes**</u>: Lorsqu'une commande est passée, les stocks de produits ne sont pas automatiquement mis à jour.

</div>

<div style="text-align: justify;">

<u>**Solutions**</u>: Après chaque commande, le stock de chaque produit commandé doit être réduit en fonction de la quantité commandée.

</div>

```javascript
await connection.query(`UPDATE produits SET quantite_stock = quantite_stock - ? WHERE id = ?`, [quantite, id_produit]);
```

### 2.5 Automatisation des Dates

<div style="text-align: justify;">

<u>**Problèmes**</u>: Les dates de commandes sont actuellement envoyées manuellement.

</div>

<div style="text-align: justify;">

<u>**Solutions**</u>: La date de la commande devrait être automatiquement définie lors de la création d'une commande, plutôt que d'être saisie manuellement par l'utilisateur :

</div>

```javascript
const date_commande = new Date();
```

### 2.6 Validation de la cohérence des stocks avant une commande

<div style="text-align: justify;">

<u>**Problèmes**</u>: Il n'y a pas de validation qui empêche la commande de produits lorsque le stock est insuffisant.

</div>
<div style="text-align: justify;">

<u>**Solutions**</u>: Avant de passer une commande, il faut vérifier que la quantité demandée est disponible en stock.

</div>

```javascript
const [produit] = await connection.execute(`SELECT quantite_stock FROM produits WHERE id = ?`, [id_produit]);

if (quantite > produit.quantite_stock) {
  return res.status(400).send("Stock insuffisant pour le produit.");
}
```

### 2.7 Gestion des rôles et authentification

<div style="text-align: justify;">

<u>**Problèmes**</u>: L'API ne dispose d'aucun mécanisme de gestion des rôles. Cela pose un problème de sécurité, car toute personne ayant accès à l'API peut effectuer des actions sensibles (ajouter, modifier ou supprimer des données).

</div>

<div style="text-align: justify;">

<u>**Solutions**</u>: Il est conseillé de gérer des rôles (admin, utilisateur, etc.). L'admin pourrait avoir accès à toutes les fonctionnalités, tandis que l'utilisateur serait limité à consulter les produits, passer des commandes, etc.

</div>

## 3. Conclusion de l'audit

<div style="text-align: justify;">

Les modifications proposées pour la version 2 visent à améliorer la sécurité, la robustesse et la cohérence des données dans l'application. L'intégration de **requêtes paramétrées**, la **validation des données**, le **calcul automatique des totaux**, la **gestion des erreurs** et l'utilisation de **transactions** pour garantir l'intégrité des données sont les principales améliorations.

</div>
<div style="text-align: justify;">

De plus, la mise à jour automatique des stocks et la gestion des rôles renforceront la logique métier et la sécurité du système.

</div>
