-- @param {String} $1:matchExternalId
SELECT
  p.id as "playerId",
  p.name,
  CAST(SUM(CASE WHEN k.killer_id = p.id AND p.name != '<WORLD>' THEN 1 ELSE 0 END) AS INT) AS frags,
  CAST(SUM(CASE WHEN k.victim_id = p.id THEN 1 ELSE 0 END) AS INT) AS deaths
FROM
  players AS p
INNER JOIN
  kills AS k ON k.match_external_id = :matchExternalId AND (k.killer_id = p.id OR k.victim_id = p.id)
WHERE
  p.name != '<WORLD>'
GROUP BY
  p.id, p.name
ORDER BY
  frags DESC, deaths ASC;
