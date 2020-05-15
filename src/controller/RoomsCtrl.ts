//
//
// import Log from "../Util"
// import Cache from "./Cache"
// import {InsightResponse} from "./IInsightFacade";
//
//
// var fs = require("fs");
// var JSZip = require('jszip');
// var http = require('http');
// var parse5 = require('parse5');
//
//
// export default class RoomsCtrl {
//     constructor() {
//         Log.trace('RoomsCtrl:: init()');
//     }
//     processZip(buffer: any, cache: Cache): Promise<InsightResponse> {
//         return new Promise(function (fulfill, reject) {
//             let zip = new JSZip();
//
//             zip.loadAsync(buffer, "string")
//                 .then(function (zip_body: any) {
//                     zip_body.files['index.htm'].async("string")
//                         .then((output: any) => {
//                             let room = new RoomsCtrl();
//
//                             const doc = parse5.parse(output);
//                             const body = room.getElementsByTag(doc, "body")[0];
//
//                             let buildings_data = room.getBuildings(body);
//
//                             let promises: any[] = [];
//
//                             for (let building = 0; building < buildings_data.length; building++) {
//                                 let entry = zip_body.files['campus/discover/buildings-and-classrooms/' + buildings_data[building].rooms_shortname].async("string")
//                                     .then((class_output: any) => {
//
//                                         const class_document = parse5.parse(class_output);
//                                         const class_body = room.getElementsByTag(class_document, "body")[0];
//
//                                         try {
//                                             return room.getBuildingRooms(class_body, buildings_data, building);
//                                         } catch (e) {
//                                             var reject_parameter: InsightResponse = {
//                                                 code: 400,
//                                                 body: {error: "Error parsing data"}
//                                             };
//                                             reject(reject_parameter);
//                                         }
//                                     })
//                                     .catch((err: any) => {
//                                         var reject_parameter: InsightResponse = {
//                                             code: 400,
//                                             body: {error: "Individuals room files not found in this dataset"}
//                                         };
//                                         reject(reject_parameter);
//
//                                     });
//                                 promises.push(entry);
//                             }
//
//                             Promise.all(promises)
//                                 .then(function (values: any) {
//                                     let parameters : InsightResponse = {code: 204, body: {}};
//                                     let rooms: any[] = [];
//                                     for (let building of values) {
//                                         if (Array.isArray(building)) {
//                                             for (let room of building) {
//                                                 rooms.push(room);
//                                             }
//                                         }
//
//                                     }
//
//                                     if (cache.cacheContains("rooms")) {
//                                         cache.updateCache("rooms", JSON.stringify(rooms));
//                                         parameters.code = 201;
//                                     } else {
//                                         cache.addToCache("rooms", JSON.stringify(rooms));
//                                     }
//
//                                     fs.writeFile("./test/rooms.json", JSON.stringify(rooms), (err: any) => {
//                                         if (err) {
//
//                                         } else {
//                                             console.log('Room dataset is written to disk');
//
//                                         }
//                                     });
//                                     fulfill(parameters);
//                                 }).catch(function (error: any) {
//                                 var reject_parameters: InsightResponse = {
//                                     code: 400,
//                                     body: {error: 'Room dataset could not be parsed'}
//                                 };
//                                 reject(reject_parameters)
//                             })
//                         }).catch(function (err: any) {
//                         var reject_parameters: InsightResponse = {code: 400, body: {error: 'index.html not found'}};
//                         reject(reject_parameters)
//                     });
//                 }).catch(function (error: any) {
//                     var reject_parameters: InsightResponse = {code: 400, body: {error: 'Invalid zip files'}};
//                     reject(reject_parameters)
//                     })
//         });
//
//     }
//
//     getBuildingRooms(body: any, data: any, building: any): Promise<any> {
//         let address = encodeURI(data[building].rooms_address);
//         let call_request = 'http://skaha.cs.ubc.ca:11316/api/v1/team93/' + address;
//
//         let res = this.getLocation(call_request)
//             .then((value: any) =>{
//                 let room_data: any[] = [];
//
//                 try {
//                     let room_number = this.getElementsByClass(body, "views-field views-field-field-room-number");
//                     let room_capacity = this.getElementsByClass(body,"views-field views-field-field-room-capacity" );
//                     let room_type = this.getElementsByClass(body,"views-field views-field-field-room-type" );
//                     let room_furniture = this.getElementsByClass(body,"views-field views-field-field-room-furniture" );
//
//                     if (room_capacity.length >= 1){
//                         for (let cap = 1; cap < room_capacity.length; cap ++){
//                             room_data.push({
//                                 "rooms_fullname": data[building].rooms_fullname,
//                                 "rooms_shortname": data[building].rooms_shortname,
//                                 "rooms_number": room_number[cap].childNodes[1].childNodes[0].value.trim(),
//                                 "rooms_name": data[building].rooms_shortname + "_" + room_number[cap].childNodes[1].childNodes[0].value.trim(),
//                                 "rooms_address": data[building].rooms_address,
//                                 "rooms_lat": value.lat,
//                                 "rooms_lon": value.lon,
//                                 "rooms_seats": Number(room_capacity[cap].childNodes[0].value.trim()),
//                                 "rooms_type": room_type[cap].childNodes[0].value.trim(),
//                                 "rooms_furniture": room_furniture[cap].childNodes[0].value.trim(),
//                                 "rooms_href": room_number[cap].childNodes[1].attrs[0].value.trim()
//                             });
//                         }
//                         return room_data;
//                     }
//                 } catch (e){
//                     console.log('hello! made it here')
//
//                 }
//             }).catch ((err:any)=> {
//                 throw('get Building Rooms: Error parsing data')
//             });
//         return res;
//
//     }
//
//     getLocation(uri: string): Promise<any>{
//         return new Promise(function (fulfill, reject){
//             http.get(uri, function(res:any){
//                 var body = '';
//                 res.on('data', function(data:any){
//                     body += data;
//                 });
//
//                 res.on('end', function(){
//                     var parsed_body = JSON.parse(body);
//                     fulfill(parsed_body);
//                 });
//             }).on('error', function(e:any){
//                 console.log('Error: ' + e.message);
//                 throw('Error: Could not retrieve location');
//             });
//         });
//
//     }
//
//     getBuildings(body: any): any[]{
//         let building_code = this.getElementsByClass(body, "views-field views-field-field-building-code");
//         let building_title = this.getElementsByClass(body,"views-field views-field-title");
//         let building_address = this.getElementsByClass(body, "views-field views-field-field-building-address");
//
//         let data: any[] = [];
//
//         for (let i = 1; i < building_code.length; i++){
//             data.push({
//                 "rooms_fullname": building_title[i].childNodes[1].childNodes[0].value.trim(),
//                 "rooms_shortname": building_code[i].childNodes[0].value.trim(),
//                 "rooms_address": building_address[i].childNodes[0].value.trim()
//             });
//         }
//         return data
//
//     }
//
//     getElementsByTag(tree: any, name: any): any{
//         let res : any[] = [];
//         function traverse(tree: any){
//             for (let node of tree.childNodes){
//                 if (node.tagName == name){
//                     res.push(node);
//                 } else if (node.childNodes){
//                     traverse(node);
//                 }
//             }
//         }
//         traverse(tree);
//         return res;
//
//     }
//
//     getElementsByClass(tree: any, class_name: any) : any{
//         let res : any[] = [];
//
//         function iterate_attributes(node: any): any{
//             for (let attribute of node.attrs){
//                 if (attribute.name == "class"){
//                     return attribute.value;
//                 }
//             }
//         }
//         function traverse(tree: any) {
//             for (let node of tree.childNodes) {
//                 if (node.attrs && iterate_attributes(node) == class_name){
//                     res.push(node)
//                     } else if (node.childNodes){
//                         traverse(node)
//                 }
//             }
//         }
//         traverse(tree);
//         return res;
//
//     }
//
//
//
// }


import Log from "../Util"
import Cache from "./Cache"
import {InsightResponse} from "./IInsightFacade";


var fs = require("fs");
var JSZip = require('jszip');
var http = require('http');
var parse5 = require('parse5');


export default class RoomsCtrl {
    constructor() {
        Log.trace('RoomsCtrl:: init()');
    }
    processZip(buffer: any, cache: Cache): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            let zip = new JSZip();

            zip.loadAsync(buffer, "string")
                .then(function (zip_body: any) {
                    zip_body.files['index.htm'].async("string")
                        .then((output: any) => {
                            let room = new RoomsCtrl();

                            const doc = parse5.parse(output);
                            const body = room.getElementsByTag(doc, "body")[0];

                            let buildings_data = room.getBuildings(body);

                            let promises: any[] = [];

                            for (let building = 0; building < buildings_data.length; building++) {
                                let entry = zip_body.files['campus/discover/buildings-and-classrooms/' + buildings_data[building].rooms_shortname].async("string")
                                    .then((class_output: any) => {

                                        const class_document = parse5.parse(class_output);
                                        const class_body = room.getElementsByTag(class_document, "body")[0];

                                        try {
                                            return room.getBuildingRooms(class_body, buildings_data, building);
                                        } catch (e) {
                                            var reject_parameter: InsightResponse = {
                                                code: 400,
                                                body: {error: "Error parsing data"}
                                            };
                                            reject(reject_parameter);
                                        }
                                    })
                                    .catch((err: any) => {
                                        var reject_parameter: InsightResponse = {
                                            code: 400,
                                            body: {error: "Individuals room files not found in this dataset"}
                                        };
                                        reject(reject_parameter);

                                    });
                                promises.push(entry);
                            }

                            Promise.all(promises)
                                .then(function (values: any) {
                                    let parameters : InsightResponse = {code: 204, body: {}};
                                    let rooms: any[] = [];
                                    for (let building of values) {
                                        if (Array.isArray(building)) {
                                            for (let room of building) {
                                                rooms.push(room);
                                            }
                                        }

                                    }

                                    if (cache.cacheContains("rooms")) {
                                        cache.updateCache("rooms", JSON.stringify(rooms));
                                        parameters.code = 201;
                                    } else {
                                        cache.addToCache("rooms", JSON.stringify(rooms));
                                    }

                                    fs.writeFile("./test/rooms.json", JSON.stringify(rooms), (err: any) => {
                                        if (err) {

                                        } else {
                                            console.log('Room dataset is written to disk');

                                        }
                                    });
                                    fulfill(parameters);
                                }).catch(function (error: any) {
                                var reject_parameters: InsightResponse = {
                                    code: 400,
                                    body: {error: 'Room dataset could not be parsed'}
                                };
                                reject(reject_parameters)
                            })
                        }).catch(function (err: any) {
                        var reject_parameters: InsightResponse = {code: 400, body: {error: 'index.html not found'}};
                        reject(reject_parameters)
                    });
                }).catch(function (error: any) {
                var reject_parameters: InsightResponse = {code: 400, body: {error: 'Invalid zip files'}};
                reject(reject_parameters)
            })
        });

    }

    getBuildingRooms(body: any, data: any, building: any): Promise<any> {
        let address = encodeURI(data[building].rooms_address);
        let call_request = 'http://skaha.cs.ubc.ca:11316/api/v1/team93/' + address;

        let res = this.getLocation(call_request)
            .then((value: any) =>{
                let room_data: any[] = [];

                try {
                    let room_number = this.getElementsByClass(body, "views-field views-field-field-room-number");
                    let room_capacity = this.getElementsByClass(body,"views-field views-field-field-room-capacity" );
                    let room_type = this.getElementsByClass(body,"views-field views-field-field-room-type" );
                    let room_furniture = this.getElementsByClass(body,"views-field views-field-field-room-furniture" );

                    if (room_capacity.length >= 1){
                        for (let cap = 1; cap < room_capacity.length; cap ++){
                            room_data.push({
                                "rooms_fullname": data[building].rooms_fullname,
                                "rooms_shortname": data[building].rooms_shortname,
                                "rooms_number": room_number[cap].childNodes[1].childNodes[0].value.trim(),
                                "rooms_name": data[building].rooms_shortname + "_" + room_number[cap].childNodes[1].childNodes[0].value.trim(),
                                "rooms_address": data[building].rooms_address,
                                "rooms_lat": value.lat,
                                "rooms_lon": value.lon,
                                "rooms_seats": Number(room_capacity[cap].childNodes[0].value.trim()),
                                "rooms_type": room_type[cap].childNodes[0].value.trim(),
                                "rooms_furniture": room_furniture[cap].childNodes[0].value.trim(),
                                "rooms_href": room_number[cap].childNodes[1].attrs[0].value.trim()
                            });
                        }
                        return room_data;
                    }
                } catch (e){

                }
            }).catch ((err:any)=> {
                throw('get Building Rooms: Error parsing data')
            });
        return res;

    }

    getLocation(uri: string): Promise<any>{
        return new Promise(function (fulfill, reject){
            http.get(uri, function(res:any){
                var body = '';
                res.on('data', function(data:any){
                    body += data;
                });

                res.on('end', function(){
                    var parsed_body = JSON.parse(body);
                    fulfill(parsed_body);
                });
            }).on('error', function(e:any){
                console.log('Error: ' + e.message);
                throw('Error: Could not retrieve location');
            });
        });

    }

    getBuildings(body: any): any[]{
        let building_code = this.getElementsByClass(body, "views-field views-field-field-building-code");
        let building_title = this.getElementsByClass(body,"views-field views-field-title");
        let building_address = this.getElementsByClass(body, "views-field views-field-field-building-address");

        let data: any[] = [];

        for (let i = 1; i < building_code.length; i++){
            data.push({
                "rooms_fullname": building_title[i].childNodes[1].childNodes[0].value.trim(),
                "rooms_shortname": building_code[i].childNodes[0].value.trim(),
                "rooms_address": building_address[i].childNodes[0].value.trim()
            });
        }
        return data

    }

    getElementsByTag(tree: any, name: any): any{
        let res : any[] = [];
        function traverse(tree: any){
            for (let node of tree.childNodes){
                if (node.tagName == name){
                    res.push(node);
                } else if (node.childNodes){
                    traverse(node);
                }
            }
        }
        traverse(tree);
        return res;

    }

    getElementsByClass(tree: any, class_name: any) : any{
        let res : any[] = [];

        function iterate_attributes(node: any): any{
            for (let attribute of node.attrs){
                if (attribute.name == "class"){
                    return attribute.value;
                }
            }
        }
        function traverse(tree: any) {
            for (let node of tree.childNodes) {
                if (node.attrs && iterate_attributes(node) == class_name){
                    res.push(node)
                } else if (node.childNodes){
                    traverse(node)
                }
            }
        }
        traverse(tree);
        return res;

    }



}
