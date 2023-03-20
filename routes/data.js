const router = require('express').Router()
const User = require("../model/userModel")
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

module.exports = router