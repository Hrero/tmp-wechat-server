import localForage from 'localforage';

export default {
    getItem (key) {
        return new Promise((resolve, reject) => {
            localForage.getItem(key).then((value) => {
                resolve(value)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    setItem (key, value) {
        return new Promise((resolve, reject) => {
            localForage.setItem(key, value).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    removeItem (key) {
        return new Promise((resolve, reject) => {
            localForage.removeItem(key).then(() => {
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    },
    clear () {
        return new Promise((resolve, reject) => {
            localForage.clear().then(() => {
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    },
    length () {
        return new Promise((resolve, reject) => {
            localForage.length().then((numberOfKeys) => {
                resolve(numberOfKeys)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    key (keyIndex) {
        return new Promise((resolve, reject) => {
            localForage.key(keyIndex).then((keyName) => {
                resolve(keyName)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    keys () {
        return new Promise((resolve, reject) =>{
            localForage.keys().then((keys) => {
                resolve(keys)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}
