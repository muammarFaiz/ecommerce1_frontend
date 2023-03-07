export const appjs_possible_popups = {
  verifyinguser: 'Verifying user...',
  fail_retreiveinfo: 'fail retreiving info',
  error_retreiveinfo: 'error retreiving info'
}
export const popuparray_keys = {
  notif: 'notif',
  children: 'children',
  option: 'option',
  cbyes: 'cbyes',
  cbno: 'cbno',
  cbok: 'cbok'
}
export const index_popupstate = {popuparray: 0, setPopuparray: 1}
export const appcontext_keys = {
  memory1: 'memory1',
  memory1_current_keys: {
    loginCredentials: 'loginCredentials',
  },
  loginCredentials_keys: {
    username: 'username',
    password: 'password'
  },
  popuparray: 'popuparray',
  display: 'display',
  popuparray_func: 'popuparray_func',
  popuparray_itemindex: {popuparray: 0, setPopuparray: 1},
  // loginstate: 'loginstate',
  // loginstate_itemindex: {loginState: 0, setLoginState: 1},
  mainreducer: 'mainreducer',
}
export const dispatchActions = {
  loginrelated: {
    init: 'init',
    initfail: 'initfail',
    initerr: 'initerr',
    logging_in: 'logging_in',
    logging_fail: 'logging_fail',
    logging_err: 'logging_err',
    logged_in: 'logged_in',
    logging_out: 'logging_out',
    logged_out: 'logged_out',
  },
  changeUserImage: 'changeUserImage',
  changeUserDesc: 'changeUserDesc',
  close_current_popup: 'close_current_popup',
  profileuserdesc_popup: 'profileuserdesc_popup',
  profilefailupdateimage_popup: 'profilefailupdateimage_popup',
}
export const reducerState_keys = {
  loginState: 'loginState',
  userdata: 'userdata',
  userdata_keys: {
    profilepic: 'profilepic',
    username: 'username',
    userdesc: 'userdesc',
    // shrinkedImg: 'shrinkedImg',
  },
  logininputvalues: 'logininputvalues',
  logininputvalues_keys: {
    username: 'username',
    password: 'password'
  },
  loginFailInfo: 'loginFailInfo',
  showNav: 'showNav',
  popuparr: 'popuparr'
}
export const reducerState_posibleValues = {
  showNav: {
    init: 'init',
    loggedin: 'loggedin',
    loggedout: 'loggedout',
    changepp: 'changepp',
  },
}
// shrink image
export function resizeimg(profilepic, document, defaultprofilepic) {
  return new Promise(function (resolve, reject) {
    try {
      const imgsrcIsDefault = !profilepic || profilepic === 'default' || profilepic === 'fail'
      if (profilepic !== '') {
        const img = document.createElement('img')
        img.src = imgsrcIsDefault ? defaultprofilepic : profilepic
        img.onload = function () {
          const canvas = document.createElement('canvas')
          canvas.height = 100
          canvas.width = 100
          const ctx = canvas.getContext('2d')
          const imgSizeDivider = imgsrcIsDefault ? 1 : 2.5
          function centerimg(imgwh, canvaswh) {
            const gap = (imgwh / imgSizeDivider) - canvaswh
            return gap / -2
          }
          ctx.drawImage(
            img,
            centerimg(img.width, canvas.width),
            centerimg(img.height, canvas.height),
            img.width / imgSizeDivider,
            img.height / imgSizeDivider
          )
          // setResized_img(canvas.toDataURL())
          resolve(canvas.toDataURL())
        }
      }
    } catch (error) {
      console.log(error)
      reject('error shrink')
    }
  })
}