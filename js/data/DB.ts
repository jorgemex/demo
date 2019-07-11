
export namespace DB {

    const dbName = "dbFarmaciasAPP";

    function getInstance(version?: number): IDBOpenDBRequest {
        var indexedDB = window.indexedDB;// || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

        let DBInstance: IDBOpenDBRequest;
        if (version)
            DBInstance = indexedDB.open(dbName, version);
        else
            DBInstance = indexedDB.open(dbName);

        return DBInstance;
    }

    //Método para inicializar BD con todos ObjectStore
    export async function Init(stores: Array<any>) {
        return new Promise(function (resolve, reject) {
            let db = getInstance();
            db.onupgradeneeded = function () {

                stores.forEach(store => {
                    let storeName: string = store.storeName;
                    let key: string = store.key;
                    let columns: string[] = store.columns;

                    var dbStore = db.result.createObjectStore(storeName, { keyPath: key });

                    columns.forEach(element => {
                        let _unique: boolean = false;
                        if (element == key)
                            _unique = true;

                        dbStore.createIndex(element, element, { unique: _unique });
                    });
                });

                db.result.close();
                resolve(true);
            };

            // db.onsuccess = function () {
            //     db.result.close();
            // }

            db.onerror = function () {
                console.log("error")
                reject(Error("Error on Error;"))
            }
        });
    }

    export async function createObjectStore(storeName: string, key: string, columns: string[]) {
        return new Promise(function (resolve, reject) {
            var db = getInstance();

            db.onupgradeneeded = function () {
                //VALIDAR si Esto se generaria desde aqui
                var dbStore = db.result.createObjectStore(storeName, { keyPath: key });

                columns.forEach(element => {
                    let _unique: boolean = false;
                    if (element == key)
                        _unique = true;

                    dbStore.createIndex(element, element, { unique: _unique });
                });
            }

            db.onsuccess = function () {

                if (db.result.objectStoreNames.contains(storeName)) {
                    reject(Error("ObjectStore already exists!"));
                    return;
                }

                var version: number = parseInt(db.result.version.toString()) + 1;
                var _db = getInstance(version);

                _db.onupgradeneeded = function () {
                    var dbStore = _db.result.createObjectStore(storeName, { keyPath: key });

                    columns.forEach(element => {
                        let _unique: boolean = false;
                        if (element == key)
                            _unique = true;

                        dbStore.createIndex(element, element, { unique: _unique });
                    });

                    db.result.close();
                    //Successfully!
                    resolve(true);
                }
            }
        });
    }

    export async function addRows(storeName: string, listRows: Array<any>) {
        return new Promise(function (resolve, reject) {

            var db = getInstance();

            db.onsuccess = function (_db) {
                let store = getIndexStore(db, storeName, true, 'readwrite');
                if (!store) {
                    reject(Error("ObjectStore not Found!"));
                    return;
                }

                listRows.forEach(item => {
                    let request = store.add(item);
                    request.onerror = function (e: any) {
                        reject(Error(e));//some error when add data
                        return;
                    }
                });

                //Successfully!
                db.result.close();
                resolve(true);
            };
        });
    }

    export async function setRows(storeName: string, listRows: Array<any>) {
        return new Promise(function (resolve, reject) {

            var db = getInstance();

            db.onsuccess = function (_db) {
                let store = getIndexStore(db, storeName, true, 'readwrite');
                if (!store) {
                    reject(Error("ObjectStore not Found!"));
                    return;
                }

                listRows.forEach(item => {
                    if (!item.EnUso) {
                        store.delete(item[store.keyPath]);
                    } else {
                        let request = store.put(item);
                        request.onerror = function (e: any) {
                            db.result.close();
                            reject(Error(e));//some error when add data
                            return;
                        }
                    }
                });

                db.result.close();
                //Successfully!
                resolve(true);
            };
        });
    }


    export async function getRowById(storeName: string, id: any) {
        return new Promise(function (resolve, reject) {

            var db = getInstance();

            db.onsuccess = function (_db) {
                let store = getIndexStore(db, storeName, true, 'readonly');
                if (!store) {
                    reject(Error("ObjectStore not Found!"));
                    return;
                }

                let request = store.get(id);

                request.onsuccess = function (val: any) {
                    if (request.result)
                        resolve(request.result);
                    else
                        reject(Error("No Data found for this ID!"));

                    db.result.close();
                };
            };
        });
    }

    export async function getRows(storeName: string) {
        return new Promise(function (resolve, reject) {
            var db = getInstance();

            db.onsuccess = function (_db) {
                let store = getIndexStore(db, storeName, true, 'readonly');
                if (!store) {
                    reject(Error("ObjectStore not Found!"));
                    return;
                }

                let request = store.getAll();

                request.onsuccess = function () {
                    if (request.result)
                        resolve(request.result)
                    else
                        reject(Error("The ObjectStore is empty!"));

                    db.result.close();
                };
            };
        });
    }

    export async function getFilterRows(storeName: string, filterColumn: string, value: any) {
        return new Promise(function (resolve, reject) {

            var db = getInstance();

            db.onsuccess = function (_db) {
                let store = getIndexStore(db, storeName, true, 'readonly');
                if (!store) {
                    reject(Error("ObjectStore not Found!"));
                    return;
                }

                let request = store.index(filterColumn);

                var keyRangeValue = IDBKeyRange.only(value);

                request.openCursor(keyRangeValue, 'nextunique').onsuccess = function (event: any) {
                    // request.openCursor().onsuccess = function (event: any) {
                    var cursor = event.target.result;

                    // // Send Cursor in Resolve
                    resolve(cursor);
                    db.result.close();//

                    // if (cursor) {
                    //     console.log(cursor.value);
                    //     cursor.continue();
                    // } else {
                    //     console.log('Entries all displayed.');
                    // }
                };
            };
        });
    }

    export async function getMaxValue(storeName: string, filterColumn: string, value: string, optionValue: string) {
        return new Promise(function (resolve, reject) {

            let db = getInstance();
            db.onsuccess = function () {
                // var result = db.result;
                // var transaction = result.transaction(storeName, 'readonly');
                // var objectStore = transaction.objectStore(storeName);
                let store = getIndexStore(db, storeName, true, 'readonly');
                if (!store) {
                    reject(Error("ObjectStore not Found!"));
                    return;
                }

                var index = store.index(filterColumn);
                var openCursorRequest = index.openCursor(optionValue, value);
                var maxRevisionObject = {};

                openCursorRequest.onsuccess = function (event: any) {
                    if (event.target.result) {
                        maxRevisionObject = event.target.result.value; //the object with max revision   
                    }

                    resolve(maxRevisionObject);
                    db.result.close();
                };
            };
        });
    }

    export async function countRows(storeName:string, filterColumn: string){
        return new Promise(function (resolve, reject) {
            let db = getInstance();
            db.onsuccess = function () {
                let store = getIndexStore(db, storeName, true, 'readonly');
                if (!store) {
                    reject(Error("ObjectStore not Found!"));
                    return;
                }

                var index = store.index(filterColumn);
                var request = index.count();

                request.onsuccess = function (event: any) {
                    resolve(request.result);
                    db.result.close();
                };
            };
        });
    }

    export async function deleteRows(storeName: string, ids: object[]) {
        return new Promise(function (resolve, reject) {

            var db = getInstance();

            db.onsuccess = function (_db) {

                let store = getIndexStore(db, storeName, true, 'readwrite');
                if (!store) {
                    reject(Error("ObjectStore not Found!"));
                    return;
                }

                ids.forEach(key => {
                    store.delete(key);
                });

                //Successfully!
                resolve(true);
                db.result.close();

                // tx.complete();
            }
        });
    }


    export async function deleteObjectStore(storeName: string) {
        return new Promise(function (resolve, reject) {

            var db = getInstance();

            db.onsuccess = function () {
                if (!db.result.objectStoreNames.contains(storeName)) {
                    reject(Error("ObjectStore not Found!"));
                    return;
                }

                var version = parseInt(db.result.version.toString()) + 1;
                var _db = getInstance(version);

                _db.onupgradeneeded = function () {
                    var request = _db.result.deleteObjectStore(storeName);
                    request.onsuccess = function () {
                        console.log("Se ha eliminado el Store!!!");

                        //Successfully!
                        resolve(true);
                        db.result.close();
                    }
                }
            }
        });
    }

    export async function clearObjectStore(storeName: string) {
        return new Promise(function (resolve, reject) {
            var db = getInstance();
            db.onsuccess = function () {
                let store = getIndexStore(db, storeName, true, 'readwrite');
                if (!store) {
                    reject(Error("ObjectStore not Found!"));
                    return;
                }

                store.clear();

                //Successfully!
                resolve(true);
                db.result.close();
            }
        });
    }

    export function DBDelete() {
        var _iDB = window.indexedDB;//|| window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        var dbRequest = _iDB.deleteDatabase(dbName);

        dbRequest.onsuccess = function () {
            console.log("Database deleted successfully");
        }
        dbRequest.onerror = function () {
            console.log("error,,, create db");
        }
        dbRequest.onblocked = function () {
            console.log("Couldn't delete database due to the operation being blocked");
        };
    }


    function getIndexStore(db: IDBOpenDBRequest, storeName: string, ifContains: boolean, optionRead: string): any {
        let store: any;
        if (db.result.objectStoreNames.contains(storeName) == ifContains) {
            let tx = db.result.transaction(storeName, optionRead);
            store = tx.objectStore(storeName);
        } else {
            db.result.close();
        }

        return store;
    }

}