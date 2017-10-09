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
        } else if (query.charAt(query.length-1) !== ".") {
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
                result.push(parsedLine.replaceAll(" ", ""));
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
            if (this.getRuleNameFromQuery(parsedRules[i]) === ruleName) {
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

    this.findOcurrences = function (string, substring) {
        string += '';
        substring += '';

        if (substring.length <= 0) {
            return string.length + 1;
        }
        substring = substring.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return (string.match(new RegExp(substring, 'gi')) || []).length;
    }

    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };

    this.getNewFactsFromRule = function (rule, query) {
        //Obtiene los facts de la rule segun el query
        if (rule !== null) {
            var ruleParts = rule.split(":-");
            var queryParam = this.getParamsFromFact(query);
            var ruleParam = this.getParamsFromFact(ruleParts[0]);
            var result = ruleParts[1];
            for (var i = 0; i < ruleParam.length; i++) {
                result = result.replaceAll(ruleParam[i], queryParam[ruleParam.indexOf(ruleParam[i])]);
            }
            var result2 = [];
            var newFactsCont = this.findOcurrences(result, "(");
            while (newFactsCont > 0) {
                var aux = result.substring(0, result.indexOf(")") + 1);
                result2.push(aux.replace(/ /g, ''));
                result = result.substring(result.indexOf(")") + 2);
                newFactsCont--;
            }
            return result2;
        } else {
            return [];
        }
    }

    this.matchFacts = function (newFactsFromRule, parsedFacts) {
        var matches = 0;
        if (newFactsFromRule.length === 0) {
            return false;
        }
        for (var i = 0; i < newFactsFromRule.length; i++) {
            if (parsedFacts.indexOf(newFactsFromRule[i].replaceAll(" ", "")) !== -1) {
                matches++;
            }
        }
        if (matches === newFactsFromRule.length) {
            return true;
        }
        return false;
    }

    this.processRule = function (rule, query, parsedFacts) {
        var newFactsFromRule = this.getNewFactsFromRule(rule, query);
        return this.matchFacts(newFactsFromRule, parsedFacts);
    }

    this.analizeRules = function (parsedFacts, parsedRules, query) {
        var ruleName = this.getRuleNameFromQuery(query);
        var rule = this.getRuleByName(parsedRules, ruleName);
        if (rule === null) {
            return false;
        } else {
            return this.processRule(rule, query, parsedFacts);
        }
    }

    this.evaluateQueryCore = function (database, query) {
        var parsedFacts = this.getFactsFromDatabase(database);
        var parsedRules = this.getRulesFromDatabase(database);
        if (parsedFacts.length !== 0) {
            if (parsedRules.length !== 0) {
                var result = false;
                if (query === "" || query === null) {
                    return result;
                }
                result = this.analizeFacts(parsedFacts, query.replaceAll(" ", ""));
                if (result) {
                    return result;
                } else {
                    result = this.analizeRules(parsedFacts, parsedRules, query);
                    return result;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
        return result;
    }

    this.parseDB = function (database) {
        parseOk = true;
        for (var i = 0; i < database.length; i++) {
            if (!this.validateFactSyntax(database[i])) {
                parseOk = false;
            }
        }
        if (parseOk) {
            this.db = database;
        } else {
            this.db = null;
        }
    }

    this.checkQuery = function (query) {
        try {
            this.db.length;
            return this.evaluateQueryCore(this.db, query);

        } catch (err) {
            message.innerHTML = "Invalid database.";
        }
    }

}

module.exports = Interpreter;
