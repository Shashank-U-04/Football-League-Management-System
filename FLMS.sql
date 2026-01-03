-- ============================================================
-- ⚽ FOOTBALL LEAGUE MANAGEMENT SYSTEM
-- DBMS Mini Project
-- ============================================================

-- ============================================================
-- 1️⃣ DATABASE CREATION
-- ============================================================
DROP DATABASE IF EXISTS FootballLeagueDB;
CREATE DATABASE FootballLeagueDB;
USE FootballLeagueDB;

-- ============================================================
-- 2️⃣ TABLE CREATION (DDL)
-- ============================================================

-- Table: TOURNAMENT
CREATE TABLE Tournament (
    tournament_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('League', 'Knockout') NOT NULL,
    host_country VARCHAR(100) NOT NULL,
    no_of_teams INT CHECK (no_of_teams > 0),
    no_of_matches INT CHECK (no_of_matches >= 0),
    start_date DATE,
    end_date DATE
);

-- Table: TEAM
CREATE TABLE Team (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    coach_name VARCHAR(100),
    foundation_year YEAR,
    tournament_id INT,
    FOREIGN KEY (tournament_id) REFERENCES Tournament(tournament_id)
        ON DELETE CASCADE
);

-- Table: PLAYER
CREATE TABLE Player (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age > 0),
    gender ENUM('M', 'F'),
    position VARCHAR(50),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    jersey_number INT,
    team_id INT,
    FOREIGN KEY (team_id) REFERENCES Team(team_id)
        ON DELETE CASCADE
);

-- Table: MATCHES
CREATE TABLE Matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT,
    team1_id INT,
    team2_id INT,
    match_date DATE,
    venue VARCHAR(100),
    status ENUM('Scheduled', 'Completed'),
    FOREIGN KEY (tournament_id) REFERENCES Tournament(tournament_id)
        ON DELETE CASCADE,
    FOREIGN KEY (team1_id) REFERENCES Team(team_id)
        ON DELETE CASCADE,
    FOREIGN KEY (team2_id) REFERENCES Team(team_id)
        ON DELETE CASCADE
);

-- Table: SCORE
CREATE TABLE Score (
    score_id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT,
    team_id INT,
    goals_scored INT CHECK (goals_scored >= 0),
    points INT CHECK (points >= 0),
    result_type ENUM('Win', 'Loss', 'Draw'),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id)
        ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES Team(team_id)
        ON DELETE CASCADE
);

-- ============================================================
-- 3️⃣ VIEW CREATION
-- ============================================================

CREATE VIEW Leaderboard AS
SELECT 
    t.team_id,
    t.team_name,
    COUNT(DISTINCT s.match_id) AS matches_played,
    SUM(CASE WHEN s.points = 3 THEN 1 ELSE 0 END) AS wins,
    SUM(CASE WHEN s.points = 1 THEN 1 ELSE 0 END) AS draws,
    SUM(CASE WHEN s.points = 0 THEN 1 ELSE 0 END) AS losses,
    SUM(s.goals_scored) AS goals_for,
    SUM(s.points) AS total_points
FROM Team t
JOIN Score s ON t.team_id = s.team_id
GROUP BY t.team_id, t.team_name
ORDER BY total_points DESC, goals_for DESC;

-- ============================================================
-- 4️⃣ DATA INSERTION (DML)
-- ============================================================

-- Insert: TOURNAMENT
INSERT INTO Tournament (name, type, host_country, no_of_teams, no_of_matches, start_date, end_date)
VALUES ('Numinova Football League', 'League', 'India', 4, 6, '2025-10-01', '2025-10-15');

-- Insert: TEAM
INSERT INTO Team (team_name, coach_name, foundation_year, tournament_id)
VALUES 
('Titans FC', 'Arjun Mehta', 1998, 1),
('Galaxy United', 'Ravi Kumar', 2002, 1),
('Lions SC', 'Rohan Patel', 2005, 1),
('Panthers FC', 'Sameer Khan', 2010, 1);

-- Insert: PLAYER
INSERT INTO Player (name, age, gender, position, height_cm, weight_kg, jersey_number, team_id) VALUES
('Rahul Singh', 24, 'M', 'Forward', 178.5, 72.3, 9, 1),
('Vikram Desai', 27, 'M', 'Midfielder', 175.2, 70.8, 8, 1),
('Arjun Nair', 25, 'M', 'Goalkeeper', 185.0, 78.0, 1, 2),
('Ravi Menon', 23, 'M', 'Defender', 180.0, 76.5, 4, 2),
('Kunal Joshi', 28, 'M', 'Forward', 177.0, 71.0, 10, 3),
('Amit Rao', 26, 'M', 'Midfielder', 172.5, 68.4, 6, 4);

-- Insert: MATCHES
INSERT INTO Matches (tournament_id, team1_id, team2_id, match_date, venue, status)
VALUES
(1, 1, 2, '2025-10-02', 'Mumbai Arena', 'Completed'),
(1, 3, 4, '2025-10-03', 'Delhi Stadium', 'Completed'),
(1, 1, 3, '2025-10-05', 'Kolkata Ground', 'Completed'),
(1, 2, 4, '2025-10-06', 'Pune Turf', 'Completed');

-- Insert: SCORE
INSERT INTO Score (match_id, team_id, goals_scored, points, result_type)
VALUES
(1, 1, 2, 3, 'Win'),
(1, 2, 0, 0, 'Loss'),
(2, 3, 1, 1, 'Draw'),
(2, 4, 1, 1, 'Draw'),
(3, 1, 2, 3, 'Win'),
(3, 3, 1, 0, 'Loss'),
(4, 2, 3, 3, 'Win'),
(4, 4, 2, 0, 'Loss');

-- ============================================================
-- 5️⃣ DATABASE OBJECTS (Triggers, Procedures, Functions)
-- ============================================================

DELIMITER $$

-- Trigger: Auto-update Tournament Match Count
CREATE TRIGGER trg_update_match_count
AFTER INSERT ON Matches
FOR EACH ROW
BEGIN
    UPDATE Tournament
    SET no_of_matches = no_of_matches + 1
    WHERE tournament_id = NEW.tournament_id;
END $$

-- Trigger: Prevent Negative Goals or Points
CREATE TRIGGER trg_validate_score
BEFORE INSERT ON Score
FOR EACH ROW
BEGIN
    IF NEW.goals_scored < 0 OR NEW.points < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Goals and Points must be non-negative!';
    END IF;
END $$

-- Procedure: Add Match Result with Transaction
CREATE PROCEDURE AddMatchResult(
    IN p_match_id INT,
    IN p_team1_id INT,
    IN p_team1_goals INT,
    IN p_team2_id INT,
    IN p_team2_goals INT
)
BEGIN
    DECLARE cnt INT DEFAULT 0;
    DECLARE team1_points INT DEFAULT 0;
    DECLARE team2_points INT DEFAULT 0;
    DECLARE team1_result VARCHAR(10);
    DECLARE team2_result VARCHAR(10);

    -- Check if match exists
    SELECT COUNT(*) INTO cnt FROM Matches WHERE match_id = p_match_id;
    IF cnt = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Match ID does not exist in Matches table.';
    END IF;

    -- Determine results
    IF p_team1_goals > p_team2_goals THEN
        SET team1_points = 3; SET team2_points = 0;
        SET team1_result = 'Win'; SET team2_result = 'Loss';
    ELSEIF p_team1_goals < p_team2_goals THEN
        SET team1_points = 0; SET team2_points = 3;
        SET team1_result = 'Loss'; SET team2_result = 'Win';
    ELSE
        SET team1_points = 1; SET team2_points = 1;
        SET team1_result = 'Draw'; SET team2_result = 'Draw';
    END IF;

    START TRANSACTION;
    -- Optional: remove existing scores for this match to avoid duplicates
    DELETE FROM Score WHERE match_id = p_match_id;

    INSERT INTO Score (match_id, team_id, goals_scored, points, result_type)
      VALUES (p_match_id, p_team1_id, p_team1_goals, team1_points, team1_result);

    INSERT INTO Score (match_id, team_id, goals_scored, points, result_type)
      VALUES (p_match_id, p_team2_id, p_team2_goals, team2_points, team2_result);

    UPDATE Matches SET status = 'Completed' WHERE match_id = p_match_id;

    COMMIT;
END $$

-- Procedure: Team Performance Summary
CREATE PROCEDURE TeamPerformance(IN p_team_name VARCHAR(100))
BEGIN
    SELECT 
        t.team_name,
        COUNT(s.match_id) AS matches_played,
        SUM(s.goals_scored) AS total_goals,
        SUM(s.points) AS total_points
    FROM Team t
    JOIN Score s ON t.team_id = s.team_id
    WHERE t.team_name = p_team_name
    GROUP BY t.team_name;
END $$

-- Function: Calculate Win Percentage
CREATE FUNCTION GetWinPercentage(p_team_id INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE total_matches INT;
    DECLARE total_wins INT;
    DECLARE win_percentage DECIMAL(5,2);

    SELECT COUNT(DISTINCT match_id)
    INTO total_matches
    FROM Score
    WHERE team_id = p_team_id;

    SELECT COUNT(*)
    INTO total_wins
    FROM Score
    WHERE team_id = p_team_id AND result_type = 'Win';

    IF total_matches = 0 THEN
        SET win_percentage = 0;
    ELSE
        SET win_percentage = (total_wins / total_matches) * 100;
    END IF;

    RETURN win_percentage;
END $$

DELIMITER ;

-- ============================================================
-- 6️⃣ SAMPLE QUERIES (Examples for Evaluation)
-- ============================================================
-- Note: These are commented out to preserve data state during evaluation.
-- Uncomment to test specific functionalities.

/*
-- Show all teams
SELECT team_name, coach_name, foundation_year FROM Team;

-- Show players of 'Titans FC'
SELECT p.name, p.position, t.team_name
FROM Player p
JOIN Team t ON p.team_id = t.team_id
WHERE t.team_name = 'Titans FC';

-- Show Leaderboard
SELECT * FROM Leaderboard;

-- Delete Example (Uncommenting this will remove 'Amit Rao'!)
-- DELETE FROM Player WHERE name = 'Amit Rao';

-- Update Example
-- UPDATE Player SET weight_kg = 73.5 WHERE name = 'Rahul Singh';
*/

-- ============================================================
-- END OF SCRIPT
-- ============================================================
