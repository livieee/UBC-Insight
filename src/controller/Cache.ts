import Log from '../Util'

/*
 * This class will work as our caching back end.
 */
export default class Cache{

    cacheStore : any[];

    constructor(){
        Log.trace('Cache::init()')
        this.cacheStore = [];
    }

    // add to cache

    addToCache(id: string, content: string){
        this.cacheStore.push({
            // this adds an id before the content.
            [`${id}`] : content
        });
    }

// <<<<<<< HEAD
//         // deletes based on id
//         deleteFromCache(id: string){
//             for (let entry in this.cacheStore){
//                 if (Object.keys(this.cacheStore[entry])[0] == id){
//                     delete this.cacheStore.splice(Number(entry),1)
//                 }
// =======
    // deletes based on id
    deleteFromCache(id: string){
        for (let entry in this.cacheStore){
            if (Object.keys(this.cacheStore[entry])[0] == id){
                delete this.cacheStore.splice(Number(entry),1)
            }
        }
    }

// <<<<<<< HEAD
//         // checks the id's to see if content is there
//         cacheContains(id: string): boolean {
//             for (let entry in this.cacheStore){
//                 if (Object.keys(this.cacheStore[entry])[0] == id){
//                     return true;
//                 }
// =======
    // checks the id's to see if content is there
    cacheContains(id: string): boolean {
        for (let entry in this.cacheStore){
            if (Object.keys(this.cacheStore[entry])[0] == id){
                return true;
            }
        }
        return false;
    }

    // updates the content of cache
    updateCache(id: string, content: string) {
        for (let entry in this.cacheStore) {
            if (Object.keys(this.cacheStore[entry])[0] == id) {
                this.cacheStore[entry][id] = content;
            }
        }
    }

// <<<<<<< HEAD
//         getFromCache(id: string): any{
//             if (!this.cacheContains(id)){
//                 throw('424 Key was not PUT');
//             }
//             for (let entry in this.cacheStore){
//                 if (Object.keys(this.cacheStore[entry])[0] == id){
//                     return this.cacheStore[entry][id];
//                 }
//             }
// =======
//     }
// >>>>>>> olivia-branch

    getFromCache(id: string): any{
        if (!this.cacheContains(id)){
            throw('424 Key was not PUT');
        }
        for (let entry in this.cacheStore){
            if (Object.keys(this.cacheStore[entry])[0] == id){
                return this.cacheStore[entry][id];
            }
        }

    }


}