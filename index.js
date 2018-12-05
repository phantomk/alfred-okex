const alfy = require('alfy');
const pako = require('pako')
const WebSocket = require('ws')
const symbol = alfy.input;
const symbol_plist = [
  'eth',
  'btc',
  'eos'
];

try {
  // TODO: 添加输入延迟处理
  if (symbol_plist.indexOf(symbol) < 0) {
    throw new Error('未发现交易对')
  }

  const ws = new WebSocket('wss://okexcomreal.bafang.com:10440/ws/v1');
  ws.on('open', () => {
    ws.send(`{"channel":"ok_sub_futureusd_${symbol}_ticker_this_week","event":"addChannel"}`)
  })

  let cnt = 0;
  ws.on('message', data => {
    if (data instanceof String) {

    } else {
      try {
        data = (JSON.parse(pako.inflateRaw(data, {
          to: 'string'
        })))[0].data;

        const items = [{
          title: `${symbol} 季度交割合约`,
          subtitle: `最新价: ${data.last} 最高价: ${data.high} 最低价: ${data.low} 交易量: ${data.vol}`,
          arg: data.vol,
          text: '季度'
        }];

        cnt += 1;
        if (cnt == 2) {
          alfy.output(items);
          process.exit();
        }
      } catch (err) {
        throw err;
      }
    }
  })
} catch (err) {
  alfy.error(err);
  process.exit();
}