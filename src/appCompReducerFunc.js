import { dispatchActions, popuparray_keys, reducerState_keys, reducerState_posibleValues } from "./objectModels";

export default function reducer(state, input) {
  // apparently the state in the reducer function is also need to be treated as immutable just like useState
  // my solution will be to not put functions or anything other than  primitive data in this reducer so i can
  // use json.stringify/parse combo to deep copy the state
  let toreturn
  try {
    toreturn = JSON.parse(JSON.stringify(state))
  } catch (error) {
    console.log(error.message)
    throw new Error('reducer function: fail to deep copy the state using JSON')
  }


  const isNotLoginRelated = Object.keys(dispatchActions.loginrelated).every(function(key, i) {
    if(key === input.action) {
      toreturn[reducerState_keys.loginState] = key
      // manage when to render navigation:
      // if loginstate not init and not initfail:
      if(key !== dispatchActions.loginrelated.init && key !== dispatchActions.loginrelated.initfail) {
        // if loginstate logged in: show navigation "loggedin"
        if(key === dispatchActions.loginrelated.logged_in || key === dispatchActions.loginrelated.logging_out) {
          toreturn[reducerState_keys.showNav] = reducerState_posibleValues.showNav.loggedin
        } else {
          // else mean user logged out
          // show navigation logged out user
          toreturn[reducerState_keys.showNav] = reducerState_posibleValues.showNav.loggedout
        }
      } else {
        // else mean loginstate is init / initfail
        toreturn[reducerState_keys.showNav] = reducerState_posibleValues.showNav.init
      }
      return false
    } else return true
  })


  function showpopup() {toreturn[reducerState_keys.popuparr].push(input.value)}
  function close_current_popup() {toreturn[reducerState_keys.popuparr].shift()}
  switch (input.action) {
    case dispatchActions.loginrelated.init:
      // popuparr is not needed because its already in the initial value of reducer state
      break;
    case dispatchActions.loginrelated.initfail:
    case dispatchActions.loginrelated.initerr:
      showpopup()
      break;
    case dispatchActions.loginrelated.logging_in:
      toreturn[reducerState_keys.logininputvalues] = input.value
      break;
      case dispatchActions.loginrelated.logging_fail:
        // logging fail show error under the input, not using popup
        toreturn[reducerState_keys.loginFailInfo] = input.value
        break;
    case dispatchActions.loginrelated.logged_in:
      close_current_popup()
      toreturn[reducerState_keys.userdata] = input.value
      break;
    case dispatchActions.loginrelated.logging_out:
      showpopup()
      break;
    case dispatchActions.loginrelated.logged_out:
      close_current_popup()
      break;

    case dispatchActions.changeUserImage:
      toreturn[reducerState_keys.userdata][reducerState_keys.userdata_keys.profilepic] = input.value
      toreturn[reducerState_keys.showNav] = reducerState_posibleValues.showNav.changepp
      break;
    case dispatchActions.changeUserDesc:
      // popuparr but different / before this
      toreturn[reducerState_keys.userdata][reducerState_keys.userdata_keys.userdesc] = input.value
      break;
    case dispatchActions.close_current_popup:
      close_current_popup()
      break;
    case dispatchActions.profilefailupdateimage_popup:
    case dispatchActions.profileuserdesc_popup:
      showpopup()
      break;
  
    default:
      return toreturn
  }



  return toreturn
}