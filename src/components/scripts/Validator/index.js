export default class Validator {
  constructor (name) {
    this.name = name
  }

  goto (item) {
    let i, el, fields
    if (!item || !(item instanceof Object) || !((fields = Object.keys(item)) && fields.length > 0)) {
      return false
    }

    for (i = 0; i < fields.length; i++) {
      if (!(item[fields[i]] instanceof String) && !(item[fields[i]][0] instanceof String)) {
        if (this.goto(item[fields[i]])) {
          return true
        }
      }

      el = global.document.querySelector('[name="' + fields[i] + '"]')
      if (!el) {
        continue
      }
      el.focus()
      return true
    }

    return false
  }

  prepare (state) {
    const meta = {
      formError: (state.formMeta[this.name] && state.formMeta[this.name].formError || []),
      formSuccess: (state.formMeta[this.name] && state.formMeta[this.name].formSuccess || undefined)
    }

    if (meta.formError.length) {
      meta.formSuccess = undefined
    }

    const result = {
      formError: {},
      formSuccess: meta.formSuccess
    }

    function check (item) {
      if (item instanceof Array && (item.length === 1) && (typeof item[0] === 'string')) {
        return item[0]
      } else if (item instanceof Array) {
        for (let i = 0; i < item.length; ++i) {
          item[i] = check(item[i])
        }
      } else if (item instanceof Object) {
        Object.keys(item).map(key => {
          item[key] = check(item[key])
        })
      }
      return item
    }

    meta.formError.map(item => {
      result.formError[item.field] = check(item.message)
    })

    return result
  }
}
