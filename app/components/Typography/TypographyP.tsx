export function TypographyP({className, children}:{className?:string,children:React.ReactNode}) {
    return (
      <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
        {children}
      </p>
    )
  }
  