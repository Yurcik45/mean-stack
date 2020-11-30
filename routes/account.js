const express = require("express");
const router = express.Router();
const User = require("../models/user");
const TechnicalInspection = require("../models/ technicalInspection");
const jwt = require("jsonwebtoken");
const configDB = require("../config/db");
const passport = require("passport");


// Authentication
router.get('/authentication', ((req, res) => res.json('auth worked')));
router.post('/authentication', (req,res) => {
    const login = req.body.login;
    const password = req.body.password;
    console.log('Serv account.js login :', login)


    User.getUserByLogin(login, (err, user) => {
        if (err) throw err;

        if (!user)
            return res.json({ success: false, message: "користувач з таким іменем не знайдений" });

        User.comparePass( password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {

                const token = jwt.sign(user.toJSON(), configDB.secret, {
                    expiresIn: 3600 * 24
                });
                res.json(
                    {
                    success: true,
                    token: 'JWT' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        login: user.login,
                        email: user.email
                    },
                    message: "автентифікація успішна",
                });
            } else
                return res.json({ success: false, message: "невірний пароль" });
        })

    });

});

// Registration
router.post('/registration', (req,res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
        // password_2: req.body.password_2
    });
    User.addUser(newUser, (err, user) => {
        if(err)
            res.json({ success: false, message: "серв. Пользователь НЕ зарегестрирован" });
        else
            res.json({ success: true, message: "серв. Регистация успешна" });
    })
});



// UserPage
let authenticate = passport.authenticate('jwt', { session: false }, () => console.log('серв.лог  JWT worked'));
router.get(
    '/userPage',
    authenticate,
    (req,res) => {
        res.send('UserPage')
});


router.post('/userPage', (req,res) => {
    let newInspection = new TechnicalInspection({
        policeName: req.body.policeName,
        stateCarNumber: req.body.stateCarNumber,
        engineNumber: req.body.engineNumber,
        carColor: req.body.carColor,
        carBrand: req.body.carBrand,
        technicalPassportNumber: req.body.technicalPassportNumber,
        driversLicenseNumber: req.body.driversLicenseNumber,
        fullName: req.body.fullName,
        residenceAdress: req.body.residenceAdress,
        yearOfBird: req.body.yearOfBird,

        dateOfInspection: req.body.dateOfInspection,
        // policePosition: req.body.policePosition,
        result: req.body.result,
        conclusion: req.body.conclusion
    });

    TechnicalInspection.addNewInspection(newInspection, (err, user) => {
        if(err)
            res.json({ success: false, message: "серв. Технічний огляд  НЕ !!! збережено" });
        else
            res.json({ success: true, message: "серв. Технічний огляд  УСПІШНО збережено" });
    })
});




router.get('/statistic', (req,res) => {
    res.send('statistic page')
});


router.post('/statistic', (req,res) => {

    if (req.body.dateWorker !== undefined) {
        const inputDateData = req.body.dateWorker;
        console.log('input', inputDateData)
        // res.json({output: inputDateData})
        let st = new Date(inputDateData).toISOString();

// db.technicalinspections.find({ dateOfInspection: {$eq : ISODate("2020-11-21")}})

        TechnicalInspection.find(
            {dateOfInspection: {$eq: st}},
            (err, datesWorkerData) => {
                if (err) {
                    throw err
                } else {
                    console.log('Dates Data GOOD', datesWorkerData)
                    return res.json({output: datesWorkerData})
                }
            }
        )

        //db.technicalinspections.find({ engineNumber : "4216СР В0801271" })

        } else if (req.body.engineNumber !== undefined) {
        let engine = req.body.engineNumber;
            // res.json({response: engine})

        TechnicalInspection.find(
            { engineNumber : engine },
            (err, dataEngines) => {
                if (err) {
                    throw err
                } else {
                    console.log('SERV. Data engines good', dataEngines);
                    return res.json({response: dataEngines})
                }
            }
        )

        } else if (req.body.st !== undefined && req.body.end !== undefined) {
        const inputData = req.body;
        const inputDataST = req.body.st;
        const inputDataEND = req.body.end;

        console.log('inputDataST', inputDataST);
        console.log('inputDataEND', inputDataEND);
        // res.json({st: inputDataST, inputData: inputData, end: inputDataEND})

        let st = new Date(inputDataST).toISOString();
        let end = new Date(inputDataEND).toISOString();

        console.log('st', st);
        console.log('end', end);


        TechnicalInspection.find(
            {"dateOfInspection": {$gte: st ,$lte: end}},
            (err, datesData) => {
                if (err) {
                    throw err
                } else {
                    console.log('Dates Data GOOD')
                    // console.log('Dates Data GOOD', datesData)
                    return res.json({filterData: datesData})
                }
            }
        )
    }



});


// router.post('/statistic', (req, res) => {
//     const inputDateData = req.body;
//     console.log('input', inputDateData)
//     res.json({output: inputDateData})
// })







module.exports = router;



// .group({key: {"field": true},initial: {sum: 0},reduce: function(doc, prev) { prev.sum += 1} })

// aggregate([{'$match': {'dateOfInspection': {"$exists" : true}}},{'$group': {'_id': {'$sum': 1}}])


//  db.technicalinspections.find({"dateOfInspection":{$gte:new ISODate("2020-01-01"),$lte:new ISODate("2020-01-04")}})
//  db.technicalinspections.aggregate([{$match: {score: {$gt: 80}}}, {$count: "passing_scores"}])
//  db.technicalinspections.aggregate([{$match: {"dateOfInspection":{$gte:new ISODate("2020-01-01"),$lte:new ISODate("2020-01-04")}}}, {$count: "passing_scores"}])
//
//
//

// db.technicalinspections.aggregate([
//     { "$group": {
//             "dateOfInspection": { "$toLower": "$role" },
//             "count": { "$sum": 1 }
//         } },
//     { "$group": {
//             "dateOfInspection": null,
//             "counts": {
//                 "$push": { "k": "dateOfInspection", "v": "$count" }
//             }
//         } },
//     { "$replaceRoot": {
//             "newRoot": { "$arrayToObject": "$counts" }
//         } }
// ])
//   db.technicalinspections.distinctAndCount('dateOfInspection', {dateOfInspection: /^a/i})


// db.technicalinspections.aggregate([
//     {
//         $match: {
//             keywords: { $not: {$size: 0} }
//         }
//     },
//     { $unwind: "$keywords" },
//     {
//         $group: {
//             count: { $sum: 1 }
//         }
//     },
//     {
//         $match: {
//             count: { $gte: 2 }
//         }
//     },
//     { $sort : { count : -1} },
//     { $limit : 100 }
// ]);