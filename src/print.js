const Table = require('cli-table');
const chalk = require('chalk');
const { formatCurrency, roundNumber } = require('./formatter');
const config = require('./config.json');
const babar = require('babar');

var printTable = function (data, watch, activeCoin = 0, timestamp = '', clearConsole = false) {
    const table = new Table({
        head: [
            chalk[config.colors.table_head]('Name'),
            chalk[config.colors.table_head]('Market Cap'),
            chalk[config.colors.table_head]('Price Change'),
            chalk[config.colors.table_head]('Current Price'),
            chalk[config.colors.table_head]('24h High'),
            chalk[config.colors.table_head]('24h Low')
        ]
    });
    var counter = 0;
    data.map(it => {
        table.push([
            (counter === activeCoin && watch !== undefined) ? chalk[config.colors.table_active_coin].black(it.localization[config.global.localization]) : it.localization[config.global.localization],
            formatCurrency(it.market_data.market_cap[config.global.currency]),
            it.market_data.price_change_percentage_24h < 0 ? chalk[config.colors.table_negative](roundNumber(it.market_data.price_change_percentage_24h) + "%"): chalk[config.colors.table_positive](roundNumber(it.market_data.price_change_percentage_24h)  + "%"),
            '$' + (it.market_data.current_price[config.global.currency]),
            '$' + (it.market_data.high_24h[config.global.currency]),
            '$' + (it.market_data.low_24h[config.global.currency])
        ])
        counter++
    })

    if(clearConsole) console.clear()

    if(timestamp !== ''){
        console.log('')
        console.log('Last updated: ' + timestamp)
    }
    console.log(table.toString())
}

var printChart = ((data, coinId, watch) => {
    if (watch !== undefined)
        console.clear()
    console.log(babar(data, {
        color: config.colors.chart,
        height: 10,
        caption: coinId
    }));
    if (watch !== undefined)
        console.log(' ' + chalk[config.colors.table_active_coin].black('Return'))
})

var printTime = (() => {
    var timestamp = getTime()
    console.log('')
    console.log(chalk.bold(' Last update:'), timestamp)
})

var getTime = (() => {
    var today = new Date();
    var year = today.getFullYear()
    var month = today.getMonth() < 10 ? '0' + today.getMonth() : today.getMonth()
    var day = today.getDay() < 10 ? '0' + today.getDay() : today.getDay()
    var hours = today.getHours() < 10 ? '0' + today.getHours() : today.getHours()
    var minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
    var seconds = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds()
    return (year + '-' + month + '-' + day + ' ' + hours + ":" + minutes + ":" + seconds)
})


module.exports = {
    printTable, printChart, getTime, printTime
};