var nearest = require('nearest-date');
const foodController = require('./foodController');
let menuController = () => {
    let Menu = require('../models/menuModel');
    let Order = require('../models/orderModel');
    let User = require('../models/userModel');
    let MenuOrder = require('../models/menuOrderModel');
    var mailer = require('../services/mailerService.js');

    function post(req, res) {
    //    console.log(':::::', req.body)
        let menu = new Menu({
            menuTitle: req.body.menuTitle,
            cutOff: req.body.cutOff,
            mealTime: req.body.mealTime,
            description: req.body.description
        })
        menu.save((err, saved) => {
            if (err) res.status(500).send();
            else res.status(200).json(saved);
            req.body._food.forEach(a => {
                // a.name.push({
                //     name: "Skip a meal",
                //     whoOrdered: []
                // });
                a.name.push({
                    name: "I'm on leave",
                    whoOrdered: []
                });
            })
            let menuOrder = new MenuOrder({
                _menu: saved._id,
            })
            menuOrder.save();
            Menu.findOne({ _id: saved._id }, function (err, menu) {
                console.log()
                if (!menu) res.status(200).send('No menu found');
                else {
                    console.log('ni sud', req.body._food)
                    menu.update({
                        $set: {
                            menu: req.body._food
                        }
                    }, err => {
                        if (err) res.status(401).send('error adding food to menu');
                    })
                    sendMail(req, res, saved);
                }
            })
        });
    }

    function get(req, res) {
        console.log('-------', req.session)
        Menu.find({}, 'mealTime _id menuTitle cutOff description menu.holiday menu.name.name menu.date menu._id').sort({createdAt: -1}).exec((err, menu) => {
        // Menu.find({}, (err, menu) => {
            if (err) res.status(500).send();
            else if (menu) res.status(200).json(menu);
            else res.status(404).send({res: menu});
        });
    }

    function getMenu(req, res) {
        // console.log('asd', req.user)
        var offset = new Date().getTimezoneOffset();
        Menu.find({}).sort({ $natural: -1 }).limit(1).exec((err, menu) => {
            if (err) res.status(500).send();
            else if (menu) {
                
                var menuID;
                let dates = [];
                let forOrder = [];
                let status = '';
                const nDate = new Date().toISOString('en-US', { timeZone: 'Asia/Manila' });
                 
                var thisMenu = menu[0]

                // menu.forEach(a => {
                    var milliseconds = 0;        
                    var sec = 0;                   
                    var min = 0;                 
                    var hours = 15;
                    var days = 0;
                    const cDate = thisMenu.cutOff;
                    var newCDate = new Date(cDate.getTime() + milliseconds + 1000 * (sec + 60 * (min + 60 * (hours + 24 * days))));
                    const cutOff = newCDate.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });

                    dates.push(thisMenu.cutOff);
                // });
                
                var index = nearest(dates, Date.now())
                let date = dates[index];
                // console.log('date::', date)
                // menu.forEach(a => {
                    // console.log('cutOff:', a.cutOff)
                    if (thisMenu.cutOff == date) {
                        // var milliseconds = 0;        
                        // var sec = 0;                   
                        // var min = 0;                 
                        // var hours = 15;
                        // var days = 0;
                        // const cDate = thisMenu.cutOff;
                        // var newCDate = new Date(cDate.getTime() + milliseconds + 1000 * (sec + 60 * (min + 60 * (hours + 24 * days))));
                        const cutOff = newCDate.toISOString('en-US', { timeZone: 'Asia/Taipei' });
                        // console.log(':::::::::--', nDate)
                        // console.log(':::::::::--', cutOff)
                        if (cutOff > nDate){
                            status = false;
                            thisMenu.menu.forEach(b => {
                                // var bd = b.date
                                if (offset = 0) {
                                    // console.log('888', b.date)
                                    const date = b.date.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
                                    b.date = date;
                                } else {
                                    // console.log('not 8', b.date)

                                    var milliseconds = 0;        
                                    var sec = 0;                   
                                    var min = 0;                 
                                    var hours = 8;
                                    var days = 0;
                                    const cDate = b.date;
                                    var newCDate = new Date(cDate.getTime() + milliseconds + 1000 * (sec + 60 * (min + 60 * (hours + 24 * days))));
                                  
                                    const date = newCDate.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
                                    b.date = date;
                                }
                            })
                            forOrder.push(thisMenu);    
                        } else {
                            console.log('1')
                            status = true;
                            forOrder.push(thisMenu);
                        }
                    } else {
                        // console.log('2')
                        // status = true;
                        forOrder.push(thisMenu);
                    }
                // });
                forOrder.forEach(order => {
                    console.log('::::::>>>>', order._id)
                    menuID = order._id;
                })
                
                // Order.find({ _menu: menuID}, (err, order) => {
                //     if (err) res.status(500).send();
                //     else if (order) {
                if (req.user){
                    User.findById({_id: req.user._id}).populate({ path: '_orders', select: '_menu name order _user' }).exec((err, user) => {
                        let final = {};
                        forOrder.forEach(obj => {
                            final._id = obj._id
                            final.menuTitle = obj.menuTitle,
                            final.description = obj.description,
                            final.cutOff = obj.cutOff,
                            final.cutOffDate = obj.cutOff,
                            final.menu = obj.menu
                        })
                        let orders = [];
                        if (user._orders === undefined || user._orders == 0) {

                        } else {
                            // user._orders.forEach(order => {
                                // console.log(':::::::SSS', user._orders.reverse()[0])
                                let a = thisMenu._id.toString();
                                let b = user._orders.reverse()[0]._menu.toString();
                                console.log('---',a)
                                console.log('+++',b)
                                if (a == b) {
                                    console.log('ooo')
                                    orders.push(req.user._id);
                                } else console.log('wala')
                            // })

                        }
                        final.orders = orders;
                        forOrder.push(orders)
                        var arr = forOrder;
                        var obj = new Object();
                        Array.prototype.push.apply(obj, arr);
                        final.cutOff = status;
                        // console.log(':::::', final)
                        res.status(200).json(final);
                    })
                } else res.status(500).send('No user logged in...');
                //     } else res.status(404).send();
                // });
            } else res.status(404).send();
        });
    }

    function getByID(req, res) {
        Menu.findById({ _id: req.params.menuId }, (err, menu) => {
            if (err) res.status(500).send();
            else if (menu) res.status(200).json(menu);
            else res.status(404).send();
        });
    }

    function putByID(req, res) {
        console.log('::: edit menu', req.body)
        console.log('::: edit menu', req.body._food)
        req.body._food.forEach(x => console.log(x.name))
        var menuId = req.body._id;
        Menu.findOne({ _id: menuId }, function (err, menu) {
            // if (!food) console.log('no food found');
            if (!menu) console.log('no food found');
            else {
                //menu.menu
                const menuArray = req.body._food.map(x => {
                    const nameArray = x.name.map(y => {
                        let tempNameFood = { name: y.name}
                        return tempNameFood
                    })
                    const tempMenu = {
                        date: x.date,
                        holiday: x.holiday,
                        name: nameArray
                    }
                    return tempMenu
                })
                // menu.update({
                //     $set: {
                //         menuArray
                //     }
                // }, err => {
                //     if (err) res.status(401).send('error updating food');
                //     // else res.status(201).json(req.food);
                //     else res.status(201).json(req.menu);
                // })
                menu.menuTitle = req.body.menuTitle,
                menu.cutOff = req.body.cutOff,
                menu.description = req.body.description,
                menu.menu = menuArray
                menu.save((err, reved) => {
                    if (err) { res.status(401).send('error updating menu')} else { res.status(201).json(req.menu)}
                })
            }
        })
    }

    function deleteById(req, res) {
        console.log('Menu:::: ', req.body)
        Menu.find({}, (err, menu) => {
            req.body.toDelete.forEach(x => {
                menu.forEach(a => {
                    if (a._id == x) {
                        Menu.findByIdAndRemove({ _id: x }, menu => {
                            res.status(200).send();
                        });
                    }
                })
            })
        })
    }

    function sendMail(req, res, userParam) {
        if(userParam.description){
            body = userParam.description + ' Please visit';
        } else {
            body = 'Our menu for next week is now available for your orders! Please visit'
        }
        console.log('ni sud sa send mail')
        try {
            let menuReadyTemplate;
            res.render('menuReadyTemplate', (err, ejs) => menuReadyTemplate = ejs )
            let HTMLBody;
            let mailOptions = {
                // to: 'allmedspecialized@medspecialized.com',
                to: req.user.email,
                bcc: 'kenneths@meditab.com',
                // cc: 'omteam@medspecialized.com',
                attachments: []
            };

            HTMLBody = menuReadyTemplate;
            HTMLBody = HTMLBody.replace('{{body}}', body);
            // HTMLBody = HTMLBody.replace('{{email2}}', req.user.email);
            // HTMLBody = HTMLBody.replace('{{host1}}', req.user.givenName);
            // HTMLBody = HTMLBody.replace('{{host2}}', req.user.familyName);
            // HTMLBody = HTMLBody.replace('{{hostEmail}}', req.user.email);
            // HTMLBody = HTMLBody.replace('{{url}}', url);
            
            mailer.setHTMLBody(HTMLBody);
            mailer.setRecepient(mailOptions.to);
            mailer.setBCC(mailOptions.bcc); 
            mailer.setCC(mailOptions.cc);
            mailer.setAttachments(mailOptions.attachments);
            mailer.setSubject(userParam.menuTitle);
            mailer.sendMail()
                .then(info => {
                    console.log('Email successfully sent to allmedspecialized@medspecialized.com')
                    res.status(201).json(userParam);
                })
                .catch(err => {
                    console.log('Sending email error...');
                    res.status(500).send(err);
                });
        } catch (e) { console.log(e); }
    }

    return {
        get: get,
        getMenu: getMenu,
        getByID: getByID,
        post: post,
        putByID: putByID,
        deleteById: deleteById
    }
}

module.exports = menuController;
