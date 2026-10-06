import { memo, useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { toast } from '@/utils/tools'
import { MUSIC_TOGGLE_MODE_LIST, MUSIC_TOGGLE_MODE } from '@/config/constant'
import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { updateSetting } from '@/core/common'
import { useTheme } from '@/store/theme/hook'
import { Icon } from '@/components/common/Icon'


export default memo(() => {
  const theme = useTheme()
  const togglePlayMethod = useSettingValue('player.togglePlayMethod')
  const t = useI18n()

  const toggleNextPlayMode = () => {
    let index = MUSIC_TOGGLE_MODE_LIST.indexOf(togglePlayMethod)
    if (++index >= MUSIC_TOGGLE_MODE_LIST.length) index = 0
    const mode = MUSIC_TOGGLE_MODE_LIST[index]
    updateSetting({ 'player.togglePlayMethod': mode })
    let modeName: 'play_list_loop' | 'play_list_random' | 'play_list_order' | 'play_single_loop' | 'play_single'
    switch (mode) {
      case MUSIC_TOGGLE_MODE.listLoop:
        modeName = 'play_list_loop'
        break
      case MUSIC_TOGGLE_MODE.random:
        modeName = 'play_list_random'
        break
      case MUSIC_TOGGLE_MODE.list:
        modeName = 'play_list_order'
        break
      case MUSIC_TOGGLE_MODE.singleLoop:
        modeName = 'play_single_loop'
        break
      default:
        modeName = 'play_single'
        break
    }
    toast(t(modeName))
  }

  const iconName = useMemo(() => {
    switch (togglePlayMethod) {
      case MUSIC_TOGGLE_MODE.listLoop:
        return 'list-loop'
      case MUSIC_TOGGLE_MODE.random:
        return 'list-random'
      case MUSIC_TOGGLE_MODE.list:
        return 'list-order'
      case MUSIC_TOGGLE_MODE.singleLoop:
        return 'single-loop'
      default:
        return 'single'
    }
  }, [togglePlayMethod])

  return (
    <TouchableOpacity
      style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center' }}
      activeOpacity={0.5}
      onPress={toggleNextPlayMode}
    >
      <Icon name={iconName} color={theme['c-font']} size={26} />
    </TouchableOpacity>
  )
})
