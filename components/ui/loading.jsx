import { Loader2 } from "lucide-react"

export function LoadingSpinner({ size = "default", text = "Carregando..." }) {
  const sizeClass = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  }[size]

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className={`${sizeClass} animate-spin text-primary`} />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function FullPageLoading({ message = "Carregando..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}
