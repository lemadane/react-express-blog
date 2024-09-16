import { Alert, Snackbar } from '@mui/material'
import { useToast } from '../common/contexts/ToastContext'

export type ToastSeverity = 'error' | 'warning' | 'info' | 'success'

export interface ToastState {
  visibility: boolean
  duration: number
  severity: ToastSeverity
  message: string
}

export function Toast() {
  const { toast, setToast } = useToast()

  const handleClose = () => {
    setToast({ ...toast, visibility: false })
  }

  return (
    <Snackbar
      open={toast.visibility}
      autoHideDuration={toast.duration}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={toast.severity}
        variant='filled'
        sx={{ width: '100%' }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  )
}
