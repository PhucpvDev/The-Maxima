interface NotificationProps {
    message?: string
    showProgress?: boolean
    pauseOnHover?: boolean
    duration?: number
    placement?: 'top' | 'topRight' | 'bottom' | 'bottomRight'
    onClose?: () => void
}