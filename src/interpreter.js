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
        var result = false;
        for (var i = 0; i < parsedFacts.length; i++) {
            if (parsedFacts[i] === query) {
                result = true;
                break;
            }
        }
        return result;
    }

    this.getRuleNameFromQuery = function (query) {
        return query.substring(0, query.indexOf("("));
    }

    this.getRuleByName = function (parsedRules, ruleName) {
        var rule = null;
        for (var i = 0; i < parsedRules.length; i++) {
            if (getRuleNameFromQuery(parsedRules[i]) === ruleName) {
                rule = parsedRules[i];
                break;
            }
        }
        return rule;
    }
    
    this.getParamsFromFact = function (query) {
        var subquery = query.substring(query.indexOf("(") + 1, query.indexOf(")"));
        return subquery.split(", ");
    }
    
    this.getNewFactsFromRule = function (rule, query) {
        //Obtiene los facts de la rule segun el query
        var ruleParts = rule.split(":-");
        var queryParam = this.getParamsFromFact(query);
        var ruleParam = this.getParamsFromFact(ruleParts[0]);
        var result = ruleParts[1];
        for (var i = 0; i < ruleParam.length; i++) {
            
        }
    }

    this.parseDB = function (database) {
        this.db = database;
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
