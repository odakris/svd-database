# SUP DE VINCI - BASE DE DONNEES

## Description

Ce projet permet de gérer une base de données liée à un système de gestion de commandes pour une entreprise vendant des produits. Le système permet de gérer les produits, les fournisseurs, les clients, les commandes et les catégories de produits à travers une API RESTful construite avec Node.js, Express et MySQL.

Le projet inclut une API qui permet d’effectuer des opérations CRUD (Create, Read, Update, Delete) sur ces entités. La base de données est initialisée avec un script SQL et peut être manipulée via des requêtes HTTP.

## Installation

### 1. Forkez le dépôt

Pour commencer, forkez ce dépôt sur GitHub afin de pouvoir travailler sur votre propre copie.

### 2. Clonez le dépôt :

Clonez ensuite le dépôt sur votre machine locale :

```
git clone https://github.com/odakris/svd-database.git
cd svd-bdd
```

### 3. Créez le fichier `.env`

À la racine de votre projet, créez un fichier `.env` pour y placer vos variables d'environnement. Vous pouvez vous baser sur le modèle suivant.

#### Exemple de fichier `.env`

```SQL
# Database configuration
DB_HOST=localhost
DB_NAME=avion_papier

# ROOT
DB_USER=root
DB_PASSWORD=root

# ADMIN
ADMIN_USER=admin
ADMIN_PASSWORD=adminpassword

# USER
READONLY_USER=user
READONLY_PASSWORD=userpassword

# ORDER
ORDER_USER=order
ORDER_PASSWORD=orderpassword

# USER
MANAGER_USER=manager
MANAGER_PASSWORD=managerpassword
```

#### Description des variables :

- **DB_HOST** : L'adresse du serveur de base de données
- **DB_NAME** : Le nom de la base de données à utiliser (par défaut, `avion_papier` dans cet exemple).
- **DB_USER** : L'utilisateur MySQL ayant les privilèges nécessaires (habituellement `root` pour les environnements locaux).
- **DB_PASSWORD** : Le mot de passe de l'utilisateur MySQL.

#### Utilisateurs spécifiques :

- **ADMIN_USER** et **ADMIN_PASSWORD** : Identifiants pour l'utilisateur ayant des privilèges administratifs sur la base de données.
- **READONLY_USER** et **READONLY_PASSWORD** : Identifiants pour un utilisateur en lecture seule, qui peut uniquement effectuer des sélections (SELECT).
- **ORDER_USER** et **ORDER_PASSWORD** : Identifiants pour l'utilisateur qui peut gérer les commandes dans la base de données.
- **MANAGER_USER** et **MANAGER_PASSWORD** : Identifiants pour un utilisateur ayant des privilèges de gestion dans la base de données.

### 4. Installer les dépendances :

Après avoir configuré votre fichier `.env`, installez les dépendances du projet en utilisant npm ou yarn.

```
npm install
```

ou

```
yarn install
```

### 5. Lancer l'application

```
npm start
```

Cela démarrera le serveur sur le port 3000 par défaut. Vous pouvez ensuite accéder à l'application via votre navigateur à l'adresse http://localhost:3000.

Vous pouvez maintenant utiliser des outils comme [Postman](https://www.postman.com/) pour interagir avec l'API.

### 6. Initialiser la base de données

Pour initialiser la base de données, envoyez une requête POST à l'endpoint `/init` de l'application avec l'en-tête (headers de la requête) **`role`** défini sur **`root`**. Vous pouvez utiliser un outil comme Postman

### 7. Branches

Il existe deux branches pour ce projet. La première version est accessible sur la branche **VERSION-1**

```
git checkout VERSION-1
```

La version finale est accessible sur la branche **master**

```
git checkout master
```

## Endpoints de l'API

### 1. Initialisation de la Base de Données

**POST** `/init` : Initialise la base de données avec les tables et les données de test.

Pour la deuxième version de l'application, la requête POST vers le endpoint `/init` doit être réalisé avec un header `role` défini avec la valeur `root`

### 2. Catégories

**GET** `/categories` : Récupère toutes les catégories.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "nom": "Maquettes d'avion - Avions militaires"
},
{
  "id": 2,
  "nom": "Maquettes d'avion - Avions civils"
},
{
  "id": 3,
  "nom": "Maquettes d'avion - Avions de chasse"
},
...
```

**GET** `/categories/:id` : Récupère une catégorie par son identifiant.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "nom": "Maquettes d'avion - Avions militaires"
}
```

**POST** `/categories` : Ajoute une nouvelle catégorie.

#### Exemple de requête POST

```javascript
// corps de la requête (json)
{
  "nom": "NOUVELLE_CATEGORIE"
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Catégorie ajoutée",
  "result": {
    "id": 9,
    "nom": "NOUVELLE_CATEGORIE"
  }
}
```

**PUT** `/categories/:id` : Met à jour une catégorie par son identifiant.

#### Exemple de requête PUT

```javascript
// corps de la requête (json)
{
  "nom": "CATEGORIE_MODIF"
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Catégorie mise à jour",
  "result": {
    "id": 9,
    "nom": "CATEGORIE_MODIF"
  }
}
```

**DELETE** `/categories/:id` : Supprime une catégorie par son identifiant.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Catégorie supprimée"
}
```

### 3. Produits

**GET** `/produits` : Récupère tous les produits.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "reference": "A001",
  "nom": "Maquette Avion Militaire F-16",
  "description_produit": "Maquette avion en papier, echelle 1:72, modele F-16 Fighting Falcon",
  "prix_unitaire": "15.00",
  "quantite_stock": 35,
  "id_categorie": 1,
  "id_fournisseur": 1
},
{
  "id": 2,
  "reference": "A002",
  "nom": "Maquette Avion Civil Airbus A320",
  "description_produit": "Maquette avion en papier, echelle 1:100, modele Airbus A320",
  "prix_unitaire": "18.50",
  "quantite_stock": 10,
  "id_categorie": 2,
  "id_fournisseur": 2
},
{
  "id": 3,
  "reference": "A003",
  "nom": "Maquette Avion Militaire Spitfire",
  "description_produit": "Maquette avion en papier, echelle 1:72, modele Spitfire",
  "prix_unitaire": "17.00",
  "quantite_stock": 19,
  "id_categorie": 1,
  "id_fournisseur": 1
},
...
```

**GET** `/produits/:id` : Récupère un produit par son identifiant.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "reference": "A001",
  "nom": "Maquette Avion Militaire F-16",
  "description_produit": "Maquette avion en papier, echelle 1:72, modele F-16 Fighting Falcon",
  "prix_unitaire": "15.00",
  "quantite_stock": 35,
  "id_categorie": 1,
  "id_fournisseur": 1
}
```

**POST** `/produits` : Ajoute un nouveau produit.

#### Exemple de requête POST

```javascript
// corps de la requête (json)
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

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Produit ajouté",
  "result": {
    "id": 14,
    "reference": "ref_produit",
    "nom": "nom_produit",
    "description_produit": "desc_produit",
    "prix_unitaire": "1000.00",
    "quantite_stock": 20,
    "id_categorie": 2,
    "id_fournisseur": 3
  }
}
```

**PUT** `/produits/:id` : Met à jour un produit par son identifiant.

#### Exemple de requête PUT

```javascript
// corps de la requête (json)
{
  "reference": "NEW_ref_produit",
  "nom": "NEW_nom_produit",
  "description_produit": "NEW_desc_produit",
  "prix_unitaire": 99,
  "quantite_stock": 55,
  "id_categorie": 1,
  "id_fournisseur": 5
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Produit mis à jour",
  "result": {
    "id": 14,
    "reference": "NEW_ref_produit",
    "nom": "NEW_nom_produit",
    "description_produit": "NEW_desc_produit",
    "prix_unitaire": "99.00",
    "quantite_stock": 55,
    "id_categorie": 1,
    "id_fournisseur": 5
  }
}
```

**DELETE** `/produits/:id` : Supprime un produit par son identifiant.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Produit supprimé"
}
```

### 4. Fournisseurs

**GET** `/fournisseurs` : Récupère tous les fournisseurs.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "nom": "Fournisseur A",
  "numero_adresse": 12,
  "rue_adresse": "rue des Modeles",
  "code_postal": "75001",
  "ville": "Paris",
  "telephone": "0123456789",
  "email": "contact@fournisseurA.com"
},
{
  "id": 2,
  "nom": "Fournisseur B",
  "numero_adresse": 45,
  "rue_adresse": "avenue des Maquettes",
  "code_postal": "69002",
  "ville": "Lyon",
  "telephone": "0987654321",
  "email": "contact@fournisseurB.com"
},
{
  "id": 3,
  "nom": "Fournisseur C",
  "numero_adresse": 78,
  "rue_adresse": "rue des Kits",
  "code_postal": "33000",
  "ville": "Bordeaux",
  "telephone": "0147258369",
  "email": "contact@fournisseurC.com"
},
...
```

**GET** `/fournisseurs/:id` : Récupère un fournisseur par son identifiant.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "nom": "Fournisseur A",
  "numero_adresse": 12,
  "rue_adresse": "rue des Modeles",
  "code_postal": "75001",
  "ville": "Paris",
  "telephone": "0123456789",
  "email": "contact@fournisseurA.com"
}
```

**POST** `/fournisseurs` : Ajoute un nouveau fournisseur.

#### Exemple de requête POST

```javascript
// corps de la requête (json)
{
  "nom": "fournisseur",
  "numero_adresse": 10,
  "rue_adresse": "rue des fournisseurs",
  "code_postal": 1212,
  "ville": "fournisseur",
  "telephone": "0101010101",
  "email": "fournisseur@gmail.com"
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Fournisseur ajouté",
  "result": {
    "id": 6,
    "nom": "fournisseur",
    "numero_adresse": 10,
    "rue_adresse": "rue des fournisseurs",
    "code_postal": "1212",
    "ville": "fournisseur",
    "telephone": "0101010101",
    "email": "fournisseur@gmail.com"
  }
}
```

**PUT** `/fournisseurs/:id` : Met à jour un fournisseur par son identifiant.

#### Exemple de requête PUT

```javascript
// corps de la requête (json)
{
  "nom": "NEW_fournisseur",
  "numero_adresse": 10,
  "rue_adresse": "rue des NEW_fournisseurs",
  "code_postal": 1212,
  "ville": "NEW_fournisseur",
  "telephone": "0202020202",
  "email": "NEW_fournisseur@gmail.com"
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Fournisseur mis à jour",
  "result": {
    "id": 6,
    "nom": "NEW_fournisseur",
    "numero_adresse": 10,
    "rue_adresse": "rue des NEW_fournisseurs",
    "code_postal": "1212",
    "ville": "NEW_fournisseur",
    "telephone": "0202020202",
    "email": "NEW_fournisseur@gmail.com"
  }
}
```

**DELETE** `/fournisseurs/:id` : Supprime un fournisseur par son identifiant.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Fournisseur supprimé"
}
```

### 5. Clients

**GET** `/clients` : Récupère tous les clients.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "nom": "Durand",
  "prenom": "Michel",
  "numero_adresse": 12,
  "rue_adresse": "rue de la Maquette",
  "code_postal": "75010",
  "ville": "Paris",
  "telephone": "0612345678",
  "email": "michel.durand@email.com"
},
{
  "id": 2,
  "nom": "Lemoine",
  "prenom": "Julie",
  "numero_adresse": 25,
  "rue_adresse": "avenue des Maquettes",
  "code_postal": "69008",
  "ville": "Lyon",
  "telephone": "0623456789",
  "email": "julie.lemoine@email.com"
},
{
  "id": 3,
  "nom": "Martinez",
  "prenom": "Carlos",
  "numero_adresse": 33,
  "rue_adresse": "place des Maquettes",
  "code_postal": "33000",
  "ville": "Bordeaux",
  "telephone": "0634567890",
  "email": "carlos.martinez@email.com"
},
...
```

**GET** `/clients/:id` : Récupère un client par son identifiant.

```javascript
// réponse (json)
{
  "id": 1,
  "nom": "Durand",
  "prenom": "Michel",
  "numero_adresse": 12,
  "rue_adresse": "rue de la Maquette",
  "code_postal": "75010",
  "ville": "Paris",
  "telephone": "0612345678",
  "email": "michel.durand@email.com"
}
```

**POST** `/clients` : Ajoute un nouveau client.

#### Exemple de requête POST

```javascript
// corps de la requête (json)
{
  "nom": "nom_client",
  "prenom": "prenom_client",
  "numero_adresse": 10,
  "rue_adresse": "rue des clients",
  "code_postal": 1212,
  "ville": "client ville",
  "telephone": "01010101",
  "email": "client@gmail.com"
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Client ajouté",
  "result": {
    "id": 7,
    "nom": "nom_client",
    "prenom": "prenom_client",
    "numero_adresse": 10,
    "rue_adresse": "rue des clients",
    "code_postal": "1212",
    "ville": "client ville",
    "telephone": "01010101",
    "email": "client@gmail.com"
  }
}
```

**PUT** `/clients/:id` : Met à jour un client par son identifiant.

#### Exemple de requête PUT

```javascript
// corps de la requête (json)
{
  "nom": "NEW_nom_client",
  "prenom": "NEW_prenom_client",
  "numero_adresse": 10,
  "rue_adresse": "rue des NEW_clients",
  "code_postal": 1212,
  "ville": "NEW_client ville",
  "telephone": "0202020202",
  "email": "NEW_client@gmail.com"
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Client mis à jour",
  "result": {
    "id": 7,
    "nom": "NEW_nom_client",
    "prenom": "NEW_prenom_client",
    "numero_adresse": 10,
    "rue_adresse": "rue des NEW_clients",
    "code_postal": "1212",
    "ville": "NEW_client ville",
    "telephone": "0202020202",
    "email": "NEW_client@gmail.com"
  }
}
```

**DELETE** `/clients/:id` : Supprime un client par son identifiant.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Client supprimé"
}
```

### 6. Commandes

**GET** `/commandes` : Récupère toutes les commandes, incluant leurs lignes de commande.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "date_commande": "2025-01-10",
  "id_client": 1,
  "prix_total": "82.00",
  "lignes_commandes": [
    {
      "id": 1,
      "id_produit": 1,
      "quantite": 3,
      "prix_unitaire": "15.00",
      "total_ligne": "45.00"
    },
    {
      "id": 2,
      "id_produit": 2,
      "quantite": 2,
      "prix_unitaire": "18.50",
      "total_ligne": "37.00"
    }
  ]
},
{
  "id": 2,
  "date_commande": "2025-01-12",
  "id_client": 2,
  "prix_total": "42.00",
  "lignes_commandes": [
    {
      "id": 3,
      "id_produit": 3,
      "quantite": 1,
      "prix_unitaire": "17.00",
      "total_ligne": "17.00"
    },
    {
      "id": 4,
      "id_produit": 4,
      "quantite": 1,
      "prix_unitaire": "25.00",
      "total_ligne": "25.00"
    }
  ]
},
{
  "id": 3,
  "date_commande": "2025-01-15",
  "id_client": 3,
  "prix_total": "98.00",
  "lignes_commandes": [
    {
      "id": 5,
      "id_produit": 5,
      "quantite": 3,
      "prix_unitaire": "20.00",
      "total_ligne": "60.00"
    },
    {
      "id": 6,
      "id_produit": 6,
      "quantite": 2,
      "prix_unitaire": "19.00",
      "total_ligne": "38.00"
    }
  ]
},
...
```

**GET** `/commandes/:id` : Récupère une commande par son identifiant, incluant ses lignes de commande.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "date_commande": "2025-01-10",
  "id_client": 1,
  "prix_total": "82.00",
  "lignes_commandes": [
    {
      "id": 1,
      "id_produit": 1,
      "quantite": 3,
      "prix_unitaire": "15.00",
      "total_ligne": "45.00"
    },
    {
      "id": 2,
      "id_produit": 2,
      "quantite": 2,
      "prix_unitaire": "18.50",
      "total_ligne": "37.00"
    }
  ]
}
```

**POST** `/commandes` : Ajoute une nouvelle commande.

#### Exemple de requête POST pour la **VERSION 1**

```javascript
// corps de la requête (json)
{
  "date_commande": "2025-01-02",
  "prix_total": 85.5,
  "id_client": 1,
  "lignes_commandes": [
    {
      "id_produit": 1,
      "quantite": 2,
      "prix_unitaire": 15.0,
      "total_ligne": 30.0
    },
    {
      "id_produit": 2,
      "quantite": 3,
      "prix_unitaire": 18.5,
      "total_ligne": 55.5
    }
  ]
}
```

#### Exemple de requête POST pour la **VERSION 2**

```javascript
// corps de la requête (json)
{
  "date_commande": "2025-01-02",
  "id_client": 1,
  "lignes_commandes": [
    {
      "id_produit": 1,
      "quantite": 2
    },
    {
      "id_produit": 2,
      "quantite": 3
    }
  ]
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Commande ajoutée",
  "commande": [
    {
      "id": 13,
      "date_commande": "2025-01-02",
      "id_client": 1,
      "prix_total": "85.50",
      "lignes_commandes": [
        {
          "id": 25,
          "id_produit": 1,
          "quantite": 2,
          "prix_unitaire": "15.00",
          "total_ligne": "30.00"
        },
        {
          "id": 26,
          "id_produit": 2,
          "quantite": 3,
          "prix_unitaire": "18.50",
          "total_ligne": "55.50"
        }
      ]
    }
  ]
}
```

**PUT** `/commandes/:id` : Met à jour une commande et ses lignes.

#### Exemple de requête PUT pour la **VERSION 1**

```javascript
// corps de la requête (json)
{
  "date_commande": "2025-01-31",
  "prix_total": 77.0,
  "id_client": 1,
  "lignes_commandes": [
    {
      "id_produit": 5,
      "quantite": 3,
      "prix_unitaire": 20.0,
      "total_ligne": 60.0
    },
    {
      "id_produit": 3,
      "quantite": 1,
      "prix_unitaire": 17.0,
      "total_ligne": 17.0
    }
  ]
}
```

#### Exemple de requête PUT pour la **VERSION 2**

```javascript
// corps de la requête (json)
{
  "date_commande": "2025-01-31",
  "id_client": 1,
  "lignes_commandes": [
    {
      "id_produit": 5,
      "quantite": 3
    },
    {
      "id_produit": 3,
      "quantite": 1
    }
  ]
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Commande mise à jour",
  "commande": [
    {
      "id": 13,
      "date_commande": "2025-01-02",
      "id_client": 1,
      "prix_total": "77.00",
      "lignes_commandes": [
        {
          "id": 29,
          "id_produit": 5,
          "quantite": 3,
          "prix_unitaire": "20.00",
          "total_ligne": "60.00"
        },
        {
          "id": 30,
          "id_produit": 3,
          "quantite": 1,
          "prix_unitaire": "17.00",
          "total_ligne": "17.00"
        }
      ]
    }
  ]
}
```

**DELETE** `/commandes/:id` : Supprime une commande et ses lignes.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Commande supprimée ainsi que les lignes de commande associées"
}
```

### 7. Lignes de commandes (version 2)

**GET** `/lignes` : Récupère toutes les lignes des commandes.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "id_produit": 1,
  "id_commande": 1,
  "quantite": 3,
  "prix_unitaire": "15.00",
  "total_ligne": "45.00"
},
{
  "id": 2,
  "id_produit": 2,
  "id_commande": 1,
  "quantite": 2,
  "prix_unitaire": "18.50",
  "total_ligne": "37.00"
},
{
  "id": 3,
  "id_produit": 3,
  "id_commande": 2,
  "quantite": 1,
  "prix_unitaire": "17.00",
  "total_ligne": "17.00"
},
...
```

**GET** `/lignes/:id` : Récupère une ligne de commande par son identifiant.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "id": 1,
  "id_produit": 1,
  "id_commande": 1,
  "quantite": 3,
  "prix_unitaire": "15.00",
  "total_ligne": "45.00"
}
```

**POST** `/lignes` : Ajoute une ligne de commande.

#### Exemple de requête POST

```javascript
// corps de la requête (json)
{
  "id_produit": 1,
  "id_commande": 1,
  "quantite": 2
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Ligne de commande créée avec succès",
  "ligne": {
    "id": 31,
    "id_produit": 1,
    "id_commande": 1,
    "quantite": 2,
    "prix_unitaire": "15.00",
    "total_ligne": "30.00"
  }
}
```

**PUT** `/lignes/:id` : Met à jour une ligne de commande par son identifiant.

#### Exemple de requête PUT

```javascript
// corps de la requête (json)
{
  "id_produit": 2,
  "id_commande": 1,
  "quantite": 5
}
```

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Ligne de commande mise à jour",
  "ligne": {
    "id": 31,
    "id_produit": 2,
    "id_commande": 1,
    "quantite": 5,
    "prix_unitaire": "18.50",
    "total_ligne": "92.50"
  }
}
```

**DELETE** `/lignes/:id` : Supprime une ligne de commande par son identifiant.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "message": "Ligne de commande supprimée"
}
```

## Fonctionnalités avancées

### 1. Lister les commandes par année

**GET** `/commandes?start=2025-01-01&end=2025-01-13` : Récupère toutes les commandes filtrées par date.

Ces filtres sont `facultatif` et il est également possible de filter à partir d'une date précise (avec `start`) ou jusqu'à une certaine date (avec `end`).
En cas d'absence de ces filtres, l'appel retournera simplement toutes les commandes présentes dans la base.

Si aucune commande n'est trouvée, alors un message est retourné.

```javascript
{
  "message": "Aucune commande trouvée"
}
```

### 2. Rechercher les commandes d’un client

**GET** `/clients/:id/commandes` : Récupère toutes les commandes pour un client identifié.

### 3. Lister les commandes qui contiennent un article précis

**GET** `/produits/:id/commandes` : Récupère toutes les commandes contenant un produit spécifique.

### 4. Recherche multi-critères

**GET** `/commandes?start=2023-01-01&end=2023-12-31&id_produit=1&id_client=2&prix_min=25&prix_max=45`

Il est maintenant possible, dans la version 2 d'appliquer des filtres afin d'affiner la recherche de commande :

- Filtrage par **date** : `start=2023-01-01&end=2023-12-31`
- Filtrage par **produit** : `id_produit=1`
- Filtrage par **client** : `id_client=2`
- Filtrage par **prix total de commande minimum** : `prix_min=25`
- Filtrage par **prix total de commande maximum** : `prix_max=45`

Chacun de ces filtres peut être appliqué individuellement.

## 5. Statistiques

### Top produits

**GET** `/statistiques/top-produits` : Récupère les 3 produits les plus vendus.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "nom": "Maquette Avion Civil Airbus A320",
  "description_produit": "Maquette avion en papier, echelle 1:100, modele Airbus A320",
  "prix_unitaire": "18.50",
  "quantite_stock": 10,
  "total_ventes": 8
},
{
  "nom": "Maquette Avion Militaire F-16",
  "description_produit": "Maquette avion en papier, echelle 1:72, modele F-16 Fighting Falcon",
  "prix_unitaire": "15.00",
  "quantite_stock": 33,
  "total_ventes": 7
},
{
  "nom": "Maquette Avion Militaire Spitfire",
  "description_produit": "Maquette avion en papier, echelle 1:72, modele Spitfire",
  "prix_unitaire": "17.00",
  "quantite_stock": 19,
  "total_ventes": 1
}
```

### Top clients

**GET** `/statistiques/top-clients` : Récupère les 3 clients ayant réalisé le plus de commandes.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "nom": "Durand",
  "prenom": "Michel",
  "nombre_commandes": 7
},
{
  "nom": "Lemoine",
  "prenom": "Julie",
  "nombre_commandes": 1
},
{
  "nom": "Martinez",
  "prenom": "Carlos",
  "nombre_commandes": 1
}
```

### Top fournisseurs

**GET** `/statistiques/top-fournisseurs` : Récupère les 3 fournisseurs les plus sollicités.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "nom": "Fournisseur B",
  "nombre_commandes": 11
},
{
  "nom": "Fournisseur A",
  "nombre_commandes": 10
},
{
  "nom": "Fournisseur C",
  "nombre_commandes": 2
}
```

### Total des ventes

**GET** `/statistiques/total-ventes` : Récupère le total des ventes.

#### Exemple de réponse JSON

```javascript
// réponse (json)
{
  "total_ventes": "1178.50"
}
```

De la même manière que pour les commandes, il est possible d'appliquer des filtres avec `start` et `end` pour récupérer le total des ventes sur une période donnée.

## Structure de la base de données

La base de données `avion_papier` est structurée autour de plusieurs tables interconnectées : **produits**, **fournisseurs**, **clients**, **catégories**, **commandes** et **lignes_commandes**.

### 1. Table `catégories`

La table categories contient les catégories des produits. Chaque catégorie a un identifiant unique et un nom.

<div align="center">

| Champ | Type     | Description                        |
| ----- | -------- | ---------------------------------- |
| `id`  | INT (PK) | Identifiant unique de la catégorie |
| `nom` | VARCHAR  | Nom de la catégorie                |

</div>

### 2. Table `produits`

La table produits contient les informations sur les produits. Chaque produit est associé à une catégorie et à un fournisseur.

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

Relations :

- Chaque produit appartient à une catégorie (relation avec `categories` via `id_categorie`).
- Chaque produit est fourni par un fournisseur (relation avec `fournisseurs` via `id_fournisseur`).

### 3. Table `fournisseurs`

La table fournisseurs contient les informations sur les fournisseurs des produits.

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

### 4. Table `clients`

La table clients contient les informations sur les clients.

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

### 5. Table `commandes`

La table commandes contient les informations sur les commandes passées par les clients.

<div align="center">

| Champ           | Type     | Description                                   |
| --------------- | -------- | --------------------------------------------- |
| `id`            | INT (PK) | Identifiant unique de la commande             |
| `date_commande` | DATE     | Date de la commande                           |
| `prix_total`    | DECIMAL  | Prix total de la commande                     |
| `id_client`     | INT (FK) | Identifiant du client qui a passé la commande |

</div>

Relation :

- Chaque commande est associée à un client (relation avec `clients` via `id_client`).

### 6. Table `lignes_commandes`

La table lignes_commandes contient les informations sur les produits spécifiques d'une commande, c'est-à-dire les produits ajoutés dans la commande avec leur quantité et le prix.

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

Relations :

- Chaque ligne de commande appartient à une commande (relation avec `commandes` via `id_commande`).
- Chaque ligne de commande correspond à un produit (relation avec `produits` via `id_produit`).

### 7. Relations entre les tables

- Un client peut passer plusieurs commandes. Cela se fait par la relation entre `commandes` et `clients` via le champ `id_client`.
- Une commande peut contenir plusieurs produits. Cela se fait par la relation entre `lignes_commandes` et `commandes`, et aussi entre `lignes_commandes` et `produits`.
- Un produit appartient à une catégorie et à un fournisseur. Cela se fait par les relations entre `produits` et les tables `categories` et `fournisseurs`.

<div align="center">

|      Tables (PK) | Relation | Table (FK)           |
| ---------------: | :------: | :------------------- |
|      clients (1) |   <->    | commandes (n)        |
|    commandes (1) |   <->    | lignes_commandes (n) |
|     produits (1) |   <->    | lignes_commandes (n) |
|   categories (1) |   <->    | produits (n)         |
| fournisseurs (1) |   <->    | produits (n)         |

</div>

### 8. Diagramme des relations entre les tables

<div align="center">
<img src="images\Diagramme_Examen_BDD.drawio.png"/>
</div>
<br/>

# Audit de la première version

### Introduction

Cet audit a pour objectif d'analyser l'API et la structure de la base de données afin d'identifier les failles de sécurité, les incohérences potentielles et les améliorations possibles. Nous explorerons des points cruciaux comme la gestion des erreurs, la sécurité des requêtes SQL, la logique métier, et la validation des données. L'objectif est de proposer une version 2 plus robuste et plus sécurisée du système.

### 1. Injection SQL

<u>**Problème**</u>: Dans le code actuel, les requêtes SQL sont construites par concaténation de chaînes de caractères. Cela constitue une faille de sécurité majeure, car cela rend l'API vulnérable aux attaques par injection SQL.

Exemple :

```javascript
await connection.query(`INSERT INTO categories (nom) VALUES ('${nom}')`);
```

<u>**Solution**</u>: Il est impératif d'utiliser des **requêtes paramétrées** pour éviter ce type d'injection. Par exemple, remplacer la concaténation de chaînes par des paramètres :

```javascript
await connection.execute("INSERT INTO categories (nom) VALUES (?)", [nom]);
```

Pour les requêtes de modifications (**INSERT**, **UPDATE**, **DELETE**), il est préférable de privilégier la méthode `execute()` à `query()` car elle permet de réaliser des requêtes paramétrées qui évitent les risques d'injection SQL. L'utilisation de `execute()` est plus sécurisée, car elle permet de séparer la requête SQL de ses données, évitant ainsi toute injection.

### 2. Validation des données

<u>**Problème**</u>: Il n'y a pas de vérification approfondie des données envoyées par l'utilisateur. \
Par exemple :

- La **quantité en stock** peut être négative, ce qui n'a pas de sens.
- Des **champs vides** ou des valeurs nulles pourraient être insérées dans la base de données sans contrôle.

<u>**Solution**</u>: Il faut ajouter des validations côté serveur pour vérifier que :

- Les champs obligatoires ne sont pas vides.
- Les valeurs sont cohérentes avec les règles métier (ex. : quantités positives, prix unitaire > 0, etc.).

Des contrôles conditionnels peuvent, par exemple, permettre de vérifier que la quantité de stock est positive :

```javascript
if (quantite_stock < 0) {
  return res.status(400).send("La quantité en stock ne peut pas être négative.");
}
```

Ou directement sur le schéma de la table `produits`:

```sql
quantite_stock INT NOT NULL CHECK (quantite_stock >= 0)
```

### 3. Gestion des erreurs

<u>**Problème**</u>: Aucune gestion des erreurs n'est présente dans les requêtes. Si une erreur se produit lors de l'exécution d'une requête SQL, le serveur risque de planter sans message d'erreur approprié.

<u>**Solution**</u>: L'utilisation de `try/catch` pour gérer les erreurs est essentielle. Par exemple :

```javascript
try {
  const [rows] = await connection.execute("SELECT * FROM categories");
  res.json(rows);
} catch (err) {
  console.error(err);
  res.status(500).send("Erreur du serveur.");
}
```

### 4. Connexion à la base de données

<u>**Problème**</u>: La connexion à la base de données est établie à chaque requête et la fermeture de la connexion n'est jamais réalisée. Cela pourrait entraîner une fuite de ressources si les connexions ne sont pas fermées après chaque requête.

<u>**Solution**</u>: Il est important de fermer la connexion après chaque requête pour libérer les ressources. Par exemple, après chaque requête :

```javascript
await connection.end();
```

### 5. Gestion des transactions

<u>**Problème**</u>: Il n'y a pas de gestion des transactions, ce qui peut entraîner des incohérences dans la base de données. Par exemple, si une commande échoue en cours de traitement, les modifications des tables liées ne sont pas annulées.

<u>**Solution**</u>: Les transactions devraient être utilisées pour garantir l'intégrité des données. Une fois qu'une transaction est commencée, toutes les modifications doivent être validées ou annulées ensemble en cas d'erreur.

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

### 6. Conclusion de l'audit

Les modifications proposées pour la version 2 visent à améliorer la sécurité, la robustesse et la cohérence des données dans l'application. L'intégration de **requêtes paramétrées**, la **validation des données**, le **calcul automatique des totaux**, la **gestion des erreurs** et l'utilisation de **transactions** pour garantir l'intégrité des données sont les principales améliorations.

De plus, la mise à jour automatique des stocks et la gestion des rôles renforceront la logique métier et la sécurité du système.

# Améliorations effectives apportées dans la deuxième version

## 1. Structure et organisations

La réorganisation du projet vise à améliorer la lisibilité et la maintenabilité du code :

```
sdv-bdd
├── src
│   ├── controllers
│   │   ├── categoriesController.js
│   │   ├── clientsController.js
│   │   ├── commandsController.js
│   │   ├── linesController.js
│   │   ├── productsController.js
│   │   ├── statisticsController.js
│   │   └── suppliersController.js
│   ├── routes
│   │   ├── categoriesRoutes.js
│   │   ├── clientsRoutes.js
│   │   ├── commandsRoutes.js
│   │   ├── linesRoutes.js
│   │   ├── productsRoutes.js
│   │   ├── statisticsRoutes.js
│   │   └── suppliersRoutes.js
│   ├── db
│   │   ├── dbConnection.js
│   │   ├── dbInit.js
│   │   ├── db.sql
│   │   ├── users.sql
│   │   └── data.sql
│   ├── utils
│   │   └── getCommands.js
│   ├── app.js
│   └── index.js
├── package.json
└── README.md
```

**Améliorations** :

- **Séparation des responsabilités** : Les fichiers contrôleurs, routes, utilitaires et configurations de la base de données sont désormais clairement distincts.
- **Extensibilité** : Cette structure facilite l'ajout de nouvelles fonctionnalités et modules à l'avenir.

## 2. Améliorations de la base de données

Des modifications ont été apportées à la base de données pour renforcer l'intégrité et l'efficacité des données.

### 2.1 Performance et indexation

Dans la première version de la base de donnée, les index ne sont pas explicitement définis dans le fichier db.sql, mais il est essentiel de les ajouter sur les colonnes fréquemment utilisées dans les requêtes (par exemple, `client_id` dans la table `Commandes`, `commande_id` et `produit_id` dans la table `Lignes_Commandes`). Cela permettrait d'améliorer les performances des requêtes complexes.

L’ajout d'index sur les clés étrangères peut améliorer la performance des jointures,
en particulier pour des tables avec de grandes quantités de données.

```SQL
-- Table des produits
CREATE TABLE produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Colonnes de la table produit
    id_categorie INT,
    id_fournisseur INT,
    FOREIGN KEY (id_categorie) REFERENCES Categories(id) ON DELETE SET NULL,
    FOREIGN KEY (id_fournisseur) REFERENCES Fournisseurs(id) ON DELETE SET NULL,
    INDEX (id_categorie), /* Index sur la clé étrangère id_categorie */
    INDEX (id_fournisseur) /* Index sur la clé étrangère id_fournisseur */
);
```

### 2.2 Validation des Données

Des contrôles ont été ajoutés sur certaines colonnes cruciales pour conserver la cohérence de la base de données.
Par exemple, sur la table `lignes_commande` les `quantite` et `prix_unitaire` ne doivent pas être négatifs. Le `total_ligne` est calculé automatiquement en fonction de ces deux valeurs.

```SQL
-- Table des lignes de commande
CREATE TABLE lignes_commandes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Colonnes de la table produit
    quantite INT NOT NULL CHECK (quantite > 0), /* La quantité ne peut pas être négative */
    prix_unitaire DECIMAL(10, 2) NOT NULL CHECK (prix_unitaire > 0), /* Le prix unitaire ne peut pas être négatif */
    total_ligne DECIMAL(10, 2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED, /* Total de la ligne calculé automatiquement */
    -- Colonnes de la table produit
);
```

### 2.3 Calculs Automatiques

Pour améliorer l'efficacité et réduire les erreurs humaines, la version 2 met en place différents calculs automatiques:

- **Calcul automatique du prix total de la commande** : Le serveur calcule désormais le prix total d'une commande en fonction des lignes de commande fournies.
- **Mise à jour automatique des stocks** : Décrémentation automatique des quantités en stock lors de la validation d'une commande ou de l'insertion d'une ligne de commande.

Pour ces différentes mises à jour automatique, des triggers ont été mis en place.

#### A - Trigger pour mettre à jour le prix total d'une commande.

Après l'insertion d'une commande, le prix total de la commande est calculé automatiquement en fonction de ces lignes commande. Ce trigger s'applique également lors de l'ajout d'une simple ligne de commande:

```SQL
CREATE TRIGGER update_prix_total_commande
AFTER INSERT ON lignes_commandes
FOR EACH ROW
BEGIN
  UPDATE commandes
  SET prix_total = (SELECT SUM(total_ligne) FROM lignes_commandes WHERE id_commande = NEW.id_commande)
  WHERE id = NEW.id_commande;
END;
```

#### B - Trigger pour mettre à jour la quantité en stock d'un produit après une commande.

A chaque nouvelle commande, la `quantite_stock` de chaque produit présent dans la commande est mises à jour automatiquement:

```SQL
CREATE TRIGGER update_quantite_stock_produit
AFTER INSERT ON lignes_commandes
FOR EACH ROW
BEGIN
  UPDATE produits
  SET quantite_stock = quantite_stock - NEW.quantite
  WHERE id = NEW.id_produit;
END;
```

#### C - Trigger pour restaurer la quantité en stock d'un produit après une suppression de ligne de commande.

De la même manière, lors de la suppression d'une commande ou d'une ligne de commande individuelle, les `quantite_stock` sont mise à jour automatiquement:

```SQL
CREATE TRIGGER restore_quantite_stock_produit
AFTER DELETE ON lignes_commandes
FOR EACH ROW
BEGIN
  UPDATE produits
  SET quantite_stock = quantite_stock + OLD.quantite
  WHERE id = OLD.id_produit;
END;
```

## 3. Utilisation de requêtes paramétrées

<div style="text-align: justify;">

Comme mentionné plus haut, il est nécessaire d'utiliser des **requêtes paramétrées** au lieu de concaténer des chaînes de caractères pour éviter l'injection SQL. Cela doit être appliqué à toutes les requêtes SQL dans le code, y compris celles concernant l'ajout, la mise à jour et la suppression des données.

```javascript
// Ajouter le produit
const [row] = await connection.execute(
  "INSERT INTO produits (reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur) VALUES (?, ?, ?, ?, ?, ?, ?)",
  [reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur]
);
```

</div>

## 4. Validation des données

L'intégrité des données est un élément clé pour garantir la fiabilité et la sécurité de l'application. Il est essentiel de **vérifier et valider toutes les données envoyées par l'utilisateur** avant de les insérer dans la base de données.

- Empêcher l'insertion de données incohérentes ou invalides (ex. `quantite_stock` négatif, `prix_unitaire` à zéro, etc.).
- Assurer la cohérence des relations en base de données (ex. s'assurer qu'un `id_client` existe avant d'enregistrer une commande).
- Protéger contre des attaques comme l'injection SQL ou des erreurs applicatives.
- Gestion des valeurs par défaut et des champs obligatoires.

### Validation des valeurs des champs

Certains champs doivent respecter des contraintes logiques, comme une quantité ou un prix qui ne peuvent pas être négatifs.

Exemple de validation pour les produits:

```javascript
// Vérifier si la quantité et le prix unitaire sont supérieurs à 0
if (quantite_stock <= 0) {
  return res.status(400).json({
    error: "La quantité de produit doit être supérieure à 0",
  });
} else if (prix_unitaire <= 0) {
  return res.status(400).json({
    error: "Le prix unitaire de produit doit être supérieur à 0",
  });
}
```

### Vérification des champs obligatoires

Lors des requêtes POST et PUT, il est important de s'assurer que tous les champs requis sont bien présents dans la requête.

```javascript
// Vérifier si les champs obligatoires sont renseignés pour la commande
const requiredFields = ["date_commande", "id_client", "lignes_commandes"];
requiredFields.forEach((field) => {
  if (!req.body[field]) {
    return res.status(400).json({ error: `Le champ '${field}' est requis pour la commande` });
  }
});
```

### Vérification des entités en base de données

Avant d'insérer une donnée, il est primordial de vérifier que les références existent déjà dans la base de données. Par exemple, on ne peut pas passer une commande pour un client qui n'existe pas.

```javascript
// Vérifier si le client existe
const [client] = await connection.execute("SELECT * FROM clients WHERE id = ?", [id_client]);
if (!client.length) {
  return res.status(404).json({ error: "Client non trouvé" });
}
```

### 2.6 Validation de la cohérence des stocks avant une commande

Avant de passer une commande, il faut vérifier que la quantité demandée est disponible en stock.

```javascript
// Vérifier si la quantité de produit est suffisante
if (produit[0].quantite_stock < ligne.quantite) {
  try {
    await connection.rollback();
  } catch (rollbackError) {
    console.error("Erreur lors du rollback: ", rollbackError);
  }
  return res.status(400).json({
    error: `Quantité de produit '${produit[0].reference} - ${produit[0].nom}' insuffisante`,
    message: `Quantité en stock: ${produit[0].quantite_stock}`,
  });
}
```

### 2.7 Gestion des rôles et authentification

<div style="text-align: justify;">

<u>**Problèmes**</u>: L'API ne dispose d'aucun mécanisme de gestion des rôles, ce qui pose un sérieux problème de sécurité. Toute personne ayant accès à l'API pourrait potentiellement exécuter des actions sensibles (ajout, modification ou suppression de données), sans restriction.

</div>

<div style="text-align: justify;">

<u>**Solutions**</u>: Il est recommandé d'implémenter un système de gestion des rôles afin de restreindre l'accès aux fonctionnalités en fonction du profil utilisateur. Voici la configuration des rôles suggérée :

Quatre profils ont été défini (sans compter `root`):

- **ADMIN** : Accès total à toutes les fonctionnalités et tables de la base de données.
- **READONLY** : Accès en lecture seule sur l'ensemble des tables.
- **ORDER** : Accès limité à la gestion des commandes, avec des droits de lecture et écriture uniquement sur les tables `commandes` et `lignes_commandes`.
- **MANAGER** : Accès en lecture et écriture sur l'ensemble des tables, sauf pour la gestion des utilisateurs et des privilèges.

Le script ci-dessous permet de créer les utilisateurs et d'attribuer les privilèges correspondants :

```SQL
CREATE USER IF NOT EXISTS '${ADMIN_USER}'@'localhost' IDENTIFIED BY '${ADMIN_PASSWORD}';
GRANT ALL PRIVILEGES ON avion_papier.* TO '${ADMIN_USER}'@'localhost';

CREATE USER IF NOT EXISTS '${READONLY_USER}'@'localhost' IDENTIFIED BY '${READONLY_PASSWORD}';
GRANT SELECT ON avion_papier.* TO '${READONLY_USER}'@'localhost';

CREATE USER IF NOT EXISTS '${ORDER_USER}'@'localhost' IDENTIFIED BY '${ORDER_PASSWORD}';
GRANT SELECT, INSERT, UPDATE, DELETE ON avion_papier.commandes TO '${ORDER_USER}'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON avion_papier.lignes_commandes TO '${ORDER_USER}'@'localhost';

CREATE USER IF NOT EXISTS '${MANAGER_USER}'@'localhost' IDENTIFIED BY '${MANAGER_PASSWORD}';
GRANT SELECT, INSERT, UPDATE, DELETE ON avion_papier.* TO '${MANAGER_USER}'@'localhost';

FLUSH PRIVILEGES;
```

Pour utiliser un rôle spécifique lors de l'exécution d'une requête API, il suffit d'inclure un en-tête (header) nommé role dans la requête, avec comme valeur l'un des profils définis (`admin`, `readonly`, `order`, `manager`).

#### Exemple d'en-tête HTTP :

```http
role: order
```

## Note & remarques

J’ai rencontré quelques difficultés dans l’attribution des droits pour les utilisateurs **ORDER** et **MANAGER**. Bien que des privilèges spécifiques aient été accordés à ces deux profils, ils ne semblent pas être appliqués correctement, pour des raisons encore inconnues.

### Problème avec le profil **MANAGER**

Le profil **MANAGER** est censé avoir un accès complet en lecture et écriture sur toutes les tables de la base de données `avion_papier`. Cependant, en pratique, il ne semble avoir accès qu’à certaines tables, notamment `commandes`, mais rencontre des erreurs sur d'autres tables, y compris celles en relation avec `commandes` comme `lignes_commandes`.

#### Exemples d’erreurs rencontrées :

```bash
Erreur lors de la récupération des catégories:  Error: SELECT command denied to user 'manager'@'localhost' for table 'categories'
Erreur lors de la récupération des produits:  Error: SELECT command denied to user 'manager'@'localhost' for table 'produits'
Erreur lors de la récupération des fournisseurs:  Error: SELECT command denied to user 'manager'@'localhost' for table 'fournisseurs'
Erreur lors de l'exécution de la requête :  Error: SELECT command denied to user 'manager'@'localhost' for table 'lignes_commandes'
```

#### Solution

Executer directement dans SQL WorkBench:

```SQL
GRANT SELECT, INSERT, UPDATE, DELETE ON avion_papier.commandes TO `order`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON avion_papier.lignes_commandes TO `order`@`localhost`;
FLUSH PRIVILEGES;
```

### Problème avec le profil **ORDER**

Le profil **ORDER** devrait avoir des accès en lecture et écriture **uniquement** sur les tables `commandes` et `lignes_commandes`. Toutefois, l’utilisateur **ORDER** semble ne pas avoir du tout accès à la base de données.

#### Exemples d’erreurs rencontrées :

```bash
Error: Access denied for user 'order'@'localhost' to database 'avion_papier'
```

#### Solution

Executer directement dans SQL WorkBench:

```SQL
GRANT SELECT, INSERT, UPDATE, DELETE ON avion_papier.* TO `manager`@`localhost`;
FLUSH PRIVILEGES;
```

### Contournement temporaire pour les tests

Si le problème persiste malgré ces ajustements, merci d’utiliser les profils **ROOT**, **ADMIN** ou **READONLY** pour effectuer les tests de l’application en local.

- **ROOT** → Accès total à la base de données
- **ADMIN** → Accès complet sur avion_papier
- **READONLY** → Accès en lecture seule sur toutes les tables

Cela permettra d'éviter les blocages liés aux permissions ou, si nécessaire, de revenir à l'avant-dernier commit intitulé **`"Last commit on README.md"`**.
