module.exports = {
    db: {
        "development": "mongodb://127.0.0.1:27017",
        "production": "mongodb://" + process.env.dbuser + ":" + process.env.dbpassword
        + "@ds041643.mongolab.com:41643/breatheserver",
        "test": "mongodb://127.0.0.1:27017",
        "travis": "mongodb://127.0.0.1:27017"
    }
};