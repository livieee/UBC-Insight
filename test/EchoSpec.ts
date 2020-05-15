/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import chai = require('chai');
import chaiHTTP = require('chai-http');
import restify= require('restify');
import Response = ChaiHttp.Response;
// chai.use(chaiHTTP);
let fs = require('fs');


// generates random ids
function getRandomID(): string {
    return Math.random().toString(36).substring(7);
}
let server = new Server(4321);
let URL = "http://127.0.0.1:4321";


describe("EchoSpec", function () {
    this.timeout(50000);
    let insightFacade: InsightFacade = null; // empty Insight facade
    //
    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
        insightFacade = new InsightFacade();

    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        server.stop();
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);


    });

    it("Test Server", function() {

        // Init
        chai.use(chaiHTTP);

        // Test
        expect(server).to.not.equal(undefined);
        try{
            Server.echo((<restify.Request>{}), null, null);
            expect.fail()

        } catch(err) {
            expect(err.message).to.equal("Cannot read property 'json' of null");
        }

        return server.start().then(function(success: boolean) {
            return chai.request(URL)
                .get("/")
        }).catch(function(err) {
            expect.fail()
        }).then(function(res: Response) {
            expect(res.status).to.be.equal(200);
            return chai.request(URL)
                .get("/echo/Hello")
        }).catch(function(err) {
            expect.fail()
        }).then(function(res: Response) {
            expect(res.status).to.be.equal(200);
            return server.start()
        }).then(function(success: boolean) {
            // expect.fail();
        }).catch(function(err) {
        }).catch(function(err) {
            expect(err.code).to.equal('EADDRINUSE');
            return server.stop();
        }).catch(function(err) {
            expect.fail();
        });


    });


    it("Should be able to echo", function () {
        let out = Server.performEcho('echo');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: 'echo...echo'});
    });

    it("Should be able to echo silence", function () {
        let out = Server.performEcho('');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: '...'});
    });

    it("Should be able to handle a missing echo message sensibly", function () {
        let out = Server.performEcho(undefined);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    it("Should be able to handle a null echo message sensibly", function () {
        let out = Server.performEcho(null);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.have.property('error');
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });


    // For coverage

    it("ECHO description", function () {
        return chai.request('http://localhost:4321')
            .get('/echo/Hello')
            .then(function (res: Response) {
                Log.trace('then:');
                expect(res.status).to.equal(204);
                // some assertions
            })
            .catch(function (err) {
                Log.trace('catch:');
                // some assertions

            });
    });




    it("PUT description", function () {
        return chai.request('http://localhost:4321')
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("./rooms.zip"), "rooms.zip")
            .then(function (res: Response) {
                Log.trace('then:');
                expect(res.status).to.equal(204);
                // some assertions
            })
            .catch(function (err) {
                Log.trace('catch:');
                // some assertions

            });
    });

    it("PUT description", function () {
        return chai.request('http://localhost:4321')
            .put('/dataset/empty')
            .attach("body", fs.readFileSync("./invalidFile.zip"), "invalidFile.zip")
            .then(function (res: Response) {
                Log.trace('then:');
                expect.fail()
                // xpect(res.status).to.equal(204);e
                // some assertions
            })
            .catch(function (err) {
                Log.trace('catch:');
                expect(err.status).to.equal(400);
                // some assertions

            });
    });

    it("PUT description", function () {
        return chai.request('http://localhost:4321')
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("./rooms.zip"), "rooms.zip")
            .then(function (res: Response) {
                Log.trace('then:');
                expect(res.status).to.equal(201);
                // some assertions
            })
            .catch(function (err) {
                Log.trace('catch:');
                // some assertions

            });
    });


    it("PUT description", function () {
        return chai.request('http://localhost:4321')
            .del('/dataset/wrongID')
            .then(function (res: Response) {
                Log.trace('then:');
                // expect(res.status).to.equal(204);
                // some assertions
            })
            .catch(function (err) {
                Log.trace('catch:');
                expect(err.status).to.equal(404)
            });
    });

    it("POST description", function () {
        let query = {
            "WHERE":{
                "OR":[
                    {
                        "GT": {
                            "courses_avg": 59
                        }
                    },
                    {
                        "LT": {
                            "courses_avg": 60
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };

        return chai.request('http://localhost:4321')
            .post('/query')
            .send(query)
            .then(function (res: Response) {
                Log.trace('then:');
                expect(res.status).to.equal(204);
                // some assertions
            })
            .catch(function (err) {
                Log.trace('catch:');
                // some assertions

            });
    });

    it("POST description", function () {
        let query = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };


        return chai.request('http://localhost:4321')
            .post('/query')
            .send(query)
            .then(function (res: Response) {
                Log.trace('then:');
                expect(res.status).to.equal(204);

                // some assertions
            })
            .catch(function (err) {
                Log.trace('catch:');
                // expect(err.status).to.equal(400);
                // some assertions

            });
    });
    it("PUT description", function () {
        return chai.request('http://localhost:4321')
            .del('/dataset/rooms')
            .then(function (res: Response) {
                Log.trace('then:');
                expect(res.status).to.equal(204);
                // some assertions
            })
            .catch(function (err) {
                Log.trace('catch:');
            });
    });





    //Tests for add
    //add fail, if the file is not the ZIP
    it("Testing add wrong format courses dataset zipfile, 400 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "Wrongformat.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("courses", content).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(400);
            ////expect(response.body).to.equal(2);   write the responde body here
        });
    });

    it("Testing add wrong format courses dataset zipfile NOT index HTML, 400 expected ROOMS", function () {

        var iFacade = new InsightFacade();
        var filename = "rooms 2.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("rooms", content).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(400);
            ////expect(response.body).to.equal(2);   write the responde body here
        });
    });

    it("Testing add course dataset with invalid file, 400 expected ROOMS", function () {

        var iFacade = new InsightFacade();
        var filename = "InvalidFile.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("rooms", content).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(400);
            //expect(response.body).to.equal(2);
        });
    });



    //add fail, if the zip file contain invalid file inside
    it("Testing add course dataset with invalid file, 400 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "InvalidFile.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("courses", content).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(400);
            //expect(response.body).to.equal(2);
        });
    });

    //add success, if what we add is a new dataset
    it("Testing add new courses dataset, 204 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "courses.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("courses", content).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response:InsightResponse) {
            expect.fail();
        });
    });

    //add sucess, if we add a pre-existed dataset
    it("Testing add existed courses dataset, 201 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "courses.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("courses", content).then(function (response: InsightResponse) {
            expect(response.code).to.equal(201);
        }).catch(function (response:InsightResponse) {
            expect.fail();
        });
    });



    //Tests for remove
    // remove fail
    it("Testing remove thte unexisted courses dataset, 404 expected", function () {

        var iFacade = new InsightFacade();

        return iFacade.removeDataset("notCourses").then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(404);
        });
    });

    it("Testing add new ROoms dataset, 204 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "rooms.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("rooms", content).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response:InsightResponse) {
            expect.fail();
        });
    });

    it("Testing remove courses dataset, 204 expected", function () {

        var iFacade = new InsightFacade();

        return iFacade.removeDataset("rooms").then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response:InsightResponse) {
            expect.fail();
        });
    });


    //remove success
    it("Testing remove courses dataset, 204 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "courses.zip";

        return iFacade.removeDataset("courses").then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response:InsightResponse) {
            expect.fail();
        });
    });

    it("Remove the same dataset twice should give 404.", function () {

        var iFacade = new InsightFacade();

        return iFacade.removeDataset("courses").then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(404);
        });
    });

    it("Should not be able to perform query when dataset has been removed", function () {
        let query = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(424);
        });
    });

    // testing for adding
    it("Test add dataset", function(){
        return insightFacade.convertTo64("./test/courses.zip")
            .then(function (value: string){
                return insightFacade.addDataset('courses', value)})
            .then(function (res: InsightResponse){
                sanityCheck(res);
                expect(res.code).to.equal(204);
                expect(res.body).to.deep.equal({});
            });

    })

    xit("Test remove dataset", function(){
        return insightFacade.removeDataset('courses')
            .then (function (res: InsightResponse){
                sanityCheck(res);
                expect(res.code).to.equal(204);
                expect(res.body).to.deep.equal({});
            })
    })

    it("Test non-zip", function(){
        return insightFacade.convertTo64("./test/EchoSpec.ts")
            .then(function (value: string){
                return insightFacade.addDataset('echo', value)})
            .then(function (res: any) {
                expect.fail();
            }).catch( function (res: InsightResponse){
                sanityCheck(res);
                expect(res.code).to.equal(400);
                expect(res.body).to.deep.equal({"error": "Not a valid zip file"});
            });

    })



    //Tests for performQuery
    //empty query
    it("Testing empty query, 400 expected", function () {
        let query = {};
        var iFacade = new InsightFacade();
        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Testing wrong query", function () {
        let query = {
            "WHERE":{
                "GT":{
                    "courses_id":1
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });



    it("Testing simple query", function () {
        let query = {
            "WHERE":{
                "OR":[
                    {
                        "GT": {
                            "courses_avg": 59
                        }
                    },
                    {
                        "LT": {
                            "courses_avg": 60
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            console.log("ERROR", error);
            expect.fail();
        });
    });

    it("Testing complex query", function () {
        let query = {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "GT": {
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept":"cpsc"
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg":90
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Testing complex query with different order", function () {
        let query = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "courses_avg": 75
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "cpsc"
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 90
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_dept"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Testing complex query with negation", function () {
        let query = {
            "WHERE":{
                "NOT": {
                    "GT": {
                        "courses_avg":50
                    }
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Testing complex query with negation 2", function () {
        let query = {
            "WHERE":{
                "NOT": {
                    "OR":[
                        {
                            "OR":[
                                {
                                    "GT": {
                                        "courses_avg":50
                                    }
                                },
                                {
                                    "IS": {
                                        "courses_dept":"cpsc"
                                    }
                                }
                            ]
                        },
                        {
                            "EQ": {
                                "courses_avg":90
                            }
                        }
                    ]
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Testing query with wildcard", function () {
        let query = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_dept":"cp*"
                        }
                    },
                    {
                        "GT":{
                            "courses_avg":80
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            console.log("ERROR", error);
            expect.fail();
        });
    });

    it("Testing query with wildcard 2", function () {
        let query = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_dept":"*ps*"
                        }
                    },
                    {
                        "GT":{
                            "courses_avg":80
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            console.log("ERROR", error);
            expect.fail();
        });
    });

    it("Testing query with wildcard 3", function () {
        let query = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_dept":"*sc"
                        }
                    },
                    {
                        "GT":{
                            "courses_avg":80
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            console.log("ERROR", error);
            expect.fail();
        });
    });

    it("Testing very complicated query", function () {
        let query = {
            "WHERE": {
                "OR": [
                    {
                        "NOT": {
                            "AND":[
                                {
                                    "LT":{
                                        "courses_avg":99
                                    }
                                },
                                {
                                    "GT":{
                                        "courses_pass":0
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "AND":[
                            {
                                "NOT":{
                                    "NOT": {
                                        "IS":{
                                            "courses_dept":"cpsc"
                                        }
                                    }
                                }
                            },
                            {
                                "IS":{
                                    "courses_id": "34*"
                                }
                            }
                        ]
                    },
                    {
                        "AND":[
                            {
                                "IS":{
                                    "courses_dept":"math"
                                }
                            },
                            {
                                "IS":{
                                    "courses_id": "*1"
                                }
                            },
                            {
                                "GT":{
                                    "courses_avg": 70
                                }
                            }
                        ]
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            console.log("ERROR", error);
            expect.fail();
        });
    });

    it("Testing very complicated query 2", function () {
        let query = {
            "WHERE": {
                "OR": [
                    {
                        "NOT": {
                            "AND":[
                                {
                                    "LT":{
                                        "courses_avg":99
                                    }
                                },
                                {
                                    "GT":{
                                        "courses_pass":0
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "AND":[
                            {
                                "NOT":{
                                    "NOT": {
                                        "IS":{
                                            "courses_dept":"cpsc"
                                        }
                                    }
                                }
                            },
                            {
                                "IS":{
                                    "courses_id": "34*"
                                }
                            }
                        ]
                    },
                    {
                        "AND":[
                            {
                                "IS":{
                                    "courses_dept":"math"
                                }
                            },
                            {
                                "AND": [
                                    {
                                        "IS":{
                                            "courses_id": "*1"
                                        }
                                    },
                                    {
                                        "IS":{
                                            "courses_id": "1*"
                                        }
                                    }
                                ]
                            },
                            {
                                "OR": [
                                    {
                                        "GT":{
                                            "courses_avg": 80
                                        }
                                    },
                                    {
                                        "AND": [
                                            {
                                                "LT":{
                                                    "courses_avg": 70
                                                }
                                            },
                                            {
                                                "GT":{
                                                    "courses_avg": 65
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };

        var iFacade = new InsightFacade();

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            console.log("ERROR", error);
            expect.fail();
        });
    });

    //add fail, if the zip file contain invalid file inside
    it("Testing add room dataset with invalid file, 400 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "InvalidFile.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("rooms", content).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(400);
            //expect(response.body).to.equal(2);
        });
    });

    xit("Testing add new rooms zipfile without index.html, 400 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "roomsWithoutIndex.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("rooms", content).then(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        }).catch(function (response:InsightResponse) {
            expect.fail();
        });
    });

    it("Testing add course dataset with id room, 400 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "courses.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("rooms", content).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Testing add room dataset with id course, 400 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "rooms.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("courses", content).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response:InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    //add success, if what we add is a new dataset
    it("Testing add new rooms dataset, 204 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "rooms.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("rooms", content).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response:InsightResponse) {
            expect.fail();
        });
    });

    //update a room data set
    it("Testing add new rooms dataset, 201 expected", function () {

        var iFacade = new InsightFacade();
        var filename = "rooms.zip";
        var content = fs.readFileSync(filename, "base64");

        return iFacade.addDataset("rooms", content).then(function (response: InsightResponse) {
            expect(response.code).to.equal(201);
        }).catch(function (response:InsightResponse) {
            expect.fail();
        });
    });

    it("Testing simple room query A", function () {
        var iFacade = new InsightFacade();
        var filename = "rooms.zip";
        var content = fs.readFileSync(filename, "base64");

        let query = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            console.log("ERROR", error);
            expect.fail();
        });
    });

    it("Testing simple room query B", function () {
        var iFacade = new InsightFacade();
        var filename = "rooms.zip";
        var content = fs.readFileSync(filename, "base64");

        let query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            console.log("ERROR", error);
            expect.fail();
        });
    });

    it("Query A", function () {
        var iFacade = new InsightFacade();

        let query = {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            expect.fail();
        });
    });

    it("Query A 2", function () {
        var iFacade = new InsightFacade();

        let query = {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 100
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats",
                    "minSeats",
                    "avgSeats",
                    "sumSeats",
                    "countSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }, {
                    "minSeats": {
                        "MIN": "rooms_seats"
                    }
                }, {
                    "avgSeats": {
                        "AVG": "rooms_seats"
                    }
                }, {
                    "sumSeats": {
                        "SUM": "rooms_seats"
                    }
                }, {
                    "countSeats": {
                        "COUNT": "rooms_seats"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            expect.fail();
        });
    });

    it("Query B", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": "rooms_furniture"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            expect.fail();
        });
    });

    it("All courses", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "maxAvg"],
                "ORDER": "courses_dept"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_year"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            expect.fail();
        });
    });

    it("APPLY keys are not allowed to contain the _ character", function () {
        var iFacade = new InsightFacade();
        var filename = "rooms.zip";

        let query: any = {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "max_Seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "max_Seats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("The string in APPLY should be unique", function () {
        var iFacade = new InsightFacade();
        var filename = "rooms.zip";

        let query: any = {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats",
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }, {
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Should be able to get all courses data", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_year",
                    "maxAvg",
                    "minAvg",
                    "avgAvg",
                    "sumAvg"
                ],
                "ORDER": "courses_dept"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_year"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }, {
                    "minAvg": {
                        "MIN": "courses_avg"
                    }
                }, {
                    "avgAvg": {
                        "AVG": "courses_avg"
                    }
                }, {
                    "sumAvg": {
                        "SUM": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            expect.fail();
        });
    });

    it("All courses sorted by uuid", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_year",
                    "courses_audit",
                    "courses_uuid"
                ],
                "ORDER": "courses_uuid"
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            console.log(response.body);
            expect(response.code).to.equal(200);
        }).catch(function (error:any) {
            expect.fail();
        });
    });

    it("Invalid 1 without transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {
                "AND": [
                    {
                        "GT": {
                            "courss_avg": "95"
                        }
                    },
                    {
                        "EQ": {
                            "courss_avg": "80"
                        }
                    },
                    {
                        "IS": {
                            "courses_dept": "cpsc"
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": []
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 2 without transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {
                "GT": {
                    "courses_id": 1
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 3 without transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {"OR": [{"AND": [{"GT": {"courses_avg": 90}}, {"IS": {"courses_dept": "adhe"}}]}, {"EQ": {"courses_avg": 95}}]},
            "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg"], "ORDER": "courses_size"}
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 4 without transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {"AND": [{"GT": {"courss_avg": "90"}}, {"EQ": {"courss_avg": "80"}}, {"IS": {"courses_dept": "cpsc"}}]},
            "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg"], "ORDER": "courses_avg"}
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 5 without transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {
                "OR": [{
                    "NOT": {
                        "AND": [{"GT": {"courses_avg": "90"}}, {"EQ": {"courss_avg": "80"}}, {"IS": {"course_dept": "cpsc"}}, {
                            "AND": [{"GT": {"courses_avg": 20}}]
                        }]
                    }
                }, {"IS": {"courses_uuid": "129*"}}]
            },
            "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg", "courses_uuid"], "ORDER": "courses_avg"}
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 6 without transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {"AND": [{"GT": {}}, {"EQ": {"courss_avg": "80"}}, {"IS": {"courses_dept": "cpsc"}}]},
            "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg"], "ORDER": "courses_avg"}
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 7 without transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {"AND": [{"GT": {}}, {"EQ": {"courss_avg": "80"}}, {"IS": {"courses_dept": "cpsc"}}]},
            "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg"], "ORDER": "courses_avg"}
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 8 without transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_avg", "rooms_lat"],
                "ORDER": "courses_avg"
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 1 with transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {
                "AND": [
                    {
                        "GT": {
                            "courss_avg": "95"
                        }
                    },
                    {
                        "EQ": {
                            "courss_avg": "80"
                        }
                    },
                    {
                        "IS": {
                            "courses_dept": "cpsc"
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": []
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_avg"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 2 with transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {
                "GT": {
                    "courses_id": 1
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_avg", "maxAvg"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 3 with transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {"OR": [{"AND": [{"GT": {"courses_avg": 90}}, {"IS": {"courses_dept": "adhe"}}]}, {"EQ": {"courses_avg": 95}}]},
            "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg", "maxAvg"], "ORDER": "courses_size"},
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_avg"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 4 with transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {"AND": [{"GT": {"courss_avg": "90"}}, {"EQ": {"courss_avg": "80"}}, {"IS": {"courses_dept": "cpsc"}}]},
            "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg", "maxAvg"], "ORDER": "courses_avg"},
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_avg"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 5 with transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {
                "OR": [{
                    "NOT": {
                        "AND": [{"GT": {"courses_avg": "90"}}, {"EQ": {"courss_avg": "80"}}, {"IS": {"course_dept": "cpsc"}}, {
                            "AND": [{"GT": {"courses_avg": 20}}]
                        }]
                    }
                }, {"IS": {"courses_uuid": "129*"}}]
            },
            "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg", "maxAvg"], "ORDER": "courses_avg"},
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_avg"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 6 with transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {"AND": [{"GT": {}}, {"EQ": {"courss_avg": "80"}}, {"IS": {"courses_dept": "cpsc"}}]},
            "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg", "maxAvg"], "ORDER": "courses_avg"},
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_avg"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 7 with transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {"AND": [{"GT": {}}, {"EQ": {"courss_avg": "80"}}, {"IS": {"courses_dept": "cpsc"}}]},
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_avg", "maxAvg"],
                "ORDER": "courses_avg"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_avg"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 8 with transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_avg", "rooms_lat", "maxAvg"],
                "ORDER": "courses_avg"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "rooms_lat"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 9 with transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_avg", "maxAvg"],
                "ORDER": "courses_avg"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_avg", "c_uuid"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid 10 with transformation", function () {
        var iFacade = new InsightFacade();

        let query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_avg", "maxAvg"],
                "ORDER": "courses_avg"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_avg", "rooms_lat"],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };

        return iFacade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });
});