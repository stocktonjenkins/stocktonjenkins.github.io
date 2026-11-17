import React from 'react'

export const Loading = () => (
  <div className="bl-state">
    <span className="bl-spinner" />
  </div>
)

export const Message = ({
  title,
  art,
  children,
}: {
  title: string
  art?: React.ReactNode
  children?: React.ReactNode
}) => (
  <div className="bl-state">
    {art}
    <h2>{title}</h2>
    {children && <div className="bl-state-body">{children}</div>}
  </div>
)
