import { memo, useRef } from 'react'
import TimeoutExitEditModal, { type TimeoutExitEditModalType, useTimeInfo } from '@/components/TimeoutExitEditModal'
import { ClockBtn } from './HeaderIcons'


export default memo(() => {
  const modalRef = useRef<TimeoutExitEditModalType>(null)

  const timeInfo = useTimeInfo()

  const handleShow = () => {
    modalRef.current?.show()
  }

  return (
    <>
      <ClockBtn active={timeInfo.active} onPress={handleShow} />
      <TimeoutExitEditModal ref={modalRef} timeInfo={timeInfo} />
    </>
  )
})
