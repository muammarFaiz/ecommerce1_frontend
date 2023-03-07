import { useContext, useRef, useState } from "react"
import './profile.css'
import defaultprofilepic from '../../assets/defaultprofilepic.png'
import { appContext } from "../../appcontext"
import myfetch from "../../fetch_config"
import { appcontext_keys, dispatchActions, popuparray_keys, reducerState_keys } from "../../objectModels"
import DescTextarea from "./descTextarea/descTesxtarea"

const LOADING_STATE = {
  initial: '',
  loading: 'loading',
  fail: 'fail',
  done: 'done'
}

export default function UserProfile(props) {
  const fileinput = useRef()
  const canvasPreview = useRef()
  const [editedimg, setEditedimg] = useState('')
  const rendercount = useRef(0)
  const [loading, setloading] = useState({init: '', imgupload: '', savedesc: ''})
  const loadingfail_desc = useRef({init: '', imgupload: '', savedesc: ''})
  // const [popuptext, setpopuptext] = useState('')
  const [editDesc, setEditDesc] = useState(false)
  const [textareadesc, settextareadesc] = useState('')
  const [ovalimagehover, setovalimagehover] = useState('none')
  const [previewImgHover, setPreviewImgHover] = useState(false)
  const appcontext = useContext(appContext)
  const memory1 = appcontext.memory1
  // const [loginstate, setloginstate] = appcontext.loginstate
  const [state, dispatch] = appcontext[appcontext_keys.mainreducer]
  // const [display, setDisplay] = appcontext.display
  
  const [add_popup, close_current_popup] = appcontext[appcontext_keys.popuparray_func]


  function input_onchange_previewtheimage() {
    const imgFile = fileinput.current.files[0]
    const urlPreview = URL.createObjectURL(imgFile)
    const imgElem = document.createElement('img')
    imgElem.id = 'imgforcanvas'
    imgElem.src = urlPreview
    // took me an hour to figure out that i need the evenlistener onload so the image can be read by canvas context
    imgElem.onload = function () {
      const oriW = imgElem.width, oriH = imgElem.height
      const canvas = canvasPreview.current
      const ctx = canvas.getContext('2d')
      const cw = 250, ch = 300
      canvas.width = cw, canvas.height = ch
      // resize and crop while maintaining aspect ratio
      function editImgWithCanvas(oriW, oriH, cw, ch, ctx) {
        const sizeModifier = 50
        const distanceW = oriW - cw, distanceH = oriH - ch
        function resizeImgCalculation(shape) {
          let imgNewHeight, imgNewWidth
          if (shape === 'wide') {
            // BASIC MATH:
            // it is called scale (aspect ratio).
            // (oriW to oriH) or (oriW : oriH) or (oriW / oriH)

            imgNewHeight = ch + sizeModifier
            const imgNewHeightGrowShrinkRatio = (oriH / (oriH - imgNewHeight))
            const imgNewWidthGrowShrinkValue = oriW / imgNewHeightGrowShrinkRatio
            imgNewWidth = oriW - imgNewWidthGrowShrinkValue
          } else {
            imgNewWidth = cw + sizeModifier
            const imgNewWidthGrowShrinkRatio = (oriW / (oriW - imgNewWidth))
            const imgNewHeightGrowShrinkValue = oriH / imgNewWidthGrowShrinkRatio
            imgNewHeight = oriH - imgNewHeightGrowShrinkValue
          }
          return [imgNewHeight, imgNewWidth]
        }

        let newimgw, newimgh, newImgSize
        if (distanceW === distanceH) newimgw = cw, newimgh = ch
        else if (distanceW > distanceH) {
          newImgSize = resizeImgCalculation('wide')
        } else if (distanceW < distanceH) {
          newImgSize = resizeImgCalculation('tall')
        }
        newimgh = newImgSize[0]
        newimgw = newImgSize[1]
        ctx.drawImage(imgElem, (newimgw - cw) / -2, (newimgh - ch) / -2, newimgw, newimgh)
      }
      editImgWithCanvas(oriW, oriH, cw, ch, ctx)
      setEditedimg(canvas.toDataURL())
    }
  }
  
  // this might take a bit of time, make the profile work using declarative ui
  // move this function to app jsx
  async function form_onsubmit(ev) {
    ev.preventDefault()
    setloading({...loading, imgupload: LOADING_STATE.loading})
    try {
      const resultjson = await myfetch({
        method: 'POST',
        route: '/protected/profilepic',
        body: {action: 'replace', base64: editedimg}
      })      
        if(!resultjson.result) {
          loadingfail_desc.current.imgupload = resultjson.fail || resultjson.error || JSON.stringify(resultjson)
          setloading({...loading, imgupload: LOADING_STATE.fail})
          dispatch({
            action: dispatchActions.profilefailupdateimage_popup,
            value: {
            [popuparray_keys.notif]: true,
            [popuparray_keys.children]: `fail upload picture: ${
              resultjson.fail || resultjson.error || JSON.stringify(resultjson)
            }`,
            [popuparray_keys.cbok]: close_current_popup
          }
          })
          // add_popup({
          //   [popuparray_keys.notif]: true,
          //   [popuparray_keys.children]: `fail upload picture: ${
          //     resultjson.fail || resultjson.error || JSON.stringify(resultjson)
          //   }`,
          //   [popuparray_keys.cbok]: close_current_popup
          // })
        } else {
          // const loginobj = loginstate[userLoginStates_objkeys.logged_in]
          // setloginstate({...loginobj, [userLoginStates_objkeys.logged_in_keys.profilepic]: editedimg})
          dispatch({action: dispatchActions.changeUserImage, value: editedimg})
          // memory1.current.userinfo.profilepic = editedimg
          setEditedimg('')
          setloading({...loading, imgupload: LOADING_STATE.done})
          // setDisplay('update user profile picture')
        }
      } catch (error) {
        loadingfail_desc.current.imgupload = error.message
        setloading({...loading, imgupload: LOADING_STATE.fail})
        dispatch({
          action: dispatchActions.profilefailupdateimage_popup,
          value: {
            [popuparray_keys.notif]: true,
            [popuparray_keys.children]: `upload picture error: ${error.message}`,
            [popuparray_keys.cbok]: close_current_popup
          }
        })
        // add_popup({
        //   [popuparray_keys.notif]: true,
        //   [popuparray_keys.children]: `upload picture error: ${error.message}`,
        //   [popuparray_keys.cbok]: close_current_popup
        // })
    }
  }

  function imgpp_src() {
    // const pp = loginstate[userLoginStates_objkeys.logged_in][userLoginStates_objkeys.logged_in_keys.profilepic]
    const pp = state[reducerState_keys.userdata][reducerState_keys.userdata_keys.profilepic]
    if (pp === 'default' || pp === '' || pp === 'fail') return defaultprofilepic
    return pp
  }
  
  function previewImgUploadBtnDisplay() {
    if(editedimg !== '' && previewImgHover) return 'inline-block'
    return 'none'
  }

  function showTextarea() {
    // const textarea = (
    //   <>
    //     <textarea cols="60" rows="3" onChange={function(ev) {settextareadesc(ev.target.value)}}
    //     className='textareadesc'></textarea>
    //     <div className="userdesc_savecancel_wrap">
    //       <button onClick={saveUserDesc} disabled={ loading.savedesc === LOADING_STATE.loading || textareadesc === ''}>
    //         {loading.savedesc === LOADING_STATE.loading ? 'Loading' : 'Save'}
    //       </button>
    //       <button onClick={function() {close_current_popup()}}>Cancel</button>
    //     </div>
    //     <span>{loadingfail_desc.current.savedesc}</span>
    //   </>
    // )
    dispatch({
      action: dispatchActions.profileuserdesc_popup,
      value: <DescTextarea />,
    })
    // add_popup({[popuparray_keys.children]: <DescTextarea />})
  }

  rendercount.current++

  function userdesctext() {
    // const userdesc = loginstate[userLoginStates_objkeys.logged_in][userLoginStates_objkeys.logged_in_keys.userdesc]
    const userdesc = state[reducerState_keys.userdata][reducerState_keys.userdata_keys.userdesc]
    if(userdesc === '' || userdesc === undefined) return 'user description empty...'
    return userdesc
  }

  return (
    // this is why i should not use loader, because i dont know how function in loader can interact with
    // memory1 / appContext/
    <div className="userProfile_wrap">
      <div className="profie_header">
        <div className="flex_protection">
          <div className="profilepic_wrap" onMouseOver={function() {setovalimagehover('inline-block')}}
          onMouseOut={function() {setovalimagehover('none')}}>
            <img src={imgpp_src()} alt="profile pic" className='profilepic' width={250} height={300}/>
            <button onClick={function() {fileinput.current.click()}} className='changepic_btn'
            style={{display: ovalimagehover}}>change picture</button>
          </div>
        </div>
        <div className="ppuploadform_wrap" onMouseOver={function() {setPreviewImgHover(true)}}
        onMouseOut={function() {setPreviewImgHover(false)}}>
          <form method="post" onSubmit={form_onsubmit} className='ppform'>
            <input type="file" ref={fileinput} onChange={input_onchange_previewtheimage}
              accept='image/png, image/jpeg, image/jpg' className="profile_fileinput" />
            <br />
            <button type="submit" style={
              { display: previewImgUploadBtnDisplay() }
            } disabled={loading.imgupload === 'loading'}>
              {loading.imgupload === 'loading' ? 'loading' : 'Submit'}
            </button>
          </form>
          {/* make a pop up of this: */}
          {/* no need popup for a failure unless really necessary like no network connection found */}
          <div className="previewImages">
            <canvas ref={canvasPreview} className="maincanvas"></canvas>
            <img src={editedimg} alt="" className='imgpreview' />
          </div>
        </div>
      </div>
      <hr />
      <p>render count: {rendercount.current}</p>


      <hr />
      <p onClick={showTextarea} className='userdesc_p'>
        {userdesctext()}
      </p>
    </div>
  )
}