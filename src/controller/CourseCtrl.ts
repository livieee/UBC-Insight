
import Log from "../Util"
import Cache from "./Cache"
import {InsightResponse} from "./IInsightFacade";
import FinishedRequest = ChaiHttp.FinishedRequest;

var fs = require("fs");
var JSZip = require('jszip');
// this will be the class that is used for a Courses Data set.

export default class CourseCtrl {

    constructor() {
        Log.trace('CourseCtrl::init()')
    }

    getYear(sec: any): Number {
        if (sec['Section'] == "overall") {
            return 1900;
        } else {
            return Number(sec['Year'])
        }
    }

    // Takes raw data and returns a clean version of the data that corresponds to the requirements
    // of the application
    cleanData(data: any): any {
        let dataSet = new Set(); // using sets to remove possible duplicates
        // iterate through each course
        for (let course of data) {
            if (course.result.length > 0) {
                for (let sec of course.result) {
                    // looks at each section of the course
                    dataSet.add({
                        "courses_dept": sec['Subject'],
                        "courses_id": sec['Course'],
                        "courses_avg": sec['Avg'],
                        "courses_instructor": sec['Professor'],
                        "courses_title": sec['Title'],
                        "courses_pass": sec['Pass'],
                        "courses_fail": sec['Fail'],
                        "courses_audit": sec['Audit'],
                        "courses_uuid": String(sec['id']),
                        "courses_year": this.getYear(sec),
                        "courses_size": sec['Fail'] + sec['Pass']
                    });
                }
            }
        }
        return Array.from(dataSet);
    }

    // processes a zip file and returns an array of promises that contains the
    // content of the zipfile
    processZip(id: string, buff: any, cache: Cache): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            let zip = new JSZip(); // zip object
            var params: InsightResponse = {code: 204, body: {}}; // the structure of an Insight response

            zip.loadAsync(buff, "string")
                .then(function (body: any) {

                    // array of promises
                    let promises: any[] = [];
                    for (let file in body.files) {
                        // skip the file that refers to a folder
                        if (file == id + '/') {
                            continue;
                        }
                        let entry = body.files[file].async("string")
                            .then((output: any) => {
                                return JSON.parse(output);
                            })
                            .catch(function (err: any) {
                                var reject_params: InsightResponse = {code: 400, body: {error: "JSON parse error"}};
                                reject(reject_params);
                            });
                        promises.push(entry);
                    }

                    // process the promises
                    Promise.all(promises)
                        .then(function (vals: any) {
                            try {
                                let temp = new CourseCtrl();
                                temp = temp.cleanData(vals);
                                let jsonString = JSON.stringify(temp);
                                if (!cache.cacheContains(id)) {
                                    cache.addToCache(id, jsonString) // adds to cache if the id doesn't exist
                                } else {
                                    cache.updateCache(id, jsonString);
                                    params.code = 201;
                                }

                                // write the in the JSON in the test folder
                                fs.writeFile("./test/" + id + ".json", jsonString, (err: any) => {
                                    if (err) {

                                    } else {
                                        console.log("New file has been created")
                                    }
                                });
                            } catch (err) {
                                let reject_params: InsightResponse = {code: 400, body: {"error": err.message}};
                                reject(reject_params);
                            }
                            ;
                            if (params.code != 400) {
                                fulfill(params);
                                return;
                            }
                        })
                })
                .catch(function (err: any) {
                    let reject_parameters: InsightResponse = {code: 400, body: {"error": "Not a valid zip file"}};
                    reject(reject_parameters);
                });
        });

    }
}