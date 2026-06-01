import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register-users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/register-users"!</div>
}
