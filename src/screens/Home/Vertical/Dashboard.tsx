import { memo } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useI18n } from '@/lang'
import { useTheme } from '@/store/theme/hook'
import { usePlayerMusicInfo, useIsPlay, useProgress } from '@/store/player/hook'
import { togglePlay } from '@/core/player/player'
import { navigations } from '@/navigation'
import commonState from '@/store/common/state'
import { Icon } from '@/components/common/Icon'
import Image from '@/components/common/Image'
import Text from '@/components/common/Text'
import { confirmDialog, createStyle } from '@/utils/tools'
import { NAV_MENUS } from '@/config/constant'
import { exitApp, setNavActiveId } from '@/core/common'
import { useSettingValue } from '@/store/setting/hook'
import { setHomeTab } from './homeTab'

// 主色偏亮时图标用深色，偏暗时用白色
const getOnPrimaryColor = (primary: string) => {
  const nums = primary.match(/\d+/g)
  if (!nums || nums.length < 3) return '#fff'
  const [r, g, b] = nums.map(Number)
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#0B0B0F' : '#ffffff'
}

// 进度条单独一个组件，只有它每秒刷新
const CardProgress = memo(() => {
  const theme = useTheme()
  const { progress } = useProgress()
  return (
    <View style={{ ...styles.track, backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : theme['c-primary-alpha-700'] }}>
      <View style={{ ...styles.trackFill, width: `${progress * 100}%`, backgroundColor: theme['c-primary'] }} />
    </View>
  )
})

const NowPlayingCard = memo(() => {
  const theme = useTheme()
  const musicInfo = usePlayerMusicInfo()
  const isPlay = useIsPlay()
  const hasMusic = !!musicInfo.id

  const openDetail = () => {
    if (!hasMusic) return
    navigations.pushPlayDetailScreen(commonState.componentIds.home!)
  }
  const goSearch = () => {
    setNavActiveId('nav_search')
    setHomeTab('nav_search')
  }

  return (
    <TouchableOpacity
      style={{ ...styles.card, backgroundColor: theme['c-primary-alpha-900'] }}
      activeOpacity={hasMusic ? 0.8 : 1}
      onPress={openDetail}
    >
      <View style={styles.cardRow}>
        {
          hasMusic
            ? <Image url={musicInfo.pic} style={styles.cover} />
            : <View style={{ ...styles.cover, backgroundColor: theme['c-primary-alpha-800'] }} />
        }
        <View style={styles.cardInfo}>
          <Text size={12} color={theme['c-primary']}>{hasMusic ? '正在播放' : '还没有歌曲'}</Text>
          <Text style={styles.cardTitle} size={19} numberOfLines={1} color={theme['c-font']}>
            {hasMusic ? musicInfo.name : '去搜索一首吧'}
          </Text>
          <Text size={13} numberOfLines={1} color={theme['c-font-label']}>
            {hasMusic ? musicInfo.singer : '搜到喜欢的歌，点一下就能播放'}
          </Text>
        </View>
        {
          hasMusic
            ? (
                <TouchableOpacity
                  style={{ ...styles.playBtn, backgroundColor: theme['c-primary'] }}
                  activeOpacity={0.7}
                  onPress={togglePlay}
                >
                  <Icon
                    name={isPlay ? 'pause' : 'play'}
                    color={getOnPrimaryColor(theme['c-primary'])}
                    rawSize={20}
                    style={isPlay ? undefined : { transform: [{ translateX: 3 }] }}
                  />
                </TouchableOpacity>
              )
            : (
                <TouchableOpacity
                  style={{ ...styles.searchBtn, backgroundColor: theme['c-primary'] }}
                  activeOpacity={0.7}
                  onPress={goSearch}
                >
                  <Text size={14} color={getOnPrimaryColor(theme['c-primary'])}>去搜索</Text>
                </TouchableOpacity>
              )
        }
      </View>
      {hasMusic ? <CardProgress /> : null}
    </TouchableOpacity>
  )
})

export default memo(() => {
  const theme = useTheme()
  const t = useI18n()
  const showExitBtn = useSettingValue('common.showExitBtn')
  const tiles = NAV_MENUS.filter(m => String(m.id) != 'nav_setting')

  const handleExit = () => {
    void confirmDialog({
      message: global.i18n.t('exit_app_tip'),
      confirmButtonText: global.i18n.t('list_remove_tip_button'),
    }).then(isExit => {
      if (!isExit) return
      exitApp('Exit Btn')
    })
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <NowPlayingCard />

      <Text style={styles.sectionTitle} size={16} color={theme['c-font']}>快速入口</Text>
      <View style={styles.grid}>
        {
          tiles.map(m => (
            <TouchableOpacity
              key={m.id}
              style={{ ...styles.tile, backgroundColor: theme['c-primary-alpha-900'] }}
              activeOpacity={0.6}
              onPress={() => {
                setNavActiveId(m.id)
                setHomeTab(m.id)
              }}
            >
              <Icon name={m.icon} rawSize={28} color={theme['c-primary']} style={styles.tileIcon} />
              <Text style={styles.tileText} size={16} color={theme['c-font']}>{t(m.id)}</Text>
            </TouchableOpacity>
          ))
        }
      </View>

      {
        showExitBtn
          ? (
              <TouchableOpacity style={styles.exitBtn} activeOpacity={0.5} onPress={handleExit}>
                <Text size={14} color={theme['c-font-label']}>退出应用</Text>
              </TouchableOpacity>
            )
          : null
      }
    </ScrollView>
  )
})

const styles = createStyle({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 26,
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    width: 84,
    height: 84,
    borderRadius: 20,
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 14,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  track: {
    height: 4,
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  trackFill: {
    height: 4,
    borderRadius: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  tileIcon: {
    width: 44,
    textAlign: 'left',
  },
  tileText: {
    marginTop: 14,
    fontWeight: 'bold',
  },
  exitBtn: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 12,
  },
})
