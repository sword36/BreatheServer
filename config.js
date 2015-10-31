module.exports = {
    db: {
        "development": "mongodb://localhost:27017",
        "production": "mongodb://" + process.env.dbuser + ":" + process.env.dbpassword
        + "@ds041643.mongolab.com:41643/breatheserver",
        "test": "mongodb://localhost:27018",
        "travis": "mongodb://127.0.0.1"
    }
};