import { useEffect, useMemo, useState } from 'react'
import defaultprofilepic from '../../../assets/defaultprofilepic.png'
import { appcontext_keys, reducerState_keys, resizeimg } from '../../../objectModels'

export default function Profileimgbtn({
  // resized_img,
  // setResized_img,
  dropdownon,
  setDropdownon,
  userinfo,
}) {
  const [smallimage, setSmallimage] = useState('')
  // const profilepic = userinfo.profilepic

  // const imgsrcIsDefault = useMemo(function () {
  //   return !profilepic || profilepic === 'default' || profilepic === 'fail'
  // }, [profilepic])

  // function resizeimg() {
  //   if (profilepic !== '') {
  //     const img = document.createElement('img')
  //     img.src = imgsrcIsDefault ? defaultprofilepic : profilepic
  //     img.onload = function () {
  //       const canvas = document.createElement('canvas')
  //       canvas.height = 100
  //       canvas.width = 100
  //       const ctx = canvas.getContext('2d')
  //       const imgSizeDivider = imgsrcIsDefault ? 1 : 2.5
  //       function centerimg(imgwh, canvaswh) {
  //         const gap = (imgwh / imgSizeDivider) - canvaswh
  //         return gap / -2
  //       }
  //       ctx.drawImage(
  //         img,
  //         centerimg(img.width, canvas.width),
  //         centerimg(img.height, canvas.height),
  //         img.width / imgSizeDivider,
  //         img.height / imgSizeDivider
  //       )
  //       setResized_img(canvas.toDataURL())
  //     }
  //   }
  // }

  // useEffect(function () {
  //   console.log('resize running')
  //   resizeimg()
  // }, [profilepic])

  useEffect(function() {
    async function resize() {
      const result = await resizeimg(
        userinfo[reducerState_keys.userdata_keys.profilepic], document, defaultprofilepic
      )
      setSmallimage(result)
    }
    resize()
  }, [userinfo[reducerState_keys.userdata_keys.profilepic]])

  function showDropdown_switch(val) {
    // used in keydown and onclick
    if (val.key === undefined || val.key === 'Enter') {
      setDropdownon(!dropdownon)
    }
  }

  return <img src={smallimage} alt="" className='dropdownAndImg navpp'
  onClick={showDropdown_switch} onKeyDown={showDropdown_switch} tabIndex={0} />
}