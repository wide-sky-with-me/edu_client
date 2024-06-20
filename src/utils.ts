/**
* 定义一些通用的函数
*/

// 该方法对一个具体格式的数据进行一个处理，得到对象，用于类案检索以及罪名预测
const getResultObject = function (resultStr: string) {
  // console.log('原始字符串: ', resultStr)
  let str = resultStr.replaceAll('-', ' ')
  // console.log('去除短横线后的字符串: ', str)
  str = str.replaceAll(' ', '')
  // console.log('去除空格后的字符串: ', str)
  let resultArr: string[] = str.split('\n')
  resultArr = resultArr.filter(item => {
    return item !== ''
  })
  // console.log('分割后的字符串: ', resultArr)
  let resultObj = {
    time: '',
    location: '',
    character: '',
    eventHistory: '',
    result: ''
  }
  resultArr.forEach(item => {
    let itemArr = item.split('：')
    switch (itemArr[0]) {
      case '时间':
        resultObj.time = itemArr[1]
        break
      case '地点':
        resultObj.location = itemArr[1]
        break
      case '人物':
        resultObj.character = itemArr[1]
        break
      case '事件经过':
        resultObj.eventHistory = itemArr[1]
        break
      case '结果':
        resultObj.result = itemArr[1]
        break
    }
  })
  // console.log('最后返回的结果: ', resultObj)
  return resultObj
}

// 对一个具体格式的数据进行处理，得到对象，用于司法摘要
const getResultObject02 = function (resultStr: string) {
  // console.log('原始字符串: ', resultStr)
  let str = resultStr.replaceAll('-', ' ')
  // console.log('去除短横线后的字符串: ', str)
  str = str.replaceAll(' ', '')
  // console.log('去除空格后的字符串: ', str)
  let resultArr: string[] = str.split('\n')
  resultArr = resultArr.filter(item => {
    return item !== ''
  })
  // console.log('分割后的字符串: ', resultArr)
  let resultObj = {
    defendant: '',
    criminalAct: '',
    groundOfDecision: '',
    charge: '',
    penalty: ''
  }
  for (var i = 1; i < resultArr.length - 1; i++) {
    resultArr[i] = resultArr[i].replaceAll(',', '')
    resultArr[i] = resultArr[i].replaceAll('”', '')
    let itemArr = resultArr[i].split(':')
    switch (itemArr[0]) {
      case '被告人':
        resultObj.defendant = itemArr[1]
        break
      case '犯罪行为':
        resultObj.criminalAct = itemArr[1]
        break
      case '判决依据':
        resultObj.groundOfDecision = itemArr[1]
        break
      case '罪名':
        resultObj.charge = itemArr[1]
        break
      case '刑罚':
        resultObj.penalty = itemArr[1]
        break
    }
  }
  console.log('最后返回的结果: ', resultObj)
  return resultObj
}

// 中文数字转换为阿拉伯数字
const toArabicNum = function (str: string) {
  let res: number = 0
  switch (str) {
    case '一':
      res = 1
      break
    case '二':
      res = 2
      break
    case '三':
      res = 3
    break
    case '四':
      res = 4
    break
    case '五':
      res = 5
    break
    case '六':
      res = 6
      break
    case '七':
      res = 7
    break
    case '八':
      res = 8
    break
    case '九':
      res = 9
      break
    default:
      res = -1
  }
  return res
}
interface LegalProvisions{
  label: string;
}
// 排序法条
const sortLegalProvisions = function (objArr: LegalProvisions[]) {
  let numArr: number[] = []
  for (var i = 0; i < objArr.length; i++) {
    let number: number = 0
    let str: string = objArr[i].label.substring(1, objArr[i].label.length - 1)
    let stack: number[] = []
    for (var j = 0; j < str.length; j++) {
      let num: number = toArabicNum(str.charAt(j))
      if (num !== -1) {
        stack.push(num)
      }
    }
    for (var j = stack.length - 1, k = 1; j >= 0; j--) {
      number = number + stack[j] * k
      k = k * 10
    }
    numArr.push(number)
  }
  // 冒泡排序
  for (let i = 0; i < numArr.length; i++) {
    for (let j = 0; j < numArr.length - i - 1; j++) {
      if (numArr[j] > numArr[j + 1]) {
        let temp01 = numArr[j];
        numArr[j] = numArr[j + 1];
        numArr[j + 1] = temp01;
        let temp02 = objArr[j];
        objArr[j] = objArr[j + 1];
        objArr[j + 1] = temp02;
      }
    }
  }
}

export { getResultObject, getResultObject02, sortLegalProvisions }