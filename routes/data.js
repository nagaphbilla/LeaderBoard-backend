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
        users.map(async user => {
            let id = user["github"]
            let details = {"name" : user["name"], "username" : user["github"]}
            if(id == "") {
                id = "github"
            }
            const url = `https://github.com/users/${id}/contributions?to=2023-12-31`
            details["repos"] = 0
            details["url"] = url
            urls.push(details)
        })
    })
    .then(() => {
        Promise.all(urls.map(async url => {
            if(url["username"] != "") {
                const data = await fetch(`https://api.github.com/users/${url["username"]}`)
                const res = await data.json()
                url["repos"] = res["public_repos"]
            }
            const data = await fetch(url["url"])
            return data.text()
        }))
        .then(values => {
            var result = []
            var parser = new DomParser();
            for(var i=0;i<values.length;i++) {
                let details = {"name" : urls[i]["name"], "username" : urls[i]["username"], "repos" : urls[i]["repos"]}
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

module.exports = router