USE avion_papier;

-- Insertion dans la table Categories
INSERT INTO Categories (nom) VALUES
("Maquettes d'avion - Avions militaires"),
("Maquettes d'avion - Avions civils"),
("Maquettes d'avion - Avions de chasse"),
("Accessoires"),
("Outils de montage"),
("Avions historiques"),
("Maquettes d'avion - Helicopteres"),
("Maquettes d'avion - Avions de transport");

-- Insertion dans la table Fournisseurs
INSERT INTO Fournisseurs (nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email) VALUES
("Fournisseur A", 12, "rue des Modeles", "75001", "Paris", "0123456789", "contact@fournisseurA.com"),
("Fournisseur B", 45, "avenue des Maquettes", "69002", "Lyon", "0987654321", "contact@fournisseurB.com"),
("Fournisseur C", 78, "rue des Kits", "33000", "Bordeaux", "0147258369", "contact@fournisseurC.com"),
("Fournisseur D", 65, "rue des Avions", "75015", "Paris", "0102030405", "contact@fournisseurD.com"),
("Fournisseur E", 90, "avenue de l'Industrie", "69003", "Lyon", "0607080910", "contact@fournisseurE.com");

-- Insertion dans la table Produits
INSERT INTO Produits (reference, nom, description, prix_unitaire, quantite_stock, id_categorie, id_fournisseur) VALUES
("A001", "Maquette Avion Militaire F-16", "Maquette avion en papier, echelle 1:72, modele F-16 Fighting Falcon", 15.00, 50, 1, 1),
("A002", "Maquette Avion Civil Airbus A320", "Maquette avion en papier, echelle 1:100, modele Airbus A320", 18.50, 30, 2, 2),
("A003", "Maquette Avion Militaire Spitfire", "Maquette avion en papier, echelle 1:72, modele Spitfire", 17.00, 20, 1, 1),
("A004", "Kit de Construction Maquette Avion", "Kit complet avec outils pour assembler une maquette d'avion", 25.00, 100, 4, 3),
("A005", "Maquette Avion Civil Boeing 747", "Maquette avion en papier, echelle 1:100, modele Boeing 747", 20.00, 60, 2, 2),
("A006", "Maquette Avion Militaire Mirage 2000", "Maquette avion en papier, echelle 1:72, modele Mirage 2000", 19.00, 40, 1, 3),
("A007", "Maquette Avion de Chasse F-35", "Maquette avion en papier, echelle 1:72, modele F-35 Lightning II", 22.00, 15, 3, 1),
("A008", "Maquette Avion Historique Concorde", "Maquette avion en papier, echelle 1:100, modele Concorde", 25.00, 25, 6, 2),
("A009", "Maquette Helicoptere Apache", "Maquette helicoptere en papier, echelle 1:72, modele Apache AH-64", 20.00, 35, 7, 4),
("A010", "Maquette Avion de Transport C-130", "Maquette avion en papier, echelle 1:100, modele Lockheed C-130 Hercules", 23.50, 10, 8, 5),
("A011", "Maquette Avion Civil Boeing 737", "Maquette avion en papier, echelle 1:100, modele Boeing 737", 18.00, 55, 2, 2),
("A012", "Maquette Avion Militaire Eurofighter Typhoon", "Maquette avion en papier, echelle 1:72, modele Eurofighter Typhoon", 21.00, 30, 3, 1);

-- Insertion dans la table Clients
INSERT INTO Clients (nom, prenom, numero_adresse, rue_adresse, code_postal, ville, telephone, email) VALUES
("Durand", "Michel", 12, "rue de la Maquette", "75010", "Paris", "0612345678", "michel.durand@email.com"),
("Lemoine", "Julie", 25, "avenue des Maquettes", "69008", "Lyon", "0623456789", "julie.lemoine@email.com"),
("Martinez", "Carlos", 33, "place des Maquettes", "33000", "Bordeaux", "0634567890", "carlos.martinez@email.com"),
("Tissier", "Claire", 56, "boulevard des Modeles", "75014", "Paris", "0645678901", "claire.tissier@email.com"),
("Robert", "Francois", 78, "rue des Outils", "69012", "Lyon", "0678901234", "francois.robert@email.com"),
("Giraud", "Elise", 32, "place des Avions", "33010", "Bordeaux", "0612340987", "elise.giraud@email.com");

-- Insertion dans la table Commandes
INSERT INTO Commandes (date_commande, prix_total, id_client) VALUES
("2025-01-10", 82.00, 1),  -- Prix total recalculé
("2025-01-12", 45.00, 2),
("2025-01-15", 100.00, 3),
("2025-01-16", 250.00, 4),
("2025-01-20", 200.00, 5),
("2025-01-22", 300.00, 6);

-- Insertion dans la table Lignes_Commandes
INSERT INTO Lignes_Commandes (id_produit, id_commande, quantite, prix_unitaire, total_ligne) VALUES
(1, 1, 3, 15.00, 45.00),    -- Commande 1
(2, 1, 2, 18.50, 37.00),    -- Commande 1
(3, 2, 1, 17.00, 17.00),    -- Commande 2
(4, 2, 1, 25.00, 25.00),    -- Commande 2
(5, 3, 3, 20.00, 60.00),    -- Commande 3
(6, 3, 2, 19.00, 38.00),    -- Commande 3
(7, 4, 2, 22.00, 44.00),    -- Commande 4
(8, 4, 1, 25.00, 25.00),    -- Commande 4
(9, 5, 5, 20.00, 100.00),   -- Commande 5
(10, 5, 2, 23.50, 47.00),   -- Commande 5
(11, 6, 4, 18.00, 72.00),   -- Commande 6
(12, 6, 3, 21.00, 63.00);   -- Commande 6

-- -- Mise à jour du prix_total pour chaque commande en fonction des lignes de commande
-- UPDATE Commandes
-- SET prix_total = (
--     SELECT SUM(total_ligne)
--     FROM Lignes_Commandes
--     WHERE id_commande = Commandes.id
-- );
