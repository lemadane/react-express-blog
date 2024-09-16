import { createContext, ReactNode, useContext, useState } from 'react'
import { ToastState } from '../../components/Toast'

type ToastContextType = {
  toast: ToastState
  setToast: (toast: ToastState) => void
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType)

export type ToastProviderProps = {
  children: ReactNode
}

function ToastProvider(props: ToastProviderProps) {
  const { children } = props
  const [toast, setToast] = useState<ToastState>({
    visibility: false,
    duration: 6000,
    severity: 'info',
    message: '',
  })

  return (
    <ToastContext.Provider
      value={{
        toast,
        setToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export { ToastProvider, useToast };
