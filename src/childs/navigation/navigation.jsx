import { memo, useContext, useEffect, useMemo, useState } from 'react'
import { appContext } from '../../appcontext'
import './navigation.css'
import { appcontext_keys, dispatchActions, reducerState_keys, reducerState_posibleValues } from '../../objectModels'
import { Link } from 'react-router-dom'
// import myfetch from '../../fetch_config'
import Navrightside from './nav_rightside/navrightside'

export default function Navigation(props) {
  // const [logingout, setLogingout] = useState(false)
  // const [userdata, setUserdata] = useState('init')
  const maincontext = useContext(appContext)
  // const [loginstate, setloginstate] = maincontext[appcontext_keys.loginstate]
  const [state, dispatch] = maincontext[appcontext_keys.mainreducer]
  // don't get confused: we can actually update the value of the fields inside profilepic
  // (but not the profilepic itself because it is defined as const) which lead the ref state in
  // App component named memory1 to updates the same thing.
  // only in Navigation react component and not in Inner component. because the Inner comp receive the
  // profilepic as props while Navigation comp receive the ref directly from useContext.
  // REACT BASIC: quoted from //reactjs.org: "All React components must act like pure functions with
  // respect to their props." in other words: the props are read only.

  // useEffect(function() {
  //   if(logingout) {
  //     setLogingout(false)
  //     // setloginstate({[userLoginStates_objkeys.logging_out]: true})
  //     dispatch({action: dispatchActions.loginrelated.logging_out})
  //   }
  // }, [logingout])

  // console.log(loginstate)
  console.log(state[reducerState_keys.loginState])

  // useeffect run after the component render / re-render, understandable

  // i'll place the shrinked image in main reducer state and the srink function in appjsx
  // if(loginstate[userLoginStates_objkeys.init]) return null
  if(state[reducerState_keys.showNav] === reducerState_posibleValues.showNav.init) return null
  // passing down the loginstate directly (because i need to send down the user info when they logged in)
  // make the memoized comp Inner do unnecessary re-renders
  // such like when loginstate change to initfail or logging_in or logging_fail, the inner navigation do not need
  // to re-render
  return <Inner showNav={state[reducerState_keys.showNav]} userinfo={state[reducerState_keys.userdata]}
  dispatch={dispatch} />
}


// protecting this route from unnecessary re-render from appContext useContext
const Inner = memo(function InnerNav(props) {
  // protect unnecessary re-rendering with conditional statement
  console.log('navigation inner re-render')

  return (
    <div className="navigation">
      <div className="nav_leftside">
        <div className="sidemenu">burger button</div>
        <div className="logo"><Link to={'/'}>Logo</Link></div>
      </div>
      <div className="nav_rightside">
        <Navrightside {...props} />
      </div>
    </div>
  )
})