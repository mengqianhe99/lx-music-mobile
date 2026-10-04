import { memo } from 'react'

// import Section from '../../components/Section'
import Theme from './Theme'
import CustomPrimary from './CustomPrimary'
import IsAutoTheme from './IsAutoTheme'
import IsHideBgDark from './IsHideBgDark'
import IsDynamicBg from './IsDynamicBg'
import IsFontShadow from './IsFontShadow'
// import { useI18n } from '@/lang/i18n'

export default memo(() => {
  return (
    <>
      <Theme />
      <CustomPrimary />
      <IsAutoTheme />
      <IsHideBgDark />
      <IsDynamicBg />
      <IsFontShadow />
    </>
  )
})
