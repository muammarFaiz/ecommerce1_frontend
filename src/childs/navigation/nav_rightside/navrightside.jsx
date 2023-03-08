import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { appcontext_keys, dispatchActions, popuparray_keys, reducerState_posibleValues } from "../../../objectModels"
import Profileimgbtn from "./navppbutton"

export default function Navrightside({showNav, userinfo, dispatch}) {
  const [resized_img, setResized_img] = useState('')
  const [dropdownon, setDropdownon] = useState(false)

  useEffect(function () {
    function handleClick(ev) {
      const elemClass = ev.target.classList[0]
      if (elemClass !== 'dropdownAndImg') {
        // setUlStyleDisplayValue('none')
        setDropdownon(false)
      }
    }
    document.body.addEventListener('click', handleClick)
    return function () {
      document.body.removeEventListener('click', handleClick)
    }
  }, [])

  function handleLogout(ev) {
    ev.preventDefault()
    // how to send to parent?
    setResized_img('')
    dispatch({
      action: dispatchActions.loginrelated.logging_out,
      value: {[popuparray_keys.children]: 'Loging out...'}
    })
  }
  function uldropstyle() {
    return {display: dropdownon ? 'block' : 'none'}
  }
  const profileimgbtn_props = {
    resized_img, setResized_img, dropdownon, setDropdownon, userinfo: userinfo
  }

  if (showNav === reducerState_posibleValues.showNav.loggedin ||
    showNav === reducerState_posibleValues.showNav.changepp) {
    return (
      <>
        <div className="cart">cart</div>
        <div className="nav_pp_wrap">
          <Profileimgbtn {...profileimgbtn_props}  />
          <ul className='dropdownAndImg dropdown_ul' style={uldropstyle()}>
            <li className='dropdownAndImg'><Link to={'profile'}>Profile</Link></li>
            <li className='dropdownAndImg'><a onClick={handleLogout}>Logout</a></li>
          </ul>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="login">login</div>
        <div className="register">register</div>
      </>
    )
  }
}