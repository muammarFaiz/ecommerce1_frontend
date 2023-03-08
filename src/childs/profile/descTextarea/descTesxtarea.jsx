import { useContext, useRef, useState } from "react"
import { appContext } from "../../../appcontext"
import myfetch from "../../../fetch_config"
import { appcontext_keys, dispatchActions } from "../../../objectModels"

const editorStates = {
  standby: 'standby',
  submitting: 'submitting',
  fail: 'fail'
}

// making react component for little stuff really help for modularity (talk as if i know wtf that word mean)
// it is not only about reuse but also added features, this comp only used for user desc in profile comp and
// mentioned only in profile comp and passed to popup comp. it can use context, useState and everything a comp
// can use. unlike using plain jsx to pass to popup comp.
export default function DescTextarea(props) {
  const [saveResultText, setSaveResultText] = useState('')
  const [editorState, setEditorState] = useState(editorStates.standby)
  const textareatag = useRef(null)

  const maincontext = useContext(appContext)
  const [add_popup, close_current_popup] = maincontext[appcontext_keys.popuparray_func]
  const [state, dispatch] = maincontext[appcontext_keys.mainreducer]
  
  async function saveUserDesc() {
    setEditorState(editorStates.submitting)
    const saveresult = await myfetch({
      method: 'POST',
      route: '/protected/userdesc',
      body: { newdesc: textareatag.current.value }
    })
    setEditorState(editorStates.standby)
    if (!saveresult.result) {
      setSaveResultText(saveresult.error || saveresult.fail || JSON.stringify(saveresult))
    } else {
      // save desc success
      dispatch({
        action: dispatchActions.changeUserDesc,
        value: textareatag.current.value
      })
      setSaveResultText('Success...')
    }
  }

  const buttonInnerText = editorState === editorStates.submitting ? 'Loading...' : 'Save'
  const saveBtnDisable = editorState === editorStates.submitting

  return (
    <>
      <textarea cols="60" rows="3" ref={textareatag} className='textareadesc'></textarea>
      <div className="userdesc_savecancel_wrap">
        <button onClick={saveUserDesc} disabled={saveBtnDisable}>{buttonInnerText}</button>
        <button onClick={close_current_popup}>Close</button>
      </div>
      <span>{saveResultText}</span>
    </>
  )
}