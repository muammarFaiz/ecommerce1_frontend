import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appContext } from "../../appcontext";
import { appcontext_keys, dispatchActions, reducerState_keys } from "../../objectModels";


export default function Login(props) {
  const usernameInput = useRef()
  const passwordInput = useRef()
  const [submitFailInfo, setSubmitFailInfo] = useState('')
  // const [buttonInnerText, setButtonInnerText] = useState('Submit')
  // const [buttonDisable, setButtonDisable] = useState(false)
  const navigate = useNavigate()
  const maincontext = useContext(appContext)
  const memory1 = maincontext.memory1
  // const [loginstate, setLoginState] = maincontext[appcontext_keys.loginstate]
  const [state, dispatch] = maincontext[appcontext_keys.mainreducer]

  // async function handleFormSubmit(ev) {
  //   ev.preventDefault()
  //   if(!buttonDisable) {
  //     setButtonDisable(true)
  //     setButtonInnerText('Loading...')
  //     const result = await myfetch({
  //       method: 'POST',
  //       route: '/login',
  //       body: { username: usernameInput.current.value, password: passwordInput.current.value }
  //     })
  //     if (result.fail !== undefined || result.error !== undefined) {
  //       setSubmitFailInfo(result.fail || result.error)
  //       setButtonDisable(false)
  //       setButtonInnerText('Submit')
  //     } else {
  //       localStorage.setItem('usertoken', result.result.token)
  //       memory1.current.userinfo = {
  //         username: result.result.username,
  //         userdesc: result.result.userDescription,
  //         profilepic: result.result.profilePicture,
  //         login: true
  //       }
  //       navigate('/')
  //     }
  //   }
  // }

  function handleFormSubmit(val) {
    val.preventDefault()
    // const loginkeys = userLoginStates_objkeys.logging_in_keys
    // setLoginState({[userLoginStates_objkeys.logging_in]: {
    //   [loginkeys.username]: usernameInput.current.value,
    //   [loginkeys.password]: passwordInput.current.value
    // }})
    dispatch({
      action: dispatchActions.loginrelated.logging_in,
      value: {
        [reducerState_keys.logininputvalues_keys.username]: usernameInput.current.value,
        [reducerState_keys.logininputvalues_keys.password]: passwordInput.current.value,
      }
    })
  }
  function buttondisable() {
    // if(loginstate[userLoginStates_objkeys.logging_in]) return true
    if(state[reducerState_keys.loginState] === dispatchActions.loginrelated.logging_in) return true
    return false
  }
  function buttonInnerText() {
    // if(loginstate[userLoginStates_objkeys.logging_in]) return 'Loading...'
    if(state[reducerState_keys.loginState] === dispatchActions.loginrelated.logging_in) return 'Loading...'
    return 'Submit'
  }
  function failDesc() {
    // if(loginstate[userLoginStates_objkeys.login_fail]) return loginstate[userLoginStates_objkeys.login_fail]
    if(state[reducerState_keys.loginState] === dispatchActions.loginrelated.logging_fail) {
      return state[reducerState_keys.loginFailInfo]
    }
    return ''
  }
  return (
    <>
      <p>this is login</p>
      <form method="post" onSubmit={handleFormSubmit}>
        <input type="text" name="username" placeholder="username" autoFocus ref={usernameInput} />
        <input type="text" name="password" placeholder="password" ref={passwordInput} />
        <button type="submit" disabled={buttondisable()}>{buttonInnerText()}</button>
      </form>
      <p>{failDesc()}</p>
    </>
  )
}