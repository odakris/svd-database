DROP DATABASE IF EXISTS avion_papier;
CREATE DATABASE avion_papier;
USE avion_papier;

-- Table des categories
CREATE TABLE Categories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table des fournisseurs
CREATE TABLE Fournisseurs(
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
CREATE TABLE Produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description_produit TEXT,
    prix_unitaire DECIMAL(10, 2) NOT NULL,
    quantite_stock INT NOT NULL CHECK (quantite_stock >= 0),
    id_categorie INT,
    id_fournisseur INT,
    FOREIGN KEY (id_categorie) REFERENCES Categories(id),
    FOREIGN KEY (id_fournisseur) REFERENCES Fournisseurs(id)
);

-- Table des clients
CREATE TABLE Clients(
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
CREATE TABLE Commandes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_commande DATE NOT NULL,
    prix_total DECIMAL(10, 2) NOT NULL,
    id_client INT,
    FOREIGN KEY (id_client) REFERENCES Clients(id)
);

-- Table des lignes de commande
CREATE TABLE Lignes_Commandes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_produit INT,
    id_commande INT,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10, 2),
    total_ligne DECIMAL(10, 2),
    FOREIGN KEY (id_produit) REFERENCES Produits(id),
    FOREIGN KEY (id_commande) REFERENCES Commandes(id)
);