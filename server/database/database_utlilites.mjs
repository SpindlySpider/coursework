import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function initilize() {
  const db = await open({
    filename: `${import.meta.dirname}/database.sqlite`,
    driver: sqlite3.Database,
    verbose: true,
  });
  await db.migrate({
    migrationsPath: `${import.meta.dirname}/migrations`,
  });
  return db;
  // this must be called first
}
export const databaseConnect = initilize();

export async function uniqueID(tableName, idName, UUID) {
  // only use this server side
  // checks if an ID is unique
  const db = await databaseConnect;
  const selectStatement = `SELECT * FROM ${tableName} WHERE ${idName} = "${UUID}" `;
  return db.all(selectStatement).length === 0;
  // return db.all('SELECT * FROM ? WHERE ? = ? ', tableName, idName, `"${UUID}"`);
}
