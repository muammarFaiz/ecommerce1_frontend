import { useEffect, useReducer, useRef, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import './App.css'
import Navigation from './childs/navigation/navigation'
import Popup from './childs/popup/popup'
import myfetch from './fetch_config'
import { popuparray_keys, appjs_possible_popups, dispatchActions, reducerState_keys, reducerState_posibleValues,
  resizeimg } from './objectModels'
import { appContext } from './appcontext'
import reducer from './appCompReducerFunc'
import defaultprofilepic from './assets/defaultprofilepic.png'


// being as specific as you can will make the code more readable


function App() {
  const [state, dispatch] = useReducer(reducer, {
    loginState: dispatchActions.loginrelated.init,
    userdata: '',
    logininputvalues: '',
    loginFailInfo: '',
    showNav: reducerState_posibleValues.showNav.init,
    popuparr: [{[popuparray_keys.children]: 'Verifying user...'}]
  })
  // beta.reactjs.org: "useRef is a React Hook that lets you reference a value that’s not needed for rendering."
  const memory1 = useRef({
    loginfail: '',
    componentForPopup: null,
  })
  // const [popuparray, setPopuparray] = useState([])
  // const [loginState, setLoginState] = useState({[userLoginStates_objkeys.init]: true})
  const navigate = useNavigate()

  // function add_popup(popup_options) {setPopuparray(function(prevArr1) {return [...prevArr1, popup_options]})}
  function add_popup(popup_options) {return ''}
  function close_current_popup() {dispatch({action: dispatchActions.close_current_popup})}

  useEffect(function () {
    // if(loginState[userLoginStates_objkeys.init]) {
    //   init()
    // } else if(loginState[userLoginStates_objkeys.logging_in]) {
    //   loggingin()
    // } else if(loginState[userLoginStates_objkeys.logging_out]) {
    //   loggingout()
    // }
    if(state[reducerState_keys.loginState] === dispatchActions.loginrelated.init) {
      init()
    } else if(state[reducerState_keys.loginState] === dispatchActions.loginrelated.logging_in) {
      loggingin()
    } else if(state[reducerState_keys.loginState] === dispatchActions.loginrelated.logging_out) {
      loggingout()
    }
    // but i need to figure out if there is a way to make not double re-render every dispatch update?
    // double re-render caused by popup setup in this useeffect. (fixed)

    async function init() {
      try {
        // this should i remove the popup aray state? no, its going to be too many if else in popup if i don't use
        // the array
        // add_popup({[popuparray_keys.children]: appjs_possible_popups.verifyinguser})
        const resultjson = await myfetch({method: 'GET', route: '/protected/profileinit'})
        // close_current_popup()
        // dispatch({action: dispatchActions.close_current_popup})
        if (resultjson.result === undefined) {

          if(resultjson.fail !== 'jwt not found or too short') {
            // add_popup({
            //   [popuparray_keys.notif]: true,
            //   [popuparray_keys.children]: appjs_possible_popups.fail_retreiveinfo,
            //   [popuparray_keys.cbok]: close_current_popup
            // })
            // setLoginState({[userLoginStates_objkeys.initfail]: true})
            dispatch({
              action: dispatchActions.loginrelated.initfail,
              value: {
                [popuparray_keys.notif]: true,
                [popuparray_keys.children]: appjs_possible_popups.fail_retreiveinfo,
                [popuparray_keys.cbok]: close_current_popup
              }
            })
          } else {
            // setLoginState({[userLoginStates_objkeys.logged_out]: true})
            dispatch({action: dispatchActions.loginrelated.logged_out})
          }
        } else {
          // const logged_in_keys = userLoginStates_objkeys.logged_in_keys
          // setLoginState({[userLoginStates_objkeys.logged_in]: {
          //   [logged_in_keys.profilepic]: fetchresult.profilePicture,
          //   [logged_in_keys.username]: fetchresult.username,
          //   [logged_in_keys.userdesc]: fetchresult.userDescription
          // }})
          const fetchresult = resultjson.result
          // const shrinkedimg = await resizeimg(fetchresult.profilePicture, document, defaultprofilepic)
          dispatch({
            action: dispatchActions.loginrelated.logged_in,
            value: {
              [reducerState_keys.userdata_keys.profilepic]: fetchresult.profilePicture,
              [reducerState_keys.userdata_keys.username]: fetchresult.username,
              [reducerState_keys.userdata_keys.userdesc]: fetchresult.userDescription,
              // [reducerState_keys.userdata_keys.shrinkedImg]: shrinkedimg,
            }
          })
        }
      } catch (error) {
        console.log(error)
        // setLoginState({[userLoginStates_objkeys.initfail]: true})
        let faildesc;
        if(error === 'error shrink') faildesc = 'fail to display user profile picture in navigation'
        else faildesc = `${appjs_possible_popups.error_retreiveinfo}: ${error.message}`
        dispatch({
          action: dispatchActions.loginrelated.initerr,
          value: {
            [popuparray_keys.notif]: true,
            [popuparray_keys.children]: faildesc,
            [popuparray_keys.cbok]: close_current_popup
          }
        })
        // add_popup({
        //   [popuparray_keys.notif]: true,
        //   [popuparray_keys.children]: faildesc,
        //   [popuparray_keys.cbok]: close_current_popup
        // })
      }
    }
    async function loggingin() {
      try {
        const result = await myfetch({
          method: 'POST',
          route: '/login',
          body: {
            // username: loginState[userLoginStates_objkeys.logging_in][logging_in_keys.username],
            // password: loginState[userLoginStates_objkeys.logging_in][logging_in_keys.password],
            username: state[reducerState_keys.logininputvalues][reducerState_keys.logininputvalues_keys.username],
            password: state[reducerState_keys.logininputvalues][reducerState_keys.logininputvalues_keys.password],
          }
        })
        if (!result.result) {
          dispatch({
            action: dispatchActions.loginrelated.logging_fail,
            value: result.error || result.fail || JSON.stringify(result)
          })
        } else {
          localStorage.setItem('usertoken', result.result.token)
          // const userinfo = userLoginStates_objkeys.logged_in_keys
          // setLoginState({[userLoginStates_objkeys.logged_in]: {
          //   [userinfo.profilepic]: result.result.profilePicture,
          //   [userinfo.username]: result.result.username,
          //   [userinfo.userdesc]: result.result.userDescription
          // }})
          
          // const shrinkedimg = await resizeimg(result.result.profilePicture, document, defaultprofilepic)
          dispatch({
            action: dispatchActions.loginrelated.logged_in,
            value: {
              [reducerState_keys.userdata_keys.profilepic]: result.result.profilePicture,
              [reducerState_keys.userdata_keys.username]: result.result.username,
              [reducerState_keys.userdata_keys.userdesc]: result.result.userDescription,
              // [reducerState_keys.userdata_keys.shrinkedImg]: shrinkedimg,
            }
          })
          navigate('/')
        }
      } catch (error) {
        let message;
        if(error === 'error shrink') message = 'fail to display user profile picture in navigation'
        else message = error.message
        dispatch({
          action: dispatchActions.loginrelated.logging_err,
          value: {
            [popuparray_keys.children]: message,
            [popuparray_keys.notif]: true,
            [popuparray_keys.cbok]: close_current_popup,
          }
        })
        // add_popup({
        //   [popuparray_keys.children]: message,
        //   [popuparray_keys.notif]: true,
        //   [popuparray_keys.cbok]: close_current_popup,
        // })
      }
    }
    async function loggingout() {
      // add_popup({ [popuparray_keys.children]: 'Loging out...' })
      const logoutresult = await myfetch({method: 'GET', route: '/protected/logout'})
      // close_current_popup()
      localStorage.removeItem('usertoken')
      // dispatch and navigate each cause one extra re-render, not in order i would expect
      dispatch({action: dispatchActions.loginrelated.logged_out})
      navigate('/')
    }
  }, [state[reducerState_keys.loginState]])


  return (
    <appContext.Provider value={{
      memory1: memory1,
      // fix later:
      popuparray_func: [add_popup, close_current_popup],
      // popuparray: [popuparray, setPopuparray],
      // loginstate: [loginState, setLoginState],
      mainreducer: [state, dispatch],
    }}>
      <div className="App">
        <Popup />
        <Navigation />
        <Link to={'register'}>to register</Link><hr />
        <Link to={'login'}>to login</Link><hr />

        <Outlet />
      </div>
    </appContext.Provider>
  )
}

export default App