"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var DB;
(function (DB) {
    const dbName = "dbFarmaciasAPP";
    function getInstance(version) {
        var indexedDB = window.indexedDB;
        let DBInstance;
        if (version)
            DBInstance = indexedDB.open(dbName, version);
        else
            DBInstance = indexedDB.open(dbName);
        return DBInstance;
    }
    function Init(stores) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                let db = getInstance();
                db.onupgradeneeded = function () {
                    stores.forEach(store => {
                        let storeName = store.storeName;
                        let key = store.key;
                        let columns = store.columns;
                        var dbStore = db.result.createObjectStore(storeName, { keyPath: key });
                        columns.forEach(element => {
                            let _unique = false;
                            if (element == key)
                                _unique = true;
                            dbStore.createIndex(element, element, { unique: _unique });
                        });
                    });
                    db.result.close();
                    resolve(true);
                };
                db.onerror = function () {
                    console.log("error");
                    reject(Error("Error on Error;"));
                };
            });
        });
    }
    DB.Init = Init;
    function createObjectStore(storeName, key, columns) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                var db = getInstance();
                db.onupgradeneeded = function () {
                    var dbStore = db.result.createObjectStore(storeName, { keyPath: key });
                    columns.forEach(element => {
                        let _unique = false;
                        if (element == key)
                            _unique = true;
                        dbStore.createIndex(element, element, { unique: _unique });
                    });
                };
                db.onsuccess = function () {
                    if (db.result.objectStoreNames.contains(storeName)) {
                        reject(Error("ObjectStore already exists!"));
                        return;
                    }
                    var version = parseInt(db.result.version.toString()) + 1;
                    var _db = getInstance(version);
                    _db.onupgradeneeded = function () {
                        var dbStore = _db.result.createObjectStore(storeName, { keyPath: key });
                        columns.forEach(element => {
                            let _unique = false;
                            if (element == key)
                                _unique = true;
                            dbStore.createIndex(element, element, { unique: _unique });
                        });
                        db.result.close();
                        resolve(true);
                    };
                };
            });
        });
    }
    DB.createObjectStore = createObjectStore;
    function addRows(storeName, listRows) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        request.onerror = function (e) {
                            reject(Error(e));
                            return;
                        };
                    });
                    db.result.close();
                    resolve(true);
                };
            });
        });
    }
    DB.addRows = addRows;
    function setRows(storeName, listRows) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        }
                        else {
                            let request = store.put(item);
                            request.onerror = function (e) {
                                db.result.close();
                                reject(Error(e));
                                return;
                            };
                        }
                    });
                    db.result.close();
                    resolve(true);
                };
            });
        });
    }
    DB.setRows = setRows;
    function getRowById(storeName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                var db = getInstance();
                db.onsuccess = function (_db) {
                    let store = getIndexStore(db, storeName, true, 'readonly');
                    if (!store) {
                        reject(Error("ObjectStore not Found!"));
                        return;
                    }
                    let request = store.get(id);
                    request.onsuccess = function (val) {
                        if (request.result)
                            resolve(request.result);
                        else
                            reject(Error("No Data found for this ID!"));
                        db.result.close();
                    };
                };
            });
        });
    }
    DB.getRowById = getRowById;
    function getRows(storeName) {
        return __awaiter(this, void 0, void 0, function* () {
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
                            resolve(request.result);
                        else
                            reject(Error("The ObjectStore is empty!"));
                        db.result.close();
                    };
                };
            });
        });
    }
    DB.getRows = getRows;
    function getFilterRows(storeName, filterColumn, value) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    request.openCursor(keyRangeValue, 'nextunique').onsuccess = function (event) {
                        var cursor = event.target.result;
                        resolve(cursor);
                        db.result.close();
                    };
                };
            });
        });
    }
    DB.getFilterRows = getFilterRows;
    function getMaxValue(storeName, filterColumn, value, optionValue) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                let db = getInstance();
                db.onsuccess = function () {
                    let store = getIndexStore(db, storeName, true, 'readonly');
                    if (!store) {
                        reject(Error("ObjectStore not Found!"));
                        return;
                    }
                    var index = store.index(filterColumn);
                    var openCursorRequest = index.openCursor(optionValue, value);
                    var maxRevisionObject = {};
                    openCursorRequest.onsuccess = function (event) {
                        if (event.target.result) {
                            maxRevisionObject = event.target.result.value;
                        }
                        resolve(maxRevisionObject);
                        db.result.close();
                    };
                };
            });
        });
    }
    DB.getMaxValue = getMaxValue;
    function countRows(storeName, filterColumn) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    request.onsuccess = function (event) {
                        resolve(request.result);
                        db.result.close();
                    };
                };
            });
        });
    }
    DB.countRows = countRows;
    function deleteRows(storeName, ids) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    resolve(true);
                    db.result.close();
                };
            });
        });
    }
    DB.deleteRows = deleteRows;
    function deleteObjectStore(storeName) {
        return __awaiter(this, void 0, void 0, function* () {
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
                            resolve(true);
                            db.result.close();
                        };
                    };
                };
            });
        });
    }
    DB.deleteObjectStore = deleteObjectStore;
    function clearObjectStore(storeName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                var db = getInstance();
                db.onsuccess = function () {
                    let store = getIndexStore(db, storeName, true, 'readwrite');
                    if (!store) {
                        reject(Error("ObjectStore not Found!"));
                        return;
                    }
                    store.clear();
                    resolve(true);
                    db.result.close();
                };
            });
        });
    }
    DB.clearObjectStore = clearObjectStore;
    function DBDelete() {
        var _iDB = window.indexedDB;
        var dbRequest = _iDB.deleteDatabase(dbName);
        dbRequest.onsuccess = function () {
            console.log("Database deleted successfully");
        };
        dbRequest.onerror = function () {
            console.log("error,,, create db");
        };
        dbRequest.onblocked = function () {
            console.log("Couldn't delete database due to the operation being blocked");
        };
    }
    DB.DBDelete = DBDelete;
    function getIndexStore(db, storeName, ifContains, optionRead) {
        let store;
        if (db.result.objectStoreNames.contains(storeName) == ifContains) {
            let tx = db.result.transaction(storeName, optionRead);
            store = tx.objectStore(storeName);
        }
        else {
            db.result.close();
        }
        return store;
    }
})(DB = exports.DB || (exports.DB = {}));
