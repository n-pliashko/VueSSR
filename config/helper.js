export const reverseRouteName = function (str) {
  let replaceCharacters = {
    'Ä': 'Ae',
    'Ö': 'Oe',
    'ä': 'ae',
    'è': 'e',
    'é': 'e',
    'ö': 'oe',
    'ü': 'ue',
    'Ü': 'Ue',
    'ß': 'ss'
  }
  if (str && str.length > 0) {
    for (let key in replaceCharacters) {
      if (replaceCharacters.hasOwnProperty(key)) {
        let re = new RegExp(key, 'g')
        str = str.replace(re, replaceCharacters[key])
      }
    }

    let name = str.replace(/\(|\)/g, '')
    name = name.replace(/([^a-zA-Z0-9]+)|(\s+)/gi, '-')
    name = name.replace(/(&|&amp;)/gi, '-and-')
    name = name.replace('/(-+)/g', '-').toLowerCase()
    return name
  }
  return str
}

export const parseQueryString = function (queryString) {
  let params = {}
  let queries, temp, i, l
  queries = queryString.split('&')
  for (i = 0, l = queries.length; i < l; i++) {
    temp = queries[i].split('=')
    if (temp.length > 1) {
      let key = decodeURIComponent(temp[0])
      params[key] = []
      if (temp[1].indexOf(',') !== -1) {
        temp[1].split(',').forEach(val => {
          params[key].push(val.trim())
        })
      } else {
        params[key] = temp[1]
      }
    }
  }
  return params
}

export const array_intersect = function (array1, array2) {
  return array1.filter((obj) => array2.indexOf(obj.id) !== -1)
}

export const arrayToObject = (array) =>
  array.reduce((obj, item, index) => {
    obj[index] = item
    return obj
  }, {})

export const getSearchString = function (filter, withSign = true) {
  let params = []
  for (let key in filter) {
    let values = Array.isArray(filter[key]) ? filter[key].join(',') : filter[key]
    if (values.length !== 0) {
      params.push(decodeURIComponent(key) + '=' + values)
    }
  }
  return (params.length > 0 ? (withSign ? '?' : '') + params.join('&') : '')
}

export const addSlashes = function (str) {
  return str.replace(/[\\"'\[\]]/g, '\\$&')
}
