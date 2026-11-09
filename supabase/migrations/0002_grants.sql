-- Correctif : droits explicites pour la clé service_role (à exécuter si 0001 a déjà été lancé).
grant select, insert, update on table leads to service_role;
grant usage, select on sequence lead_message_seq, lead_devis_seq to service_role;
