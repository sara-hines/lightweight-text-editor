import { openDB } from 'idb';

const initdb = async () =>
    // Create a new database named 'jate' which will use version 1 of the database.
    openDB('jate', 1, {
        upgrade(db) {
            // Add our database schema if needed.
            if (db.objectStoreNames.contains('jate')) {
                console.log('jate database already exists');
                return;
            }
            // Create a new object store for the data and give it an autoincrementing key called 'id'.
            db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
            console.log('jate database created');
        },
    });

// Method that accepts some content and adds it to the database
export const putDb = async (content) => {
    console.log('Request received to PUT to the database.');
    const jateDb = await openDB('jate', 1);
    const tx = jateDb.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    const request = store.put({ id: 1, value: content })
    const result = await request;
    if (result) {
        return result;
    } else {
        console.error('Sorry, there was an error when attempting to add content to the database.');
    }
};

// Method that gets all the content from the database
export const getDb = async () => {
    console.log('Request receive to GET all from the database.');
    const jateDb = await openDB('jate', 1);
    const tx = jateDb.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    const request = store.getAll();
    const result = await request;
    if (result) {
        return result?.value;
    } else {
        console.error('Sorry, there was an error when attempting to GET all from the database.');
    }
};

initdb();
