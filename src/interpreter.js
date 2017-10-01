var Interpreter = function () {

    var db;

    this.validateFactSyntax = function (query) {
        var result = true;
        if (query === "") {
            result = false;
        } else if (query.indexOf("(") === -1) {
            result = false;
        } else if (query.indexOf(")") === -1) {
            result = false;
        }
        return result;
    }

    this.getFactsFromDatabase = function (database) {
        var result = [];
        for (var i = 0; i < database.length; i++) {
            var line = database[i].trim();
            var parsedLine = line.replace("\.", "");
            if (parsedLine.indexOf(":-") === -1) {
                result.push(parsedLine);
            }
        }
        return result;
    }
    
    this.getRulesFromDatabase = function (database) {
        var result = [];
        for (var i = 0; i < database.length; i++) {
            var line = database[i].trim();
            var parsedLine = line.replace("\.", ""); 
            if (parsedLine.indexOf(":-") !== -1) {
                result.push(parsedLine);
            }
        }
        return result;
    }
    
    this.analizeFacts = function (parsedFacts, query) {
        
    } 

    this.parseDB = function (database) {
        //cargo la database en db!
    }

    this.checkQuery = function (params) {
        var database = this.parseDB()
        if (validateFactSyntax(query)) {
            return evaluateQuery(query);
        }
        return null;
    }

}

module.exports = Interpreter;
