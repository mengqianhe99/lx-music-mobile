import { useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import MusicAddModal, { type MusicAddModalType } from '@/components/MusicAddModal'
import playerState from '@/store/player/state'
import { useTheme } from '@/store/theme/hook'
import { HeartPlusIcon } from '../../../LineIcons'


export default () => {
  const theme = useTheme()
  const musicAddModalRef = useRef<MusicAddModalType>(null)

  const handleShowMusicAddModal = () => {
    const musicInfo = playerState.playMusicInfo.musicInfo
    if (!musicInfo) return
    musicAddModalRef.current?.show({
      musicInfo: 'progress' in musicInfo ? musicInfo.metadata.musicInfo : musicInfo,
      isMove: false,
      listId: playerState.playMusicInfo.listId!,
    })
  }

  return (
    <>
      <TouchableOpacity
        style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center' }}
        activeOpacity={0.5}
        onPress={handleShowMusicAddModal}
      >
        <HeartPlusIcon color={theme['c-font']} />
      </TouchableOpacity>
      <MusicAddModal ref={musicAddModalRef} />
    </>
  )
}
