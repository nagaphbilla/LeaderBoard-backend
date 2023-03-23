const router = require('express').Router()
const User = require("../model/userModel")
const DomParser = require("dom-parser")
const fetch = (...args) =>
import('node-fetch').then(({default: fetch}) => fetch(...args));

router.get('/leetcode', (req, res) => {
    var urls = [];
    User.find()
    .then(users => {
        users.map(user => {
            const id = user["leetcode"]
            const url = `https://leetcode.com/graphql/?query={%20matchedUser(username:%20%22${id}%22)%20{%20username%20badges%20{%20name%20}%20submitStats:%20submitStatsGlobal%20{%20acSubmissionNum%20{%20difficulty%20count%20}%20}%20}%20userContestRanking(username:%20%20%22${id}%22)%20{%20rating%20}%20}`
            urls.push({ "name" : user["name"], "url" : url })
        })
    })
    .then(() => {
        Promise.all(urls.map(async url => {
            const data = await fetch(url["url"])
            return data.json()
        }))
        .then(values => {
            for(var i=0;i<values.length;i++) {
                values[i]["name"] = urls[i]["name"]
            }
            res.status(200).json(values)
        })
    })
})
router.get('/github', (req, res) => {
    var urls = [];
    User.find()
    .then(users => {
        users.map(user => {
            let id = user["github"]
            let details = {"name" : user["name"], "username" : user["github"]}
            if(id == "") {
                id = "github"
            }
            const url = `https://github.com/users/${id}/contributions?to=2023-12-31`
            details["url"] = url
            urls.push(details)
        })
    })
    .then(() => {
        Promise.all(urls.map(async url => {
            const data = await fetch(url["url"])
            return data.text()
        }))
        .then(values => {
            var result = []
            var parser = new DomParser();
            for(var i=0;i<values.length;i++) {
                let details = {"name" : urls[i]["name"], "username" : urls[i]["username"]}
                if(values[i] == "Not Found") {
                    details["contributions"] = null
                }
                else {
                    var dom = parser.parseFromString(values[i])
                    var element = dom.getElementsByTagName('h2')[0].textContent
                    details["contributions"] = parseInt(element, 10)
                }
                result.push(details)
            }
            res.status(200).json(result)
        })
    })
})

router.get("/codeforces", (req, res) => {
    var url = "https://codeforces.com/api/user.info?handles="
    var response = []
    User.find()
    .then(users => {
        users.map(user => {
            let id = user["codeforces"]
            url += id + ';'
            const details = {"name" : user["name"]}
            if(id == "") {
                details["username"] = "-"
                details["rating"] = null
                details["tag"] = null
            }
            response.push(details)      
        })
    })
    .then(() => {
        fetch(url)
        .then(data => data.json())
        .then(result => {
            const users = result["result"]
            let j = 0;
            for(let i=0;i<response.length;i++) {
                if(response[i]["username"] != "-") {
                    response[i]["username"] = users[j]["handle"]
                    response[i]["rating"] = users[j]["rating"]
                    response[i]["tag"] = users[j]["rank"]
                    j += 1                  
                }
            }
        })
        .then(() => {res.status(200).json(response)})
    })
})

module.exports = router