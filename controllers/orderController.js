let orderController = () => {
    let Order = require('../models/orderModel');
    let Menu = require('../models/menuModel');
    let User = require('../models/userModel');
    let MenuOrder = require('../models/menuOrderModel');
    var mailer = require('../services/mailerService.js');
    let moment = require('moment');

    function post(req, res) {
        if(req.user){
            console.log('asdasdasd in orderControll post', req.body)
            let order = new Order({
                _user: req.body._user,
                _menu: req.body._menu,
                cutOff: req.body.cutOffDate,
                name: req.body.name,
                order: req.body.order,
                mealType: req.body.mealType,
                menuTitle: req.body.menuTitle,
                office: '',
            })
            let reqOrder = []
            req.body.order.forEach(order => {
                reqOrder.push(order);
            })
            // user.save((err, saved) => {
            //     if (err) { res.status(409).send() } else { res.status(201).send('Successfully created.') }
            //   })
            order.save((err, saved) => {
                console.log('saved in order user', saved)
                MenuOrder.findOne({_menu: req.body._menu}, (err, menuOrder) => {
                    if (err) {
                        console.log('eddddd', err)
                    } else {
                        console.log(':::::ADASD', menuOrder)
                        menuOrder._orders.addToSet(saved._id);
                        menuOrder.save()
                    }
                })
                console.log('req.user in order user', req.user)
                User.findByIdAndUpdate(req.user._id, { $addToSet: { _orders:  saved._id} }, (err, user) => {
                    if (err) {
                        console.log('eddddd', err)
                    } else {
                        console.log(':::::ADASD', user)
                        user.save();
                    }
                });
                

                if (err) res.status(500).send();
                else {
                    Menu.findById({ _id: req.body._menu }, (err, menu) => {
                        if(err) {console.log('::::eeee', err)}
                        if(menu == null){
                            
                        } else {
                            
                            var c = 5;
                            menu.menu.forEach(food => {
                                var ro = '';
                                    if(c === 5) ro = reqOrder[0]; 
                                    else if(c === 4) ro = reqOrder[1]; 
                                    else if(c === 3) ro = reqOrder[2]; 
                                    else if(c === 2) ro = reqOrder[3]; 
                                    else if(c === 1) ro = reqOrder[4]; 
                                    food.name.forEach(a => {
                                        
                                        let obj = {}
                                        if (a.name == ro.food) {
                                            obj._order = saved._id;
                                            obj.name = req.body.name;
                                            obj.mealTime = ro.mealTime;
                                            a.orders.push(obj)
                                        }
                                    })
                                c--;
                            })
                            console.log('Order posted')
                            menu.save((err, result) => {
                                if (err) console.log(err);
                                else {
                                    sendMail(req, res, saved);
                                    res.status(201).json(saved)
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.status(500).send('No user logged in...')
        }
    }

    function putById(req, res) {
        if (req.body) {
            console.log('asdasd in putById', req.body)
            console.log('order.option in putById', req.body.order[0].options)
            Order.findById({ _id: req.body._id }, (err, order) => {
                let reqOrder = []
                req.body.order.forEach(order => {
                    reqOrder.push(order);
                })
                console.log('order in putbyid', order)
                if (err) res.status(500).send();
                else {
                    order.update({ $set: { order: req.body.order, mealType: req.body.mealType } }, (err, data) => {
                        if (err) {
                            console.log('err in putbyid', err)
                            res.status(500).send();
                        } 
                        else if(data){
                            Menu.findById({ _id: order._menu }, (err, menu) => {
                                menu.menu.forEach(food => {
                                    food.name.forEach(a => {
                                        a.orders.forEach(b => {
                                            if (b._order == req.body._id) a.orders.pull(b);
                                        });
                                    });
                                });
                                var c = 5;
                                menu.menu.forEach(food => {
                                    var ro = '';
                                        if(c === 5) ro = reqOrder[0]; 
                                        else if(c === 4) ro = reqOrder[1]; 
                                        else if(c === 3) ro = reqOrder[2]; 
                                        else if(c === 2) ro = reqOrder[3]; 
                                        else if(c === 1) ro = reqOrder[4]; 
                                        food.name.forEach(a => {
                                            let obj = {};
                                            if (a.name == ro.food) {
                                                obj._order = req.body._id;
                                                obj.name = req.body.name;
                                                if(ro.food != "I'm on leave") obj.mealTime = ro.mealTime;
                                                else obj.mealTime = '';
                                                a.orders.push(obj);
                                            }
                                        })
                                    c--;
                                })
                                console.log('Order updated')
                                menu.save((err, result) => {
                                    if (err) console.log(err);
                                    else res.status(201).json(menu);
                                });
                            });
                        }
                    });
                }
            });
        } else res.status(500).send();
    }

    function get(req, res) {
        console.log('asdasd')
        Menu.find({}).sort({createdAt: -1}).exec((err, menu) => {
            if (err) res.status(500).send();
            else if (menu) res.status(200).json(menu);
            else res.status(404).send();
        });
        // User.find({}).populate({ path: '_orders', select: '_id _user  '}).exec((err, users) => { // N E W 
        //     let userCount = 0;
            
            
        //     users.forEach(user => {
        //         if (user._orders === undefined || user._orders == 0) {
        //             console.log('wala pay sulod ang array')
        //             userCount++;
        //             // console.log('userCount===>>>', userCount)
        //             // console.log('ADADASDASDADS', user)
        //             Order.find({_user: user._id}, (err, userOrder) => {
        //                 if (err) console.log('errrr')
        //                 else {
        //                     userOrder.forEach(userOrder => {
        //                         // console.log('adasdas==>>', userOrder)
        //                         user._orders.addToSet(userOrder._id)
        //                         console.log('::ASD:ASD:', userOrder._id);
        //                     });
        //                     user.save();
        //                 }
        //             });
        //         } else {
        //             console.log('naa nay sulod ang array')
        //             userCount++;
        //             // console.log('userCount===>>>', userCount)
        //             // console.log('ADADASDASDADS', user)
        //             Order.find({_user: user._id}, (err, userOrder) => {
        //                 if (err) console.log('errrr')
        //                 else {
        //                     userOrder.forEach(userOrder => {
        //                         // console.log('adasdas==>>', userOrder)
        //                         user._orders.forEach(order => {
        //                             console.log('---', order._id)
        //                             console.log('+++', userOrder._id)
        //                             if(order._id = userOrder._id){
        //                                 console.log('naa na')
        //                             } else {
        //                                 user._orders.addToSet(userOrder._id)
        //                                 console.log('::ASD:ASD:', userOrder._id);
                                        
        //                             }
        //                         });
        //                     });
        //                     user.save();
        //                 }
        //             });
        //         }
        //     })
            
        // });
    }

    function getOrderByMenu(req, res) {
        Order.findOne({ _id: req.params.id }, '_id order menuTitle orders _user _menu cutOff name mealType').populate({
            path: '_menu', select: 'menuTitle menu cutOff'
        }).exec((err, order) => {
            if (err) res.status(500).send('Order not  found');
            else if (order) {
                res.status(200).json(order);
            } 
            else res.status(404).send();
        });
    }

    function getOrderByUser(req, res) {
        // console.log('asds', req.user.email)
        User.findById({_id: req.user._id}).populate({ path: '_orders', select: '_id order menuTitle orders createdAt _user mealType _menu cutOff ', populate: {path: '_menu', select: 'menuTitle'} }).exec((err, order) => { // N E W 
            if (order._orders === undefined || order._orders == 0) {
                // console.log('ADADASDASDADS', order._orders)
                Order.find({_user: req.user._id}, (err, userOrder) => {
                    if (err) console.log('errrr')
                    else {
                        userOrder.forEach(userOrder => {
                            order._orders.addToSet(userOrder._id)
                            order.save();
                            console.log('::ASD:ASD:', userOrder._id);
                        });
                    }
                });
            }
        // });
        ////// C U R E N T /////
        // Order.find({_user: req.user._id},'_id order menuTitle orders createdAt _user mealType _menu cutOff office ').populate({
        //     path: '_menu', select: 'menuTitle'
        // }).exec((err, order) => {
            if (err) res.status(500).send();
            else if (order) {
                let orderArr = [];
                // console.log('::::', order._orders)
                order._orders.forEach(order => {
                    // console.log('asdasda', order._user)
                    let orderObj = {}
                    orderObj._id = order._id;
                    orderObj._menu = order._menu;
                    orderObj._user = order._user;
                    orderObj.menuTitle = order.menuTitle;
                    orderObj.order = order.order;
                    orderObj.mealType = order.mealType;
                    orderObj.createdAt = order.createdAt;

                    var milliseconds = 0;        
                    var sec = 0;                   
                    var min = 0;                 
                    var hours = 15;
                    var days = 0;
                    const cDate = order.cutOff;
                    var newCDate = new Date(cDate.getTime() + milliseconds + 1000 * (sec + 60 * (min + 60 * (hours + 24 * days))));
                    const cutOff = newCDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
                    const nDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

                    var a = new Date(cutOff)
                    var b = new Date(nDate)

                    // console.log(':: cutOff :: ', a.toISOString())
                    // console.log(':: nDate  :: ', b.toISOString())
                    if(+a <= +b || order._menu == null){
                        // console.log('true')
                        orderObj.cutOff = true
                    } else {
                        // console.log('false')
                        orderObj.cutOff = false
                    }
                    orderArr.push(orderObj);
                })
                // console.log('::ASD::AD:A::', orderArr)

                const unique = [...new Map(orderArr.map((m) => [m._menu, m])).values()];

                res.status(200).json(unique);}
            else res.status(404).send();
        });
    }

    function orderReports(req, res) {
        Order.find({ _menu: req.params.id }, 'order.food order.date order.holiday order.mealTime food menu menuTitle cutOff createdAt user name _user').populate({
            path: '_user', select: 'email name firstName lastName fullName'
        }).exec((err, orders) => {
            if (err) res.status(500).send();
            else if (orders) {
                var arr = orders;
                var obj = new Object();
                Array.prototype.push.apply(obj, arr);
                console.log('Raw data tab');
                obj.menuTitle = orders.menuTitle;
                obj.cutOff = orders.cutOff;
                obj.dateCreated = orders.createdAt;
                
                const unique = [...new Map(orders.map((m) => [m._user._id, m])).values()];
                res.status(200).json(unique);
            }
            else res.status(404).send();
        });
    }

    function dates(req, res) {
        console.log('_id:::>>>', req.params)
        var offset = new Date().getTimezoneOffset();
        Menu.findById({_id: req.params.id}, (err, data) => {
            let dateArr = [];
            data.menu.forEach(meal => {
                if (offset === -480) {
                    dateArr.push(meal.date);
                } else {
                    var milliseconds = 0;        
                    var sec = 0;                   
                    var min = 0;                 
                    var hours = 8;
                    var days = 0;
                    const mDate = meal.date;
                    var newMDate = new Date(mDate.getTime() + milliseconds + 1000 * (sec + 60 * (min + 60 * (hours + 24 * days))));
                    dateArr.push(newMDate);
                }
            })
            var arr = dateArr;
            var obj = new Object();
            Array.prototype.push.apply(obj, arr);
            res.json(obj)
        });
    }

    function menuTitle(req, res) {
        console.log('_id:::>>>', req.params)
        var offset = new Date().getTimezoneOffset();
        Menu.findById({_id: req.params.id}, (err, data) => {
            menuTitle = data.menuTitle
            res.json(menuTitle)
        });
    }

    function mondayOrders(req, res) {
        MenuOrder.find({ _menu: req.params.id }, '_orders _menu').populate({
            path: '_orders', select: 'order _user mealType', 
            populate: { path: '_user', select: 'fullName email' }
        }).exec((err, orders) => {
            if (err) res.status(500).send();
            else if (orders) {

                let lunch = [];
                let dinner = [];
                let leave = [];

                orders.forEach(order => {
                    order._orders.forEach(a => {
                        let orderObj = {
                            Name: '',
                            Meal: '',
                            Time: '',
                        };
                        for (var i = 0; i <  a.order.length; i++) {
                            if (i === 0) {
                                if (a._user.fullName === "" || a._user.fullName === null || a._user.fullName === undefined) orderObj.Name = a._user.email;
                                else orderObj.Name = a._user.fullName;
                                orderObj.Meal = a.order[i].food;
                                if(a.order[i].food !== "I'm on leave") orderObj.Time = a.order[i].mealTime;
                                else orderObj.Time = '';

                                if (orderObj.Time === 'Lunch' && order.Meal !== "I'm on leave"){
                                    lunch.push(orderObj);
                                } else if (orderObj.Time === 'Dinner' && order.Meal !== "I'm on leave"){
                                    dinner.push(orderObj);
                                } else if (orderObj.Meal === "I'm on leave"){
                                    leave.push(orderObj);
                                }
                            }
                        }
                    });
                });
                
                const par = lunch.concat(dinner, leave);

                const unique = [...new Map(par.map((m) => [m.Name, m])).values()];
                // console.log('==-=-', unique)
                // res.status(200).json(unique);

                let final = [];
                let header1 = {
                    Name: 'Day: Monday',
                    Meal: '',
                    Time: '',
                };

                final.push(header1);
                let header2 = {
                    Name: 'Name',
                    Meal: 'Meal',
                    Time: 'Time',
                };
                final.push(header2);
                unique.forEach(data => {
                    final.push(data)
                })
                res.status(200).json(final);
            }
            else res.status(404).send();
        });
    }

    function tuesdatOrders(req, res) {
        MenuOrder.find({ _menu: req.params.id }, '_orders _menu').populate({
            path: '_orders', select: 'order _user mealType', 
            populate: { path: '_user', select: 'fullName email' }
        }).exec((err, orders) => {
            if (err) res.status(500).send();
            else if (orders) {
                
                let lunch = [];
                let dinner = [];
                let leave = [];

                orders.forEach(order => {
                    order._orders.forEach(a => {
                        let orderObj = {
                            Name: '',
                            Meal: '',
                            Time: '',
                        };
                        for (var i = 0; i <  a.order.length; i++) {
                            if (i === 1) {
                                if (a._user.fullName === "" || a._user.fullName === null || a._user.fullName === undefined) orderObj.Name = a._user.email;
                                else orderObj.Name = a._user.fullName;
                                orderObj.Meal = a.order[i].food;
                                if(a.order[i].food !== "I'm on leave") orderObj.Time = a.order[i].mealTime;
                                else orderObj.Time = '';

                                if (orderObj.Time === 'Lunch' && order.Meal !== "I'm on leave"){
                                    lunch.push(orderObj);
                                } else if (orderObj.Time === 'Dinner' && order.Meal !== "I'm on leave"){
                                    dinner.push(orderObj);
                                } else if (orderObj.Meal === "I'm on leave"){
                                    leave.push(orderObj);
                                }
                            }
                        }
                    });
                });
                
                const par = lunch.concat(dinner, leave);

                const unique = [...new Map(par.map((m) => [m.Name, m])).values()];

                let final = [];
                let header1 = {
                    Name: 'Day: Tuesday',
                    Meal: '',
                    Time: '',
                };
                final.push(header1);
                let header2 = {
                    Name: 'Name',
                    Meal: 'Meal',
                    Time: 'Time',
                };
                final.push(header2);
                unique.forEach(data => {
                    final.push(data)
                })
                res.status(200).json(final);
            }
            else res.status(404).send();
        });
    }

    function wednesdayOrders(req, res) {
        MenuOrder.find({ _menu: req.params.id }, '_orders _menu').populate({
            path: '_orders', select: 'order _user mealType', 
            populate: { path: '_user', select: 'fullName email' }
        }).exec((err, orders) => {
            if (err) res.status(500).send();
            else if (orders) {
                
                let lunch = [];
                let dinner = [];
                let leave = [];

                orders.forEach(order => {
                    order._orders.forEach(a => {
                        let orderObj = {
                            Name: '',
                            Meal: '',
                            Time: '',
                        };
                        for (var i = 0; i <  a.order.length; i++) {
                            if (i === 2) {
                                if (a._user.fullName === "" || a._user.fullName === null || a._user.fullName === undefined) orderObj.Name = a._user.email;
                                else orderObj.Name = a._user.fullName;
                                orderObj.Meal = a.order[i].food;
                                if(a.order[i].food !== "I'm on leave") orderObj.Time = a.order[i].mealTime;
                                else orderObj.Time = '';

                                if (orderObj.Time === 'Lunch' && order.Meal !== "I'm on leave"){
                                    lunch.push(orderObj);
                                } else if (orderObj.Time === 'Dinner' && order.Meal !== "I'm on leave"){
                                    dinner.push(orderObj);
                                } else if (orderObj.Meal === "I'm on leave"){
                                    leave.push(orderObj);
                                }
                            }
                        }
                    });
                });
                
                const par = lunch.concat(dinner, leave);

                const unique = [...new Map(par.map((m) => [m.Name, m])).values()];

                let final = [];
                let header1 = {
                    Name: 'Day: Wednesday',
                    Meal: '',
                    Time: '',
                };
                final.push(header1);
                let header2 = {
                    Name: 'Name',
                    Meal: 'Meal',
                    Time: 'Time',
                };
                final.push(header2);
                unique.forEach(data => {
                    final.push(data)
                })
                res.status(200).json(final);
            }
            else res.status(404).send();
        });
    }

    function thursdayOrders(req, res) {
        MenuOrder.find({ _menu: req.params.id }, '_orders _menu').populate({
            path: '_orders', select: 'order _user mealType', 
            populate: { path: '_user', select: 'fullName email' }
        }).exec((err, orders) => {
            if (err) res.status(500).send();
            else if (orders) {
                
                let lunch = [];
                let dinner = [];
                let leave = [];

                orders.forEach(order => {
                    order._orders.forEach(a => {
                        let orderObj = {
                            Name: '',
                            Meal: '',
                            Time: '',
                        };
                        for (var i = 0; i <  a.order.length; i++) {
                            if (i === 3) {
                                if (a._user.fullName === "" || a._user.fullName === null || a._user.fullName === undefined) orderObj.Name = a._user.email;
                                else orderObj.Name = a._user.fullName;
                                orderObj.Meal = a.order[i].food;
                                if(a.order[i].food !== "I'm on leave") orderObj.Time = a.order[i].mealTime;
                                else orderObj.Time = '';

                                if (orderObj.Time === 'Lunch' && order.Meal !== "I'm on leave"){
                                    lunch.push(orderObj);
                                } else if (orderObj.Time === 'Dinner' && order.Meal !== "I'm on leave"){
                                    dinner.push(orderObj);
                                } else if (orderObj.Meal === "I'm on leave"){
                                    leave.push(orderObj);
                                }
                            }
                        }
                    });
                });
                
                const par = lunch.concat(dinner, leave);

                const unique = [...new Map(par.map((m) => [m.Name, m])).values()];

                let final = [];
                let header1 = {
                    Name: 'Day: Thursday',
                    Meal: '',
                    Time: '',
                };
                final.push(header1);
                let header2 = {
                    Name: 'Name',
                    Meal: 'Meal',
                    Time: 'Time',
                };
                final.push(header2);
                unique.forEach(data => {
                    final.push(data)
                })
                res.status(200).json(final);
            }
            else res.status(404).send();
        });
    }

    function fridayOrders(req, res) {
        MenuOrder.find({ _menu: req.params.id }, '_orders _menu').populate({
            path: '_orders', select: 'order _user mealType', 
            populate: { path: '_user', select: 'fullName email' }
        }).exec((err, orders) => {
            if (err) res.status(500).send();
            else if (orders) {
                
                let lunch = [];
                let dinner = [];
                let leave = [];

                orders.forEach(order => {
                    order._orders.forEach(a => {
                        let orderObj = {
                            Name: '',
                            Meal: '',
                            Time: '',
                        };
                        for (var i = 0; i <  a.order.length; i++) {
                            if (i === 4) {
                                if (a._user.fullName === "" || a._user.fullName === null || a._user.fullName === undefined) orderObj.Name = a._user.email;
                                else orderObj.Name = a._user.fullName;
                                orderObj.Meal = a.order[i].food;
                                if(a.order[i].food !== "I'm on leave") orderObj.Time = a.order[i].mealTime;
                                else orderObj.Time = '';

                                if (orderObj.Time === 'Lunch' && order.Meal !== "I'm on leave"){
                                    lunch.push(orderObj);
                                } else if (orderObj.Time === 'Dinner' && order.Meal !== "I'm on leave"){
                                    dinner.push(orderObj);
                                } else if (orderObj.Meal === "I'm on leave"){
                                    leave.push(orderObj);
                                }
                            }
                        }
                    });
                });
                
                const par = lunch.concat(dinner, leave);

                const unique = [...new Map(par.map((m) => [m.Name, m])).values()];

                let final = [];
                let header1 = {
                    Name: 'Day: Friday',
                    Meal: '',
                    Time: '',
                };
                final.push(header1);
                let header2 = {
                    Name: 'Name',
                    Meal: 'Meal',
                    Time: 'Time',
                };
                final.push(header2);
                unique.forEach(data => {
                    final.push(data)
                })
                res.status(200).json(final);
            }
            else res.status(404).send();
        });
    }

    function orders(req, res) {
        MenuOrder.find({ _menu: req.params.id }, '_orders _menu').populate({
            path: '_orders', select: 'order _user mealType', 
            populate: { path: '_user', select: 'fullName email' }
        }).exec((err, orders) => {
            if (err) res.status(500).send();
            else if (orders) {
                let orderArr = [];
                orders.forEach(order => {
                    order._orders.forEach(a => {
                        console.log('--=-', a._user)
                        User.findOne({ _id: a._user }, (err, user) => {
                            return name = user.name;
                        });
                        var name;
                        let orderObj = {
                            Name: '',
                            Monday_Meal: '',
                            Monday_Time: '',
                            Tuesday_Meal: '',
                            Tuesday_Time: '',
                            Wednesday_Meal: '',
                            Wednesday_Time: '',
                            Thursday_Meal: '',
                            Thursday_Time: '',
                            Friday_Meal: '',
                            Friday_Time: ''
                        };
                        if (a._user) {
                            if (a._user.fullName !== "" || a._user.fullName !== null || a._user.fullName !== undefined) orderObj.Name = a._user.fullName;
                            else orderObj.Name = a._user.email;
                        } else orderObj.Name = 'Deleted User'

                        orderObj.Monday_Meal = a.order[0].food
                        orderObj.Monday_Time = a.order[0].mealTime

                        orderObj.Tuesday_Meal = a.order[1].food
                        orderObj.Tuesday_Time = a.order[1].mealTime

                        orderObj.Wednesday_Meal = a.order[2].food
                        orderObj.Wednesday_Time = a.order[2].mealTime

                        orderObj.Thursday_Meal = a.order[3].food
                        orderObj.Thursday_Time = a.order[3].mealTime

                        orderObj.Friday_Meal = a.order[4].food
                        orderObj.Friday_Time = a.order[4].mealTime

                        orderArr.push(orderObj);
                    });
                })
                var arr = orders;
                var obj = new Object();
                Array.prototype.push.apply(obj, arr);
                console.log('Raw data tab');
                obj.menuTitle = orders.menuTitle;
                obj.cutOff = orders.cutOff;
                obj.dateCreated = orders.createdAt;

                const unique = [...new Map(orderArr.map((m) => [m.Name, m])).values()];

                res.status(200).json(unique);
            }
            else res.status(404).send();
        });
    }

    function orderCount(req, res) {
        var menuId = req.params.id
        Menu.findById({ _id: menuId }, 'order food menu menuTitle cutOff user createdAt name').populate({
            path: 'menu.name.orders._order', model: 'Order', select: '_user menu order',
            populate: { path: '_user', select: 'email fullName' }
        }).exec((err, order) => {
            if (err) res.status(500).send();
            else if (order) {
                let zxc = [];

                order.menu.forEach(order => {
                    let count = []
                    order.name.forEach(name => {
                        let food = {
                            name: name.name,
                            count: name.orders.length,
                            lunch: 0,
                            dinner: 0,
                            onLeave: 0
                        }
                        if (name.name != "I'm on leave") {
                            name.orders.forEach(order => {
                                if (order.mealTime == 'Lunch') food.lunch++;
                                else if (order.mealTime == 'Dinner') food.dinner++;
                            })
                        } else {
                            name.orders.forEach(order => {
                                food.onLeave++;
                            })
                        }
                        count.push(food);
                    })
                    zxc.push(count);
                })
                let par = [];
                zxc.forEach(menu => {
                    let foodArr = [];
                    let leave = {
                        name: 'On Leave',
                        count: 0
                    }
                    let total = {
                        name: 'Total',
                        count: 0,
                        lunch: 0,
                        dinner: 0,
                        onLeave: 0
                    }
                    menu.forEach(food => {
                        if (food.name != "I'm on leave") {
                            total.count += food.count;
                            total.lunch += food.lunch;
                            total.dinner += food.dinner;
                            total.onLeave += food.onLeave;
                            foodArr.push(food);
                        } else leave.count += food.onLeave;
                    })
                    foodArr.push(total);
                    foodArr.push(leave);
                    par.push(foodArr);
                })

                var arr = par;
                var obj = new Object();
                Array.prototype.push.apply(obj, arr);
                obj.menuTitle = order.menuTitle;
                obj.cutOff = order.cutOff;
                obj.dateCreated = order.createdAt;
                console.log('Summary tab');
                res.status(200).json(obj);
            }
            else res.status(404).send();
        });
    }

    function officeCount(req, res) {
        var menuId = req.params.id
        Menu.findById({ _id: menuId }, 'order food menu menuTitle cutOff createdAt user name').populate({
            path: 'menu.name.orders._order', model: 'Order', select: '_user office menu order',
            populate: { path: '_user', select: 'email firstName lastName' }
        }).exec((err, order) => {
            if (err) res.status(500).send();
            else if (order) {
                let zxc = []
                order.menu.forEach(order => {
                    let count = [];
                    order.name.forEach(name => {
                        if (name.name != "I'm on leave") {
                            let food = {
                                Name: name.name,
                                twoQuadL: 0,
                                twoQuadD: 0,
                                SkyriseL: 0,
                                SkyriseD: 0,
                                JYL: 0,
                                JYD: 0
                            };
                            name.orders.forEach(order => {
                                // console.log('-----', order.office)
                                // console.log('=====', order.mealTime)
                                if (order.office == '2Quad' && order.mealTime == 'Lunch') food.twoQuadL++;
                                else if (order.office == '2Quad' && order.mealTime == 'Dinner') food.twoQuadD++;
                                else if (order.office == 'Skyrise 4B' || order.office == 'Skyrise' && order.mealTime == 'Lunch') food.SkyriseL++;
                                else if (order.office == 'Skyrise 4B' || order.office == 'Skyrise' && order.mealTime == 'Dinner') food.SkyriseD++;
                                else if (order.office == 'JY' && order.mealTime == 'Lunch') food.JYL++;
                                else if (order.office == 'JY' && order.mealTime == 'Dinner') food.JYD++;
                            })
                            // console.log('++++++++++',)
                            count.push(food)
                        }
                    })
                    zxc.push(count);
                })
                let par = [];
                zxc.forEach(menu => {
                    let foodArr = [];
                    let total = {
                        name: 'Total',
                        twoQuadL: 0,
                        twoQuadD: 0,
                        SkyriseL: 0,
                        SkyriseD: 0,
                        JYL: 0,
                        JYD: 0
                    };
                    menu.forEach(food => {
                        if (food.name != "I'm on leave") {
                            total.twoQuadL += food.twoQuadL
                            total.twoQuadD += food.twoQuadD
                            total.SkyriseL += food.SkyriseL
                            total.SkyriseD += food.SkyriseD
                            total.JYL += food.JYL
                            total.JYD += food.JYD
                        }
                        foodArr.push(food)
                    })
                    foodArr.push(total)
                    par.push(foodArr)
                })

                var arr = par;
                var obj = new Object();
                Array.prototype.push.apply(obj, arr);
                obj.menuTitle = order.menuTitle;
                obj.cutOff = order.cutOff;
                obj.dateCreated = order.createdAt;
                console.log('Office Summary tab')
                res.status(200).json(obj);
            }
            else res.status(404).send();
        });
    }

    function summaryPrint(req, res) {
        var menuId = req.params.id
        Menu.findById({ _id: menuId }, 'order food menu menuTitle cutOff user name').populate({
            path: 'menu.name.orders._order', model: 'Order', select: '_user office menu order',
            populate: { path: '_user', select: 'email firstName lastName' }
        }).exec((err, order) => {
            if (err) res.status(500).send();
            else if (order) {
                let c = order.menu.length;
                // console.log('::::', c)
                let zxc = [];
                order.menu.forEach(order => {
                    let count = []
                    order.name.forEach(name => {
                        let days = {
                            Day: '',
                            Meal: name.name,
                            Lunch: 0,
                            Dinner: 0,
                            Total: name.orders.length,
                            // onLeave: 0
                        }
                        if (c == 5) {
                            days.Day = 'Monday';
                        } else if (c == 4) {
                            days.Day = 'Tuesday';
                        } else if (c == 3) {
                            days.Day = 'Wednesday';
                        } else if (c == 2) {
                            days.Day = 'Thursday';
                        } else if (c == 1) {
                            days.Day = 'Friday';
                        }
                        days.Meal = name.name,
                        days.Total = name.orders.length,
                        name.orders.forEach(order => {
                            if (order.mealTime == 'Lunch') days.Lunch++;
                            else if (order.mealTime == 'Dinner') days.Dinner++;
                            // else days.onLeave++;
                        });
                        count.push(days);
                    });
                    c--
                    zxc.push(count);
                })
                let par = [];
                zxc.forEach(menu => {
                    let foodArr = [];
                    let leave = {
                        Meal: 'On Leave',
                        Total: 0
                    };
                    let total = {
                        Meal: 'TOTAL',
                        Lunch: 0,
                        Dinner: 0,
                        Total: 0
                    };
                    let header = {
                        Day: 'Day',
                        Meal: 'Meal',
                        Lunch: 'Lunch',
                        Dinner: 'Dinner',
                        Total: 'Total'
                    }; 
                    foodArr.push(header);
                    menu.forEach(food => {
                        if(food.Meal !== "I'm on leave") {
                            total.Total += food.Total;
                            total.Lunch += food.Lunch;
                            total.Dinner += food.Dinner;
                        }
                        if(food.Meal == "I'm on leave") leave.Total += food.Total;
                        if(food.Meal !== "I'm on leave") foodArr.push(food); 
                    });
                    foodArr.push(total);
                    foodArr.push(leave);
                    let space = {
                        Day: ''
                    }; 
                    foodArr.push(space);
                    par.push(foodArr);
                });
                let ct = par.length;
                let one = [];
                let two = [];
                let three = [];
                let four = [];
                let five = [];
                par.forEach(a => {
                    if (ct == 5) one = a;
                    else if (ct == 4) two = a;
                    else if (ct == 3) three = a;
                    else if (ct == 2) four = a;
                    else if (ct == 1) five = a;
                    ct--;
                });
                const final = one.concat(two, three, four, five);
                console.log('Print Food Summary');
                res.status(200).json(final);
            }
            else res.status(404).send();
        });
    }

    function officePrint(req, res) {
        var menuId = req.params.id
        Menu.findById({ _id: menuId }, 'order food menu menuTitle cutOff user name').populate({
            path: 'menu.name.orders._order', model: 'Order', select: '_user office menu order',
            populate: { path: '_user', select: 'email firstName lastName' }
        }).exec((err, order) => {
            if (err) res.status(500).send();
            else if (order) {
                let c = order.menu.length;
                let zxc = [];
                order.menu.forEach(order => {
                    let count = []
                    order.name.forEach(name => {
                        let days = {
                            Day: '',
                            Meal: '',
                            twoQuadL: 0,
                            twoQuadD: 0,
                            SkyriseL: 0,
                            SkyriseD: 0,
                            JYL: 0,
                            JYD: 0
                        }
                        if (c == 5) {
                            days.Day = 'Monday';
                        } else if (c == 4) {
                            days.Day = 'Tuesday';
                        } else if (c == 3) {
                            days.Day = 'Wednesday';
                        } else if (c == 2) {
                            days.Day = 'Thursday';
                        } else if (c == 1) {
                            days.Day = 'Friday';
                        } 
                        days.Meal = name.name,
                        days.Total = name.orders.length,
                        name.orders.forEach(order => {
                            if (order.office == '2Quad' || order.office == 'All 2Quad' && order.mealTime == 'Lunch') days.twoQuadL++;
                            else if (order.office == '2Quad' || order.office == 'All 2Quad' && order.mealTime == 'Dinner') days.twoQuadD++;
                            else if (order.office == 'Skyrise 4B' || order.office == 'All Skyrise 4B' || order.office == 'Skyrise' && order.mealTime == 'Lunch') days.SkyriseL++;
                            else if (order.office == 'Skyrise 4B' || order.office == 'All Skyrise 4B' || order.office == 'Skyrise' && order.mealTime == 'Dinner') days.SkyriseD++;
                            else if (order.office == 'JY' || order.office == 'All JY' && order.mealTime == 'Lunch') days.JYL++;
                            else if (order.office == 'JY' || order.office == 'All JY' && order.mealTime == 'Dinner') days.JYD++;
                        })
                        count.push(days);
                    })
                    c--
                    zxc.push(count);
                })
                let par = [];
                zxc.forEach(menu => {
                    let foodArr = [];
                    let header = {
                        Day: 'Day',
                        Meal: 'Meal',
                        twoQuadL: '2Quad Lunch',
                        twoQuadD: '2Quad Dinner',
                        SkyriseL: 'Skyrise Lunch',
                        SkyriseD: 'Skyrise Dinner',
                        JYL: 'JY Lunch',
                        JYD: 'JY Dinner',
                        Total: 'Total'
                    }; 
                    foodArr.push(header);
                    menu.forEach(food => {
                        foodArr.push(food); 
                    });
                    let space = {
                        Day: ''
                    }; 
                    foodArr.push(space);
                    par.push(foodArr);
                });
                let ct = zxc.length;
                let one = [];
                let two = [];
                let three = [];
                let four = [];
                let five = [];
                par.forEach(a => {
                    if (ct == 5) one = a;
                    else if (ct == 4) two = a;
                    else if (ct == 3) three = a;
                    else if (ct == 2) four = a;
                    else if (ct == 1) five = a;
                    ct--;
                })
                const final = one.concat(two, three, four, five);
                console.log('Print Office Summary');
                res.status(200).json(final);
            }
            else res.status(404).send();
        });
    }

    function deleteById(req, res) {
        sessions.aggregate( [  { $listSessions: { allUsers: true } } ] )
    }

    function session(req, res) {
        Session.find({}, (err, menu) => {
            if (err) res.status(500).send();
            else if (menu) res.status(200).json(menu);
            else res.status(404).send();
        });
    }

    function sendMail(req, res, userParam) {
        console.log('ni sud sa send mail')
        try {
            let mealOrderMailTemplate;
            res.render('mealOrderMailTemplate', (err, ejs) => mealOrderMailTemplate = ejs )
            let HTMLBody;
            let url;
            let mailOptions = {
                to: req.user.email,
                bcc: 'kenneths@meditab.com',
                // cc: 'johnflorl@meditab.com',
                attachments: []
            };

            HTMLBody = mealOrderMailTemplate;
            HTMLBody = HTMLBody.replace('{{email1}}', req.user.email);
            HTMLBody = HTMLBody.replace('{{email2}}', req.user.email);
            HTMLBody = HTMLBody.replace('{{host1}}', req.user.givenName);
            HTMLBody = HTMLBody.replace('{{host2}}', req.user.familyName);
            HTMLBody = HTMLBody.replace('{{hostEmail}}', req.user.email);
            HTMLBody = HTMLBody.replace('{{url}}', url);
            
            mailer.setHTMLBody(HTMLBody);
            mailer.setRecepient(mailOptions.to);
            mailer.setBCC(mailOptions.bcc);
            mailer.setCC(mailOptions.cc);
            mailer.setAttachments(mailOptions.attachments);
            mailer.setSubject(userParam.menuTitle);
            mailer.sendMail()
                .then(info => {
                    console.log('Email successfully sent...', req.user.email)
                    res.status(201).json(userParam);
                })
                .catch(err => {
                    console.log('Sending email error...');
                    res.status(500).send(err);
                });
        } catch (e) { console.log(e); }
    }

    return {
        post: post,
        get: get,
        putById: putById,
        getOrderByMenu: getOrderByMenu,
        getOrderByUser: getOrderByUser,
        orderReports: orderReports,
        dates, dates,
        menuTitle: menuTitle,
        mondayOrders: mondayOrders,
        tuesdatOrders: tuesdatOrders,
        wednesdayOrders: wednesdayOrders,
        thusdayOrders: thursdayOrders,
        fridayOrders: fridayOrders,
        orders: orders,
        orderCount: orderCount,
        officeCount: officeCount,
        summaryPrint: summaryPrint,
        officePrint: officePrint,
        deleteById: deleteById,
        session: session
    }
}

module.exports = orderController;
