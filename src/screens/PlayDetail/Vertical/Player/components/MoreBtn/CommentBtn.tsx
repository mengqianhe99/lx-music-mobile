import { TouchableOpacity } from 'react-native'
import { navigations } from '@/navigation'
import commonState from '@/store/common/state'
import { useTheme } from '@/store/theme/hook'
import { CommentIcon } from '../../../LineIcons'


export default () => {
  const theme = useTheme()
  const handleShowCommentScreen = () => {
    navigations.pushCommentScreen(commonState.componentIds.playDetail!)
  }

  return (
    <TouchableOpacity
      style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center' }}
      activeOpacity={0.5}
      onPress={handleShowCommentScreen}
    >
      <CommentIcon color={theme['c-font']} size={30} />
    </TouchableOpacity>
  )
}
