DROP DATABASE IF EXISTS avion_papier;
CREATE DATABASE avion_papier;
USE avion_papier;

-- Table des categories
CREATE TABLE categories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table des fournisseurs
CREATE TABLE fournisseurs(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    numero_adresse INT,
    rue_adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(50),
    telephone VARCHAR(20),
    email VARCHAR(100)
);

-- Table des produits
CREATE TABLE produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description_produit TEXT,
    prix_unitaire DECIMAL(10, 2) NOT NULL CHECK (prix_unitaire > 0), /* Le prix unitaire ne peut pas être négatif */
    quantite_stock INT NOT NULL CHECK (quantite_stock >= 0), /* La quantité en stock ne peut pas être négative */
    id_categorie INT,
    id_fournisseur INT,
    FOREIGN KEY (id_categorie) REFERENCES Categories(id) ON DELETE SET NULL, /* Si la catégorie est supprimée, on met à NULL la catégorie du produit */
    FOREIGN KEY (id_fournisseur) REFERENCES Fournisseurs(id) ON DELETE SET NULL, /* Si le fournisseur est supprimé, on met à NULL le fournisseur du produit */
    INDEX (id_categorie), /* Index sur la clé étrangère id_categorie */
    INDEX (id_fournisseur) /* Index sur la clé étrangère id_fournisseur */
);

-- Table des clients
CREATE TABLE clients(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    numero_adresse INT,
    rue_adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(50),
    telephone VARCHAR(20),
    email VARCHAR(100)
);

-- Table des commandes
CREATE TABLE commandes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /* Date de la commande automatique */
    prix_total DECIMAL(10, 2) NOT NULL DEFAULT 0, /* Prix total de la commande */    
    id_client INT,
    FOREIGN KEY (id_client) REFERENCES Clients(id) ON DELETE SET NULL, /* Si le client est supprimé, on met à NULL le client de la commande */
    INDEX (id_client) /* Index sur la clé étrangère id_client */
);

-- Table des lignes de commande
CREATE TABLE lignes_commandes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_produit INT,
    id_commande INT,
    quantite INT NOT NULL CHECK (quantite > 0), /* La quantité ne peut pas être négative */
    prix_unitaire DECIMAL(10, 2) NOT NULL CHECK (prix_unitaire > 0), /* Le prix unitaire ne peut pas être négatif */
    total_ligne DECIMAL(10, 2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED, /* Total de la ligne calculé automatiquement */
    FOREIGN KEY (id_produit) REFERENCES Produits(id),
    FOREIGN KEY (id_commande) REFERENCES Commandes(id),
    INDEX (id_produit), /* Index sur la clé étrangère id_produit */
    INDEX (id_commande) /* Index sur la clé étrangère id_commande */
);


-- TRIGGER pour mettre à jour le prix total d'une commande

CREATE TRIGGER update_prix_total_commande
AFTER INSERT ON lignes_commandes
FOR EACH ROW
BEGIN
    UPDATE commandes
    SET prix_total = (SELECT SUM(total_ligne) FROM lignes_commandes WHERE id_commande = NEW.id_commande)
    WHERE id = NEW.id_commande;
END;



-- TRIGGER pour mettre à jour la quantité en stock d'un produit après une commande

CREATE TRIGGER update_quantite_stock_produit
AFTER INSERT ON lignes_commandes
FOR EACH ROW
BEGIN
    UPDATE produits
    SET quantite_stock = quantite_stock - NEW.quantite
    WHERE id = NEW.id_produit;
END;


-- TRIGGER pour restaurer la quantité en stock d'un produit après une suppression de ligne de commande

CREATE TRIGGER restore_quantite_stock_produit
AFTER DELETE ON lignes_commandes
FOR EACH ROW
BEGIN
    UPDATE produits
    SET quantite_stock = quantite_stock + OLD.quantite
    WHERE id = OLD.id_produit;
END;
