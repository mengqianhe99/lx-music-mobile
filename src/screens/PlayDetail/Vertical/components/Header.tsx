import { memo, useRef } from 'react'

import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { pop } from '@/navigation'
import StatusBar from '@/components/common/StatusBar'
import { useTheme } from '@/store/theme/hook'
import { scaleSizeH } from '@/utils/pixelRatio'
import { HEADER_HEIGHT as _HEADER_HEIGHT, NAV_SHEAR_NATIVE_IDS } from '@/config/constant'
import commonState from '@/store/common/state'
import SettingPopup, { type SettingPopupType } from '../../components/SettingPopup'
import { useStatusbarHeight } from '@/store/common/hook'
import CommentBtn from '../Player/components/MoreBtn/CommentBtn'
import { BackIcon } from '../LineIcons'
import { Icon } from '@/components/common/Icon'

export const HEADER_HEIGHT = scaleSizeH(_HEADER_HEIGHT)

export default memo(() => {
  const theme = useTheme()
  const popupRef = useRef<SettingPopupType>(null)
  const statusBarHeight = useStatusbarHeight()

  const back = () => {
    void pop(commonState.componentIds.playDetail!)
  }
  const showSetting = () => {
    popupRef.current?.show()
  }

  return (
    <View style={{ height: HEADER_HEIGHT + statusBarHeight, paddingTop: statusBarHeight }} nativeID={NAV_SHEAR_NATIVE_IDS.playDetail_header}>
      <StatusBar />
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.5} onPress={back}>
          <BackIcon color={theme['c-font']} />
        </TouchableOpacity>
        <View style={styles.spacer} />
        <View style={styles.iconBtn}>
          <CommentBtn />
        </View>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.5} onPress={showSetting}>
          <Icon name="gear" color={theme['c-font']} rawSize={28} />
        </TouchableOpacity>
      </View>
      <SettingPopup ref={popupRef} direction="vertical" />
    </View>
  )
})


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
  },
  spacer: {
    flex: 1,
  },
  iconBtn: {
    width: 52,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
