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
  const selection = await db.all(selectStatement);
  return selection.length === 0;
}

export async function uniqueOrderNumber(playlistID, orderNumber) {
  // only use this server side
  // checks if an order number is already assigned
  const db = await databaseConnect;
  const selectStatement = `SELECT * FROM PlaylistActivityRelation WHERE playlist_id = "${playlistID}" AND orderNumber = ${orderNumber} `;
  const selection = await db.all(selectStatement);
  return selection.length === 0;
}
