import { useRef, useState } from "react";
import { Form, redirect, useActionData, useNavigate } from "react-router-dom";
import myfetch from "../../fetch_config";

export default function Register(props) {
  const rendercount = useRef(0)
  const [submitFailInfo, setSubmitFailInfo] = useState('')
  const [buttonSubmitInnerText, setButtonSubmitInnerText] = useState('Submit')
  const [buttonDisable, setButtonDisable] = useState(false)
  const usernameInput = useRef()
  const passwordInput = useRef()
  const navigate = useNavigate()

  rendercount.current++

  async function handleFormSubmit(ev) {
    ev.preventDefault()
    if(!buttonDisable) {
      setButtonDisable(true)
      setButtonSubmitInnerText('Loading...')
      const jsonResult = await myfetch({
        method: 'POST',
        route: '/register',
        body: { username: usernameInput.current.value, password: passwordInput.current.value }
      })
      if (jsonResult.fail !== undefined || jsonResult.error !== undefined) {
        setSubmitFailInfo(jsonResult.fail || jsonResult.error)
        setButtonDisable(false)
        setButtonSubmitInnerText('Submit')
      } else navigate('/login')
    }
  }

  return (
    <>
      <p>render count: {rendercount.current}</p>
      <form method="post" onSubmit={handleFormSubmit}>
        <input type="text" name="username" placeholder="username" autoFocus ref={usernameInput} /><br />
        <input type="text" name="password" placeholder="password" ref={passwordInput} /><br />
        <button type="submit" disabled={buttonDisable}>{buttonSubmitInnerText}</button>
      </form>
      <p>{submitFailInfo}</p>
    </>
  )
  // make all the html jsx looks cleaner like this with no inline conditions unless necessary
}