import { useContext, useState } from "react"
import { appContext } from "../../../appcontext"
import myfetch from "../../../fetch_config"
import { appcontext_keys } from "../../../objectModels"

// making react component for little stuff really help for modularity (talk as if i know wtf that word mean)
// it is not only about reuse but also added features, this comp only used for user desc in profile comp and
// mentioned only in profile comp and passed to popup comp. it can use context, useState and everything a comp
// can use. unlike using plain jsx to pass to popup comp.
export default function DescTextarea(props) {
  const [textareadesc, settextareadesc] = useState('')
  const [savingDesc, setSavingDesc] = useState(false)
  const [saveResultText, setSaveResultText] = useState('')

  const maincontext = useContext(appContext)
  const [add_popup, close_current_popup] = maincontext[appcontext_keys.popuparray_func]
  const memory1 = maincontext.memory1
  
  async function saveUserDesc() {
    setSavingDesc(true)
    const saveresult = await myfetch({
      method: 'POST',
      route: '/protected/userdesc',
      body: { newdesc: textareadesc }
    })
    setSavingDesc(false)
    if (!saveresult.result) {
      setSaveResultText(saveresult.error || saveresult.fail || JSON.stringify(saveresult))
    } else {
      // save desc success
      memory1.current.userinfo.userdesc = textareadesc
      setSaveResultText('Success...')
    }
  }

  const buttonInnerText = savingDesc ? 'Loading...' : 'Save'

  return (
    <>
      <textarea cols="60" rows="3" onChange={function (ev) { settextareadesc(ev.target.value) }}
        className='textareadesc'></textarea>
      <div className="userdesc_savecancel_wrap">
        <button onClick={saveUserDesc} disabled={savingDesc}>{buttonInnerText}</button>
        <button onClick={close_current_popup}>Close</button>
      </div>
      <span>{saveResultText}</span>
    </>
  )
}