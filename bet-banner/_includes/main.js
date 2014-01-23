/*jslint browser: true, devel: true*/

var oponent = function (name) {
        'use strict';

        var that = {},
            get_name = function () {
                return name;
            };
        that.get_name = get_name;
        return that;
    },

    bet = function (match) {
        'use strict';
        var that = {},
            factorTable = {
                'Hertha BSC - Eintracht Frankfurt': {
                    '1': 2.25,
                    'X': 3.40,
                    '2': 3
                }
            },
            amount = 0,
            result = 0,

            get_amount = function () {
                return amount;
            },

            get_match = function () {
                return match;
            },

            get_result = function () {
                return result;
            },

            set_amount = function (a) {
                amount = a;
            },

            set_result = function (r) {
                result = r;
            },

            factor_for_result = function (result) {
                var factors = factorTable[match.get_title()];
                return factors[result];
            },

            estimate = function () {
                if (!result || !amount) {
                    return 0;
                }

                return amount * factor_for_result(result);
            };

        that.get_amount = get_amount;
        that.set_amount = set_amount;
        that.get_match = get_match;
        that.get_result = get_result;
        that.set_result = set_result;
        that.factor_for_result = factor_for_result;
        that.estimate = estimate;

        return that;
    },

    match = function (oponent1, oponent2) {
        'use strict';

        var that = {},
            get_title = function () {
                return oponent1.get_name() + ' - ' + oponent2.get_name();
            };

        that.get_title = get_title;
        return that;
    },

    betView = function(bet) {
        'use strict';

        var that = {},
            set_bet = function (b) {
                bet = b;
            },
            matchEl = document.getElementById('match'),
            current1El = document.getElementById('current1'),
            currentXEl = document.getElementById('currentX'),
            current2El = document.getElementById('current2'),
            amountEl = document.getElementById('amount'),
            estimateEl = document.getElementById('estimate'),
            radio1El = document.getElementById('radio-1'),
            radioXEl = document.getElementById('radio-x'),
            radio2El = document.getElementById('radio-2'),

            set_delegate = function(d) {
                amountEl.addEventListener('change', d.amount_did_change);
                radio1El.addEventListener('change', d.result_did_change);
                radioXEl.addEventListener('change', d.result_did_change);
                radio2El.addEventListener('change', d.result_did_change);
            },

            reload_data = function () {
                matchEl.innerHTML = bet.get_match().get_title();
                current1El.innerHTML = bet.factor_for_result('1');
                currentXEl.innerHTML = bet.factor_for_result('X');
                current2El.innerHTML = bet.factor_for_result('2');
                amountEl.value = bet.get_amount();
                estimateEl.innerHTML = bet.estimate();
            };

        that.set_match = set_bet;
        that.reload_data = reload_data;
        that.set_delegate = set_delegate;

        return that;
    };

window.addEventListener("load", function () {
    'use strict';
    var hertha = oponent('Hertha BSC'),
        frankfurt = oponent('Eintracht Frankfurt'),
        myMatch = match(hertha, frankfurt),
        myBet = bet(myMatch),
        myView = betView(myBet);

    myView.set_delegate({
        amount_did_change: function (event) {
            myBet.set_amount(event.target.value);
            myView.reload_data();
        },

        result_did_change: function (event) {
            console.log('result_did_change to', event.target.value);
            myBet.set_result(event.target.value);
            myView.reload_data();
        },
    });

    myBet.set_amount(10);
    myView.reload_data();
});