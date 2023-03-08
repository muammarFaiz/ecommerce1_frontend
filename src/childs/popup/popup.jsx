import { useContext } from 'react'
import { appContext } from '../../appcontext'
import { appcontext_keys, reducerState_keys } from '../../objectModels'
import './popup.css'

function Notif(props) {

  return (
    <>
      <p>{props.children || '...'}</p>
      {
        props.option === 'yesno' ?
        <>
          <button onClick={props.cbyes} autoFocus>yes</button>
          <button onClick={props.cbno}>no</button>
        </> :
        <button onClick={props.cbok} autoFocus>ok</button>
      }
    </>
  )
}

export default function Popup(props) {
  const maincontext = useContext(appContext)
  const memory1 = maincontext[appcontext_keys.memory1]
  const [state, dispatch] = maincontext[appcontext_keys.mainreducer]
  // const [popuparr_state, popuparr_set] = maincontext.popuparray
  const componentForPopup = memory1[appcontext_keys.memory1_current_keys.componentForPopup]
  if (state[reducerState_keys.popuparr].length < 1) return null
  const data = state[reducerState_keys.popuparr][0]

  // make a sketch flow chart
  // if(popuparr_state.length < 1) return null
  // const data = popuparr_state[0]

  return (
    <div className="popup_bg">
      <div className="popup_container">
        {data.notif ? <Notif {...data} /> : data === 'custom' ? componentForPopup : data.children}
      </div>
    </div>
  )
}